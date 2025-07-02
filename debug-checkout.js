#!/usr/bin/env node

// Debug script for checkout API
const BASE_URL = 'https://aipaypercrawl.pages.dev';

async function debugCheckout() {
  console.log('🔍 Debugging Checkout API...');
  console.log('');

  // Step 1: Create a quote
  console.log('1️⃣ Creating quote...');
  const quoteResponse = await fetch(`${BASE_URL}/api/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'test-api-key-123'
    },
    body: JSON.stringify({
      urls: ['https://example.com/test']
    })
  });

  if (!quoteResponse.ok) {
    console.log('❌ Failed to create quote');
    return;
  }

  const quote = await quoteResponse.json();
  console.log('✅ Quote created:', quote.quoteId);
  console.log('   Total:', quote.totalCost);
  console.log('');

  // Step 2: Test checkout without API key
  console.log('2️⃣ Testing checkout without API key...');
  const checkoutResponse1 = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteId: quote.quoteId,
      returnUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    })
  });

  console.log('   Status:', checkoutResponse1.status);
  const result1 = await checkoutResponse1.json();
  console.log('   Response:', result1);
  console.log('');

  // Step 3: Test checkout with API key
  console.log('3️⃣ Testing checkout with API key...');
  const checkoutResponse2 = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'test-api-key-123'
    },
    body: JSON.stringify({
      quoteId: quote.quoteId,
      returnUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    })
  });

  console.log('   Status:', checkoutResponse2.status);
  const result2 = await checkoutResponse2.json();
  console.log('   Response:', JSON.stringify(result2, null, 2));
  console.log('');

  // Step 4: Test quote retrieval
  console.log('4️⃣ Testing quote retrieval...');
  const quoteGetResponse = await fetch(`${BASE_URL}/api/quote?quoteId=${quote.quoteId}`);
  
  console.log('   Status:', quoteGetResponse.status);
  const quoteData = await quoteGetResponse.json();
  console.log('   Quote data:', JSON.stringify(quoteData, null, 2));
}

debugCheckout().catch(console.error); 