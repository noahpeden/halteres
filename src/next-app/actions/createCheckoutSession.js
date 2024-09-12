'use server'

import Stripe from 'stripe'
import { createClient } from '../../utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createCheckoutSession(userId) {
  const supabase = createClient()

  // Verify the user's current status
  const { data: user, error: userError } = await supabase.from('users').select('is_premium').eq('id', userId).single()

  if (userError) {
    throw new Error('Error fetching user data')
  }

  if (user.is_premium) {
    throw new Error('User is already a premium member')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Workout Generation'
            },
            unit_amount: 1000 // $10.00
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/metcon/${userId}`,
      client_reference_id: userId
    })

    return { sessionId: session.id }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}
