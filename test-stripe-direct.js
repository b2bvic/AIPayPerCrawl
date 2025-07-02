#!/usr/bin/env node

// Test Stripe API directly
const STRIPE_SECRET_KEY = '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';

async function testStripeAPI() {
  console.log('🔑 Testing Stripe API directly...');
  console.log('');

  try {
    // Test 1: Create a simple checkout session
    console.log('1️⃣ Creating Stripe checkout session...');
    
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': 'https://example.com/success',
        'cancel_url': 'https://example.com/cancel',
        'line_items[0][price_data][currency]': 'USD',
        'line_items[0][price_data][product_data][name]': 'Test Product',
        'line_items[0][price_data][unit_amount]': '100', // $1.00
        'line_items[0][quantity]': '1',
      }),
    });

    console.log('   Status:', response.status);
    
    if (response.ok) {
      const session = await response.json();
      console.log('✅ Stripe checkout session created successfully!');
      console.log('   Session ID:', session.id);
      console.log('   URL:', session.url);
    } else {
      const error = await response.json();
      console.log('❌ Stripe API error:');
      console.log(JSON.stringify(error, null, 2));
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  console.log('');

  try {
    // Test 2: Retrieve account info
    console.log('2️⃣ Testing account access...');
    
    const accountResponse = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    });

    console.log('   Status:', accountResponse.status);
    
    if (accountResponse.ok) {
      const account = await accountResponse.json();
      console.log('✅ Account access successful!');
      console.log('   Account ID:', account.id);
      console.log('   Country:', account.country);
      console.log('   Currency:', account.default_currency);
    } else {
      const error = await accountResponse.json();
      console.log('❌ Account access error:');
      console.log(JSON.stringify(error, null, 2));
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

testStripeAPI(); 