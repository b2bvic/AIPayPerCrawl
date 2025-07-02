#!/usr/bin/env node

// Test script for Stripe integration
const BASE_URL = process.argv[2] === 'production' 
  ? 'https://aipaypercrawl.pages.dev' 
  : 'http://localhost:8788';

const API_KEY = 'test-api-key-123';

async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  }
}

async function testStripeIntegration() {
  console.log('🔧 Testing Stripe Integration...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log('');

  // Step 1: Create a quote
  console.log('1️⃣ Creating quote...');
  const quoteResponse = await apiCall('/quote', 'POST', {
    urls: [
      'https://example.com/page1',
      'https://example.com/page2'
    ]
  });

  if (!quoteResponse.ok) {
    console.log('❌ Failed to create quote:', quoteResponse.data?.error || quoteResponse.error);
    return false;
  }

  const quoteId = quoteResponse.data.quoteId;
  console.log(`✅ Quote created: ${quoteId}`);
  console.log(`   Total: $${quoteResponse.data.totalPrice} ${quoteResponse.data.currency}`);
  console.log('');

  // Step 2: Create checkout session
  console.log('2️⃣ Creating Stripe checkout session...');
  const checkoutResponse = await apiCall('/checkout', 'POST', {
    quoteId,
    returnUrl: 'https://aipaypercrawl.com/dashboard?payment=success',
    cancelUrl: 'https://aipaypercrawl.com/dashboard?payment=cancelled'
  });

  if (!checkoutResponse.ok) {
    console.log('❌ Failed to create checkout session:', checkoutResponse.data?.error || checkoutResponse.error);
    return false;
  }

  console.log('✅ Stripe checkout session created successfully!');
  console.log(`   Session ID: ${checkoutResponse.data.sessionId}`);
  console.log(`   Checkout URL: ${checkoutResponse.data.checkoutUrl}`);
  console.log(`   Total Amount: $${checkoutResponse.data.totalAmount} ${checkoutResponse.data.currency}`);
  console.log('');

  // Step 3: Check session status
  console.log('3️⃣ Checking checkout session status...');
  const statusResponse = await apiCall(`/checkout?sessionId=${checkoutResponse.data.sessionId}`, 'GET');

  if (!statusResponse.ok) {
    console.log('❌ Failed to get session status:', statusResponse.data?.error || statusResponse.error);
    return false;
  }

  console.log('✅ Session status retrieved successfully!');
  console.log(`   Payment Status: ${statusResponse.data.paymentStatus}`);
  console.log(`   Crawl Status: ${statusResponse.data.status}`);
  console.log('');

  return true;
}

async function testWebhookEndpoint() {
  console.log('4️⃣ Testing webhook endpoint...');
  
  // Test webhook endpoint exists
  const webhookResponse = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': 'test-signature'
    },
    body: JSON.stringify({
      id: 'evt_test',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test',
          metadata: {
            quote_id: 'test-quote',
            api_key: 'test-key'
          }
        }
      }
    })
  });

  if (webhookResponse.status === 200 || webhookResponse.status === 400) {
    console.log('✅ Webhook endpoint is accessible');
    console.log(`   Status: ${webhookResponse.status}`);
  } else {
    console.log(`⚠️  Webhook endpoint returned status: ${webhookResponse.status}`);
  }
  
  console.log('');
}

async function main() {
  console.log('🧪 AIPayPerCrawl Stripe Integration Test');
  console.log('==========================================');
  console.log('');

  try {
    const success = await testStripeIntegration();
    await testWebhookEndpoint();

    if (success) {
      console.log('🎉 All Stripe integration tests passed!');
      console.log('');
      console.log('📋 Next Steps:');
      console.log('1. Configure webhook in Stripe dashboard:');
      console.log('   URL: https://aipaypercrawl.com/api/webhooks/stripe');
      console.log('   Events: checkout.session.completed, payment_intent.succeeded, payment_intent.payment_failed, checkout.session.expired');
      console.log('2. Test actual payment flow with real checkout session');
      console.log('3. Monitor webhook events in Stripe dashboard');
    } else {
      console.log('❌ Some tests failed. Check the configuration.');
    }
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

main(); 