import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createRouteHandlerClient } from '@/lib/supabase';
import Stripe from 'stripe';
import type { Database } from '@/lib/database.types';

type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Disable body parsing for webhook route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    console.log('Webhook received:', {
      hasSignature: !!signature,
      hasWebhookSecret: !!webhookSecret,
      bodyLength: body.length,
    });

    if (!signature) {
      console.error('Webhook missing signature');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook event verified:', event.type, event.id);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = await createRouteHandlerClient();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.client_reference_id;
        
        console.log('Processing checkout.session.completed:', {
          customerId,
          subscriptionId,
          userId,
        });

        if (!userId) {
          console.error('No user_id in client_reference_id');
          return NextResponse.json({ error: 'No user ID in session' }, { status: 400 });
        }

        if (!customerId || !subscriptionId) {
          console.error('Missing customer or subscription ID:', { customerId, subscriptionId });
          return NextResponse.json({ error: 'Missing customer or subscription ID' }, { status: 400 });
        }

        // Update subscription status
        const { error: subError } = await (supabase
          .from('subscriptions') as any)
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_name: 'unlimited_pro',
            last_webhook_event: event as unknown as Database['public']['Tables']['subscriptions']['Row']['last_webhook_event'],
          } as SubscriptionInsert);

        if (subError) {
          console.error('Error updating subscriptions table:', subError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        // Update user profile
        const { error: profileError } = await (supabase
          .from('profiles') as any)
          .update({ subscription_status: 'active' } as ProfileUpdate)
          .eq('id', userId);

        if (profileError) {
          console.error('Error updating profiles table:', profileError);
          return NextResponse.json({ error: 'Profile update failed' }, { status: 500 });
        }

        console.log('Successfully updated subscription for user:', userId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const { data: subData } = await (supabase
          .from('subscriptions') as any)
          .select('user_id, current_period_end')
          .eq('stripe_customer_id', customerId)
          .single();

        if (subData) {
          const periodEnd = new Date(subscription.current_period_end * 1000);
          
          await (supabase
            .from('subscriptions') as any)
            .update({
              current_period_end: periodEnd.toISOString(),
              last_webhook_event: event as unknown as Database['public']['Tables']['subscriptions']['Row']['last_webhook_event'],
            } as SubscriptionUpdate)
            .eq('user_id', subData.user_id);
          // Update status based on subscription status
          const newStatus = subscription.status === 'active' ? 'active' : 'free';
          await (supabase
            .from('profiles') as any)
            .update({ subscription_status: newStatus } as ProfileUpdate)
            .eq('id', subData.user_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user and revert to free tier
        const { data: subData } = await (supabase
          .from('subscriptions') as any)
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (subData) {
          await (supabase
            .from('profiles') as any)
            .update({ 
              subscription_status: 'free',
              ai_insight_count_free: 5, // Reset to 5 free insights
            } as ProfileUpdate)
            .eq('id', subData.user_id);

          await (supabase
            .from('subscriptions') as any)
            .update({
              stripe_subscription_id: null,
              plan_name: 'free',
              last_webhook_event: event as unknown as Database['public']['Tables']['subscriptions']['Row']['last_webhook_event'],
            } as SubscriptionUpdate)
            .eq('user_id', subData.user_id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}