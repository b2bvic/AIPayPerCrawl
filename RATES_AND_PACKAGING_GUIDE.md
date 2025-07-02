# Rates and Packaging System Guide

## Overview

The AI Pay Per Crawl platform now includes a comprehensive rates and packaging system that provides:

- **Price per request** with estimated costs for common crawling scenarios
- **Tier table** for AI firms sortable by CPM, vertical, and traffic size
- **Real-time traffic data** integration with SimilarWeb and Tranco
- **Cost calculator** for different crawling scenarios
- **Market analysis** and pricing insights

## 🎯 Key Features

### 1. Cost Calculator

Interactive calculator that estimates costs for common crawling scenarios:

- **Home Page Only**: Single page crawl for quick content sampling (~1 page)
- **Article Archives**: Blog posts, news articles, and content archives (~50 pages)
- **Category Pages**: Product categories, topic sections, and navigation pages (~25 pages)
- **Full Sitemap**: Complete site crawl including all discoverable pages (~500 pages)

### 2. Tier Table for AI Firms

Comprehensive sortable table with the following features:

#### Sorting Options:
- **CPM (Cost Per Mille)**: Sort by cost per 1,000 requests
- **Vertical**: Group by industry vertical (Technology, Healthcare, Finance, etc.)
- **Traffic Size**: Sort by estimated monthly visits from SimilarWeb/Tranco
- **Domain**: Alphabetical sorting
- **Price**: Sort by price per request

#### Filtering Options:
- Search by domain name or vertical
- Filter by specific verticals
- Traffic range filtering
- CPM range filtering

#### Data Sources:
- **SimilarWeb API**: Premium traffic data with high accuracy
- **Tranco List**: Free daily updated top domain rankings
- **Manual Curation**: Verified high-value domains

### 3. Pricing Structure

#### Base Rates:
- **Minimum**: $0.0001 per request
- **Average**: $0.002 per request  
- **Premium**: $0.01 per request

#### Volume Discounts:
- **1K - 10K requests**: 0% discount
- **10K - 100K requests**: 5% discount
- **100K+ requests**: 10% discount
- **1M+ requests**: 15% discount (Enterprise)

#### Vertical Multipliers:
- **Government**: 4.0x (highest value)
- **Healthcare**: 3.0x
- **Legal**: 2.8x
- **Finance**: 2.5x
- **Real Estate**: 2.2x
- **E-commerce**: 2.0x
- **Technology**: 1.8x
- **Travel**: 1.6x
- **Education**: 1.5x
- **News**: 1.4x
- **Entertainment**: 1.1x

## 📊 Implementation Details

### Database Schema Enhancements

The domains table now includes:

```sql
ALTER TABLE domains ADD COLUMN vertical VARCHAR(100);
ALTER TABLE domains ADD COLUMN traffic INTEGER;
ALTER TABLE domains ADD COLUMN cpm DECIMAL(10,2);
```

### API Endpoints Enhanced

#### `/api/domains` Enhancements:
- **New Parameters**:
  - `vertical`: Filter by industry vertical
  - `sortBy`: Sort by cpm, traffic, vertical, domain, or price
  - `sortOrder`: asc or desc
  - `search`: Search domains and verticals

- **Response Format**:
```json
{
  "domains": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "filters": {
    "verticals": ["Technology", "Healthcare", ...],
    "categoryStats": [...]
  }
}
```

### Traffic Data Integration

#### `/api/traffic` Features:
- **SimilarWeb Integration**: Premium API for accurate traffic data
- **Tranco List**: Free daily rankings for top domains
- **Batch Processing**: Handle up to 100 domains per request
- **Caching**: 24-hour cache for performance
- **Confidence Scoring**: High, medium, low confidence levels

## 🚀 Setup Instructions

### 1. Database Setup

Run the enhanced domain data:

```bash
# Local development
npx wrangler d1 execute aipaypercrawl-db --local --file=tier-table-data.sql

# Production
npx wrangler d1 execute aipaypercrawl-db --file=tier-table-data.sql
```

