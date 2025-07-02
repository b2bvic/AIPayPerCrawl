// [AUTO-GENERATED PAGE: Please review and enrich as needed]
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - AI Pay Per Crawl Insights and Updates',
  description: 'Stay updated with the latest news, insights, and best practices for AI Pay Per Crawl. Learn about industry trends, technical guides, and success stories.',
  openGraph: {
    title: 'Blog - AI Pay Per Crawl Insights and Updates',
    description: 'Stay updated with the latest news, insights, and best practices for AI Pay Per Crawl.',
    url: 'https://aipaypercrawl.com/blog',
  },
  twitter: {
    title: 'Blog - AI Pay Per Crawl Insights and Updates',
    description: 'Stay updated with AI Pay Per Crawl news and insights.',
  },
}

export default function BlogPage() {
  const featuredPost = {
    title: 'The Future of AI Content Monetization: Pay Per Crawl Revolution',
    excerpt: 'Discover how Pay Per Crawl is transforming the relationship between content creators and AI companies, creating new revenue streams and fair compensation models.',
    author: 'AI Pay Per Crawl Team',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Industry Insights',
    href: '/blog/future-ai-content-monetization',
    featured: true,
  }

  const posts = [
    {
      title: 'Setting Up Your First Pay Per Crawl Domain',
      excerpt: 'A step-by-step guide to claiming your domain and configuring Pay Per Crawl pricing for maximum revenue.',
      author: 'Sarah Chen',
      date: '2024-01-10',
      readTime: '5 min read',
      category: 'Tutorial',
      href: '/blog/setup-first-domain',
    },
    {
      title: 'Understanding HTTP 402 and Payment Required Responses',
      excerpt: 'Deep dive into the technical implementation of HTTP 402 status codes and how they enable Pay Per Crawl functionality.',
      author: 'Marcus Rodriguez',
      date: '2024-01-08',
      readTime: '12 min read',
      category: 'Technical',
      href: '/blog/http-402-payment-required',
    },
    {
      title: 'Maximizing Revenue: Pricing Strategies for Publishers',
      excerpt: 'Learn effective pricing strategies and best practices to optimize your Pay Per Crawl revenue while maintaining competitive rates.',
      author: 'Emily Zhang',
      date: '2024-01-05',
      readTime: '7 min read',
      category: 'Business',
      href: '/blog/pricing-strategies-publishers',
    },
    {
      title: 'AI Training Data Quality: Why Publishers Matter',
      excerpt: 'Explore the importance of high-quality content sources for AI training and how publishers can position themselves in this ecosystem.',
      author: 'Dr. James Wilson',
      date: '2024-01-03',
      readTime: '10 min read',
      category: 'Industry Insights',
      href: '/blog/ai-training-data-quality',
    },
    {
      title: 'Cloudflare Integration: Technical Deep Dive',
      excerpt: 'Understanding how Pay Per Crawl integrates with Cloudflare\'s infrastructure for seamless content delivery and payment processing.',
      author: 'Alex Thompson',
      date: '2023-12-28',
      readTime: '15 min read',
      category: 'Technical',
      href: '/blog/cloudflare-integration-deep-dive',
    },
    {
      title: 'Success Story: How TechBlog.com Increased Revenue by 300%',
      excerpt: 'Real-world case study of how a technology blog leveraged Pay Per Crawl to create a new revenue stream from AI companies.',
      author: 'Lisa Park',
      date: '2023-12-25',
      readTime: '6 min read',
      category: 'Case Study',
      href: '/blog/techblog-success-story',
    },
  ]

  const categories = ['All', 'Industry Insights', 'Technical', 'Tutorial', 'Business', 'Case Study']

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <LogoWithText />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/directory" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Directory
              </Link>
              <Link href="/api-docs" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                API Docs
              </Link>
              <Link href="/learn" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Learn
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" href="/auth/signin">
                Sign In
              </Button>
              <Button href="/auth/signup">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Pay Per Crawl Blog
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Insights, tutorials, and updates from the world of AI content monetization
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="p-8 md:p-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
              <span className="ml-3 text-blue-600 dark:text-blue-400 text-sm font-medium">
                {featuredPost.category}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {featuredPost.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(featuredPost.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {featuredPost.readTime}
                </div>
              </div>
              <Button href={featuredPost.href} className="flex items-center">
                Read Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              category === 'All' ? (
                <Button key={category} className="text-sm">
                  {category}
                </Button>
              ) : (
                <Button key={category} variant="outline" className="text-sm">
                  {category}
                </Button>
              )
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.href} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                <Link href={post.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="px-8">
            Load More Articles
          </Button>
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-16 p-8 bg-slate-100 dark:bg-slate-800 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Get the latest insights and updates delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
            <Button>Subscribe</Button>
          </div>
        </Card>
      </main>
    </div>
  )
} 