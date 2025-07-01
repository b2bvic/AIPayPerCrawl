# AIPayPerCrawl API Setup Guide

## Quick Start for Test Launch

### 1. Local Development Testing

```bash
# Start the local development server
npm run dev

# In another terminal, start Wrangler for Cloudflare Functions
npx wrangler pages dev --compatibility-date=2024-01-01 --d1=DB --kv=CACHE

# Test the APIs locally
node test-api.js local
```

### 2. Deploy to Cloudflare (Test Environment)

```bash
# Deploy the database schema first
npx wrangler d1 execute aipaypercrawl-db --file=src/lib/db/schema.sql

# Deploy to Cloudflare Pages
npm run build
npx wrangler pages deploy out --project-name=aipaypercrawl-test

# Test the deployed APIs
node test-api.js production
```

## API Endpoints

### 1. Domains API
- **GET** `/api/domains` - List Pay Per Crawl enabled domains
  - Query params: `limit`, `offset`, `search`, `category`, `minRank`, `maxRank`
- **POST** `/api/domains` - Add/update a domain (requires auth)

### 2. Quote API
- **POST** `/api/quote` - Generate a quote for crawling URLs
  ```json
  {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "callbackUrl": "https://your-app.com/webhook" // optional
  }
  ```
- **GET** `/api/quote?quoteId=xxx` - Retrieve quote details

### 3. Crawl API
- **POST** `/api/crawl` - Execute a crawl based on a quote
  ```json
  {
    "quoteId": "quote_xxx"
  }
  ```
- **GET** `/api/crawl?crawlId=xxx` - Get crawl status

### 4. Analytics API
- **POST** `/api/analytics` - Track an event
  ```json
  {
    "eventType": "page_view",
    "domainId": "xxx", // optional
    "metadata": {} // optional
  }
  ```
- **GET** `/api/analytics?includeStats=true` - Get analytics data

### 5. Publishers API
- **POST** `/api/publishers/register` - Register as a publisher
  ```json
  {
    "email": "publisher@example.com",
    "name": "John Doe",
    "domains": ["example.com", "mysite.com"] // optional
  }
  ```
- **POST** `/api/publishers/claim` - Claim a domain
  ```json
  {
    "publisherId": "xxx",
    "domain": "example.com",
    "verificationMethod": "dns" // or "html", "meta"
  }
  ```
- **POST** `/api/publishers/verify` - Verify domain ownership
  ```json
  {
    "domain": "example.com"
  }
  ```
- **GET** `/api/publishers?publisherId=xxx` - Get publisher details

## Environment Variables

Create a `.env.local` file for local development:

```env
# API Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_KEY=your-test-api-key

# Cloudflare (for production)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# Stripe (when ready for payments)
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Test Data Setup

To add test domains to your database:

```sql
-- Run this with: npx wrangler d1 execute aipaypercrawl-db --command="..."
INSERT INTO domains (domain, rank, category, pay_per_crawl_enabled, price_per_request) VALUES
  ('example.com', 1000, 'Technology', true, 0.001),
  ('news-site.com', 5000, 'News', true, 0.002),
  ('ecommerce-store.com', 10000, 'E-commerce', true, 0.0015);
```

## Authentication

For the test launch, API authentication uses a simple API key in the `X-API-Key` header. 

```javascript
// Example API call with authentication
fetch('https://your-domain.com/api/crawl', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({ quoteId: 'quote_xxx' })
});
```

## CORS Configuration

The APIs are configured to accept requests from any origin (`*`) for testing. Before production launch, update the CORS headers in each function to restrict access:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
};
```

## Monitoring & Debugging

### View Logs
```bash
# Real-time logs from Cloudflare
npx wrangler pages tail --project-name=aipaypercrawl-test
```

### Check Database
```bash
# Query the D1 database
npx wrangler d1 execute aipaypercrawl-db --command="SELECT * FROM domains LIMIT 10"
```

### Analytics Dashboard
Visit your Cloudflare dashboard to see:
- Request counts
- Error rates
- Performance metrics
- D1 database usage

## Next Steps for Production

1. **Domain Setup**: Update `NEXT_PUBLIC_APP_URL` in wrangler.toml to your actual domain
2. **Authentication**: Implement proper JWT-based authentication
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Payment Integration**: Connect Stripe for real payments
5. **Web Agent Integration**: Integrate with actual web crawling service
6. **Monitoring**: Set up error tracking (e.g., Sentry)
7. **Documentation**: Generate API documentation (e.g., using Swagger)

## Troubleshooting

### Common Issues

1. **"Database not found" error**
   - Make sure to create and deploy the D1 database schema first
   - Check that the database ID in wrangler.toml is correct

2. **"API key required" error**
   - Add the `X-API-Key` header to your requests
   - For local testing, any non-empty value works

3. **CORS errors**
   - The OPTIONS preflight requests should be handled
   - Check that your origin is allowed in the CORS headers

4. **"Quote not found" error**
   - Quotes expire after 24 hours
   - Make sure you're using a valid, non-expired quote ID

## Support

For issues or questions:
- Check the logs: `npx wrangler pages tail`
- Review the database: `npx wrangler d1 execute`
- Test with the provided test script: `node test-api.js` 