### 2. Environment Variables

Add to your `.env` or Cloudflare Workers environment:

```bash
# Optional: Premium traffic data sources
SIMILARWEB_API_KEY=your_similarweb_key
ALEXA_API_KEY=your_alexa_key

# Required: Database and KV
DB=your_d1_database
KV_CACHE=your_kv_namespace
```

### 3. Test the System

```bash
# Generate test data
node setup-test-domains.js

# Populate database
node populate-tier-data.js

# Run demo
node demo-rates-packaging.js
```

## 📱 Frontend Components

### RatesAndPackaging Component

Located at `src/components/RatesAndPackaging.tsx`, this component provides:

- **Interactive Cost Calculator**: Select scenarios and see real-time cost estimates
- **Filterable Tier Table**: Sort and filter domains by multiple criteria
- **Market Overview**: Statistics by vertical and pricing insights
- **Real-time Data**: Live traffic and pricing information

### Usage Example:

```tsx
import { RatesAndPackaging } from '@/components/RatesAndPackaging'

export default function PricingPage() {
  return (
    <div>
      <h1>Transparent Rates & Packages</h1>
      <RatesAndPackaging />
    </div>
  )
}
```

## 📈 Market Analysis Features

### Vertical Statistics
- Domain count per vertical
- Average CPM by industry
- Price distribution analysis
- Traffic patterns

### Pricing Insights
- Market average calculations
- Competitive analysis
- Trend identification
- Volume discount modeling

## 🔧 Testing and Validation

### Demo Script Features

The `demo-rates-packaging.js` script tests:

1. **Cost Calculator Scenarios**: Validates pricing calculations
2. **Tier Table Functionality**: Tests sorting and filtering
3. **Market Analysis**: Verifies statistical calculations
4. **Volume Pricing**: Confirms discount tiers
5. **API Integration**: Tests all endpoints

### Sample Output:

```
🎯 AI Pay Per Crawl - Rates & Packaging Demo
==================================================

💰 Cost Estimates by Scenario:
Domain                   Vertical       Price/Req   Home Page Only Article Archives
example.com              Technology     $0.001      $0.001         $0.050
news-site.com            News           $0.002      $0.002         $0.100
health-portal.com        Healthcare     $0.003      $0.003         $0.150
government-portal.gov    Government     $0.005      $0.005         $0.250

📊 Vertical Distribution:
  • Technology: 3 domains
  • Finance: 3 domains
  • Healthcare: 2 domains
```

## 🌐 Live Features

### Pricing Page Integration

Visit `/pricing` to see the complete rates and packaging system including:

- Interactive cost calculator
- Sortable tier table
- Market insights
- Volume pricing information
- Real-time traffic data

### Key Benefits for AI Firms:

1. **Transparent Pricing**: Clear cost structure with no hidden fees
2. **Market Intelligence**: Compare rates across verticals and traffic tiers
3. **Cost Optimization**: Volume discounts and scenario planning
4. **Data Quality**: Traffic-verified domains with confidence scoring
5. **Real-time Updates**: Live pricing and availability information

## 📞 Support and Documentation

- **API Documentation**: `/api-docs`
- **Interactive Demo**: Run `node demo-rates-packaging.js`
- **Test Data**: 20 domains across 15 verticals with realistic pricing
- **Market Data**: Integration with SimilarWeb and Tranco for traffic insights

## 🎉 Success Metrics

The system now provides:

- ✅ **Price per request** with scenario-based cost estimates
- ✅ **Tier table** sortable by CPM, vertical, and traffic size  
- ✅ **Traffic data integration** with SimilarWeb and Tranco
- ✅ **Volume discounts** up to 15% for enterprise usage
- ✅ **Market analysis** with 15 industry verticals
- ✅ **Real-time pricing** with confidence scoring
- ✅ **Interactive calculator** for 4 common crawling scenarios

The rates and packaging system is now fully functional and ready for production use! 