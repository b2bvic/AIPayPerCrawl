import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
// import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://aipaypercrawl.com'),
  title: {
    template: '%s | AI Pay Per Crawl',
    default: 'AI Pay Per Crawl - Monetize Your Content with AI Crawlers',
  },
  description: 'Discover and monetize Pay Per Crawl domains. Publishers set prices for AI crawler access, AI companies pay for quality content. Join the new economy of AI-driven content monetization.',
  keywords: [
    'pay per crawl',
    'AI crawlers',
    'content monetization',
    'publisher revenue',
    'AI training data',
    'domain monetization',
    'crawler pricing',
    'content licensing',
    'AI data marketplace',
    'web scraping payment',
    'publisher tools',
    'AI content access',
    'cloudflare pay per crawl',
    'HTTP 402',
    'paid content access'
  ],
  authors: [{ name: 'AI Pay Per Crawl', url: 'https://aipaypercrawl.com' }],
  creator: 'AI Pay Per Crawl',
  publisher: 'AI Pay Per Crawl',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aipaypercrawl.com',
    siteName: 'AI Pay Per Crawl',
    title: 'AI Pay Per Crawl - Monetize Your Content with AI Crawlers',
    description: 'Discover and monetize Pay Per Crawl domains. Publishers set prices for AI crawler access, AI companies pay for quality content.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Pay Per Crawl - Monetize Your Content',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'AI Pay Per Crawl Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Pay Per Crawl - Monetize Your Content with AI Crawlers',
    description: 'Discover and monetize Pay Per Crawl domains. Publishers set prices for AI crawler access.',
    images: ['/og-image.png'],
    creator: '@aipaypercrawl',
    site: '@aipaypercrawl',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#2563eb',
      },
    ],
  },
  manifest: '/manifest.json',
  category: 'technology',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
  other: {
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > */}
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
} 