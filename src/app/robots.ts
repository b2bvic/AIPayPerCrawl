import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aipaypercrawl.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/verify-email/',
          '/_next/',
          '/admin/',
        ],
      },
      // Allow AI crawlers to access the directory for discovery
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
        ],
        allow: [
          '/',
          '/directory/',
          '/pricing/',
          '/api-docs/',
          '/learn/',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/claim-domain/',
          '/verify-claim/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 