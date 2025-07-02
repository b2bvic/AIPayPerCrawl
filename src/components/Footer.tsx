import React from 'react'
import Link from 'next/link'
import { LogoWithText } from '@/components/Logo'
import { 
  Twitter, 
  Github, 
  Linkedin,
  Mail,
  ExternalLink
} from 'lucide-react'

export function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Directory', href: '/directory' },
        { name: 'API Documentation', href: '/api-docs' },
        { name: 'Publisher Dashboard', href: '/publishers' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'System Status', href: 'https://status.aipaypercrawl.com', external: true },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Getting Started', href: '/getting-started' },
        { name: 'Learning Center', href: '/learn' },
        { name: 'Blog', href: '/blog' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Use Cases', href: '/use-cases' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Sales', href: '/contact-sales' },
        { name: 'Support', href: '/support' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Kit', href: '/press' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Acceptable Use', href: '/acceptable-use' },
        { name: 'DMCA', href: '/dmca' },
      ],
    },
  ]

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/aipaypercrawl', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/aipaypercrawl', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/aipaypercrawl', icon: Linkedin },
    { name: 'Email', href: 'mailto:hello@aipaypercrawl.com', icon: Mail },
  ]

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Logo and description */}
            <div className="lg:col-span-2">
              <LogoWithText className="text-white" />
              <p className="mt-4 text-sm">
                The marketplace for Pay Per Crawl domains, enabling AI companies to access web data at scale through Cloudflare's infrastructure.
              </p>
              <div className="mt-6 flex space-x-4">
                {socialLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-slate-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Footer sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          className="text-sm hover:text-white transition-colors inline-flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm hover:text-white transition-colors"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              &copy; {new Date().getFullYear()} AIPayPerCrawl. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/security" className="hover:text-white transition-colors">
                Security
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}