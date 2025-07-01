import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s - AIPayPerCrawl',
    default: 'AIPayPerCrawl - Pay Per Crawl Marketplace for AI Companies',
  },
  description: 'Discover and access web data at scale with Cloudflare\'s Pay Per Crawl solution. Find domains, get quotes, and pay for crawl data programmatically.',
  keywords: ['pay per crawl', 'web scraping', 'data marketplace', 'AI data', 'cloudflare', 'web crawling'],
  authors: [{ name: 'AIPayPerCrawl', url: 'https://aipaypercrawl.com' }],
  creator: 'AIPayPerCrawl',
  publisher: 'AIPayPerCrawl',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aipayercrawl.com',
    title: 'AIPayPerCrawl - Pay Per Crawl Marketplace',
    description: 'Discover and access web data at scale with Cloudflare\'s Pay Per Crawl solution.',
    siteName: 'AIPayPerCrawl',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIPayPerCrawl - Pay Per Crawl Marketplace',
    description: 'Discover and access web data at scale with Cloudflare\'s Pay Per Crawl solution.',
    creator: '@aipayercrawl',
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