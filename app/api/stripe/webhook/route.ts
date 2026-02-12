import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createRouteHandlerClient } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
        if (userId) {
          // Update subscription status
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_name: 'unlimited_pro',
              last_webhook_event: event,
            });

          // Update user profile
          await supabase
            .from('profiles')
            .update({ subscription_status: 'active' })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id, current_period_end')
          .eq('stripe_customer_id', customerId)
          .single();

        if (subData) {
          const periodEnd = new Date(subscription.current_period_end * 1000);
          
          await supabase
            .from('subscriptions')
            .update({
              current_period_end: periodEnd.toISOString(),
              last_webhook_event: event,
            })
            .eq('user_id', subData.user_id);
          // Update status based on subscription status
          const newStatus = subscription.status === 'active' ? 'active' : 'free';
          await supabase
            .from('profiles')
            .update({ subscription_status: newStatus })
            .eq('id', subData.user_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user and revert to free tier
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (subData) {
          await supabase
            .from('profiles')
            .update({ 
              subscription_status: 'free',
              ai_insight_count_free: 5, // Reset to 5 free insights
            })
            .eq('id', subData.user_id);

          await supabase
            .from('subscriptions')
            .update({
              stripe_subscription_id: null,
              plan_name: 'free',
              last_webhook_event: event,
            })
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