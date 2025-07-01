#!/bin/bash

echo "🚀 Deploying AIPayPerCrawl to Cloudflare..."

# Step 1: Check if logged into Cloudflare
echo "📋 Step 1: Checking Cloudflare authentication..."
if ! wrangler whoami > /dev/null 2>&1; then
    echo "❌ Not logged into Cloudflare. Please run: wrangler login"
    exit 1
fi

# Step 2: Create D1 database if it doesn't exist
echo "📋 Step 2: Setting up D1 database..."
if ! wrangler d1 list | grep -q "aipaypercrawl-db"; then
    echo "Creating D1 database..."
    wrangler d1 create aipaypercrawl-db
    echo "✅ Database created!"
else
    echo "✅ Database already exists"
fi

# Step 3: Run database migrations
echo "📋 Step 3: Running database migrations..."
wrangler d1 execute aipaypercrawl-db --file=./src/lib/db/schema.sql
echo "✅ Database schema applied!"

# Step 4: Create KV namespace for caching
echo "📋 Step 4: Setting up KV namespace..."
if ! wrangler kv:namespace list | grep -q "aipaypercrawl-cache"; then
    echo "Creating KV namespace..."
    wrangler kv:namespace create "aipaypercrawl-cache"
    echo "✅ KV namespace created!"
else
    echo "✅ KV namespace already exists"
fi

# Step 5: Insert test data
echo "📋 Step 5: Inserting test data (optional)..."
read -p "Do you want to insert test domains? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    wrangler d1 execute aipaypercrawl-db --command="INSERT INTO domains (domain, rank, category, pay_per_crawl_enabled, price_per_request) VALUES ('example.com', 1000, 'Technology', true, 0.001), ('news-site.com', 5000, 'News', true, 0.002), ('ecommerce-store.com', 10000, 'E-commerce', true, 0.0015) ON CONFLICT(domain) DO NOTHING;"
    echo "✅ Test data inserted!"
fi

# Step 6: Build the Next.js app
echo "📋 Step 6: Building Next.js app..."
npm run build
echo "✅ Build complete!"

# Step 7: Deploy to Cloudflare Pages
echo "📋 Step 7: Deploying to Cloudflare Pages..."
wrangler pages deploy out --project-name=aipaypercrawl --compatibility-date=2024-01-01

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update the database_id in wrangler.toml with the actual D1 database ID"
echo "2. Update the KV namespace ID in wrangler.toml"
echo "3. Test your APIs with: node test-api.js production"
echo "4. View real-time logs: npx wrangler pages tail --project-name=aipaypercrawl"
echo "5. Set up your custom domain in Cloudflare Pages dashboard"
echo "6. Configure environment variables in Cloudflare Pages settings:"
echo "   - NEXT_PUBLIC_APP_URL=https://your-domain.com"
echo "   - API_KEY=your-secure-api-key"
echo "   - STRIPE_SECRET_KEY=your_stripe_key (when ready)"
echo ""
echo "📚 Documentation:"
echo "   - API Setup Guide: ./API_SETUP_GUIDE.md"
echo "   - Client Example: ./client-example.js"
echo "   - Cloudflare Pages: https://developers.cloudflare.com/pages/" 