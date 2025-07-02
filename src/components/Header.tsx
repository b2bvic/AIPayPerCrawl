'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoWithText } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { 
  Menu, 
  X, 
  ChevronDown,
  User,
  Settings,
  CreditCard,
  BarChart3,
  Key,
  LogOut,
  HelpCircle
} from 'lucide-react'

interface HeaderProps {
  user?: {
    name: string
    email: string
    isPublisher?: boolean
  }
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Directory', href: '/directory' },
    { name: 'API Docs', href: '/api-docs' },
    { name: 'Learn', href: '/learn' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ]

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Account Settings', href: '/account', icon: Settings },
    { name: 'API Keys', href: '/account/api-keys', icon: Key },
    { name: 'Billing', href: '/account/billing', icon: CreditCard },
    { name: 'Help & Support', href: '/support', icon: HelpCircle },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <LogoWithText />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                        {user.email}
                      </div>
                      {userNavigation.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            {item.name}
                          </Link>
                        )
                      })}
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        <Link
                          href="/auth/signout"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" href="/auth/signin" className="hidden sm:block">
                  Sign In
                </Button>
                <Button href="/auth/signup">
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
                {userNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
                <Link
                  href="/auth/signout"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}