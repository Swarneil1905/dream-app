import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database } from '@/lib/database.types';

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Use service role key for server-side operations that need to bypass RLS
const getAdminSupabase = () => {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return null;
};

// Route configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, customerId } = await request.json();

    if (!userId && !customerId) {
      return NextResponse.json(
        { error: 'Either userId or customerId is required' },
        { status: 400 }
      );
    }

    const supabase = await createRouteHandlerClient();
    const adminSupabase = getAdminSupabase();
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If userId is provided, verify it matches the authenticated user
    if (userId && userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized: userId mismatch' }, { status: 403 });
    }

    let targetUserId = userId || user.id;

    // If customerId is provided, find the user
    if (customerId && !userId) {
      const { data: subData } = await (supabase
        .from('subscriptions') as any)
        .select('user_id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (!subData) {
        return NextResponse.json(
          { error: 'No subscription found for this customer ID' },
          { status: 404 }
        );
      }
      targetUserId = (subData as Pick<SubscriptionRow, 'user_id'>).user_id;
    }

    // Get customer ID from database if not provided
    let targetCustomerId = customerId;
    if (!targetCustomerId && targetUserId) {
      const { data: subData } = await (supabase
        .from('subscriptions') as any)
        .select('stripe_customer_id')
        .eq('user_id', targetUserId)
        .single();

      targetCustomerId = (subData as Pick<SubscriptionRow, 'stripe_customer_id'> | null)?.stripe_customer_id || undefined;
    }

    if (!targetCustomerId) {
      // Search Stripe for customer by email
      const customers = await stripe.customers.list({
        email: user.email || undefined,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return NextResponse.json(
          { error: 'No Stripe customer found. Please complete checkout first.' },
          { status: 404 }
        );
      }

      targetCustomerId = customers.data[0].id;
    }

    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: targetCustomerId,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // No active subscription found
      await (supabase
        .from('profiles') as any)
        .update({ subscription_status: 'free' } as ProfileUpdate)
        .eq('id', targetUserId);

      await (supabase
        .from('subscriptions') as any)
        .update({
          plan_name: 'free',
          stripe_subscription_id: null,
        } as SubscriptionUpdate)
        .eq('user_id', targetUserId);

      return NextResponse.json({
        message: 'No active subscription found',
        subscription_status: 'free',
      });
    }

    const subscription = subscriptions.data[0];
    const isActive = subscription.status === 'active' || subscription.status === 'trialing';

    // Update database
    const periodEnd = new Date(subscription.current_period_end * 1000);

    console.log('Updating subscriptions table:', {
      user_id: targetUserId,
      stripe_customer_id: targetCustomerId,
      stripe_subscription_id: subscription.id,
      plan_name: isActive ? 'unlimited_pro' : 'free',
    });

    // Use admin client to bypass RLS for upsert operation
    const dbClient = adminSupabase || supabase;
    
    // First, try to update existing record
    const { data: existingSub } = await dbClient
      .from('subscriptions')
      .select('user_id')
      .eq('user_id', targetUserId)
      .single();

    let subData;
    let subError;

    if (existingSub) {
      // Update existing record
      const { data, error } = await (dbClient
        .from('subscriptions') as any)
        .update({
          stripe_customer_id: targetCustomerId,
          stripe_subscription_id: subscription.id,
          current_period_end: periodEnd.toISOString(),
          plan_name: isActive ? 'unlimited_pro' : 'free',
        } as SubscriptionUpdate)
        .eq('user_id', targetUserId)
        .select()
        .single();
      
      subData = data;
      subError = error;
    } else {
      // Insert new record (use admin client to bypass RLS)
      if (!adminSupabase) {
        return NextResponse.json(
          { error: 'Service role key not configured. Cannot insert subscription record.' },
          { status: 500 }
        );
      }
      
      const { data, error } = await (adminSupabase
        .from('subscriptions') as any)
        .insert({
          user_id: targetUserId,
          stripe_customer_id: targetCustomerId,
          stripe_subscription_id: subscription.id,
          current_period_end: periodEnd.toISOString(),
          plan_name: isActive ? 'unlimited_pro' : 'free',
        })
        .select()
        .single();
      
      subData = data;
      subError = error;
    }

    if (subError) {
      console.error('Error updating subscriptions:', subError);
      return NextResponse.json(
        { error: `Failed to update subscriptions: ${subError.message}`, details: subError },
        { status: 500 }
      );
    }

    console.log('Subscriptions updated:', subData);

    // Update profile using admin client to ensure it works
    const profileClient = adminSupabase || supabase;
    const { error: profileError } = await (profileClient
      .from('profiles') as any)
      .update({
        subscription_status: isActive ? 'active' : 'free',
      } as ProfileUpdate)
      .eq('id', targetUserId);

    if (profileError) {
      console.error('Error updating profiles:', profileError);
      return NextResponse.json(
        { error: `Failed to update profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    // Verify the update worked using admin client
    const { data: verifyData, error: verifyError } = await (adminSupabase || supabase)
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, current_period_end, plan_name')
      .eq('user_id', targetUserId)
      .single();

    if (verifyError || !verifyData) {
      console.error('Verification failed:', verifyError);
    } else {
      console.log('Verified subscription data:', verifyData);
    }

    return NextResponse.json({
      message: 'Subscription synced successfully',
      subscription_status: isActive ? 'active' : 'free',
      subscription_id: subscription.id,
      customer_id: targetCustomerId,
      verified: verifyData,
    });
  } catch (error) {
    console.error('Sync subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync subscription' },
      { status: 500 }
    );
  }
}
