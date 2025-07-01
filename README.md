# AIPayPerCrawl.com

The marketplace for Pay Per Crawl domains, enabling AI companies to access web data at scale through Cloudflare's Pay Per Crawl infrastructure.

## 🚀 Features

### Core Marketplace Functionality
- **Domain Directory**: Searchable directory of Pay Per Crawl enabled domains
- **Instant Quotes**: Get real-time pricing for crawling specific URLs
- **Publisher Dashboard**: Domain management, analytics, and revenue tracking
- **API Access**: RESTful API with comprehensive documentation

### SEO & Content Strategy
- Built following Koray's Topical Authority methodology
- Semantic HTML5 structure with proper meta tags
- JSON-LD structured data for search engines
- Internal linking strategy for maximum topic coverage

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe Connect
- **Deployment**: Cloudflare Pages
- **Analytics**: Built-in dashboard with export capabilities

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── domains/          # Domain listing API
│   │   └── quote/            # Quote generation API
│   ├── directory/            # Public domain directory
│   │   └── [id]/            # Individual domain pages
│   ├── dashboard/           # Publisher dashboard
│   ├── api-docs/           # API documentation
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Reusable UI components
│   └── Logo.tsx           # Brand components
├── lib/
│   ├── db/                # Database schema & queries
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aipayercrawl.git
cd aipayercrawl
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🌐 API Documentation

Visit `/api-docs` for comprehensive API documentation including:
- Authentication methods
- Endpoint specifications
- Code examples (Node.js, Python, cURL)
- Error handling
- Rate limiting information

### Quick API Example

```javascript
// Get a quote for crawling URLs
const response = await fetch('/api/quote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    urls: [
      'https://example.com/page1',
      'https://example.com/page2'
    ]
  })
});

const quote = await response.json();
console.log('Total cost:', quote.totalCost);
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aipayercrawl"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
BUILTWITH_API_KEY="your-builtwith-key"
TRANCO_API_KEY="your-tranco-key"
```

## 📊 Database Schema

The application uses PostgreSQL with Drizzle ORM. Key tables:

- `domains`: Pay Per Crawl enabled domains
- `publishers`: Domain owners/publishers  
- `crawl_requests`: API crawl requests
- `analytics_events`: Usage tracking
- `content_pages`: SEO/learning content

Run `npm run db:studio` to explore the database schema.

## 🚀 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables in Cloudflare dashboard
5. Deploy!

### Environment Setup

The application requires:
- PostgreSQL database (recommend Neon or Supabase)
- Redis instance (for caching)
- Stripe Connect setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Production Site](https://aipayercrawl.com)
- [API Documentation](https://aipayercrawl.com/api-docs)
- [Publisher Dashboard](https://aipayercrawl.com/dashboard)
- [Directory](https://aipayercrawl.com/directory)

## 📧 Support

For support, email support@aipayercrawl.com or create an issue in this repository.

---

Built with ❤️ for the AI community. 