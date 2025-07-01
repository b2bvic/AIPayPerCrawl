import React from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('h-8 w-8', className)}
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      
      {/* AI Symbol */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="url(#logo-gradient)"
        className="drop-shadow-sm"
      />
      
      {/* Circuit pattern */}
      <g stroke="white" strokeWidth="1.5" fill="none" opacity="0.8">
        <path d="M12 12h4v4h-4z" />
        <path d="M24 12h4v4h-4z" />
        <path d="M12 24h4v4h-4z" />
        <path d="M24 24h4v4h-4z" />
        <path d="M16 14h8" />
        <path d="M16 26h8" />
        <path d="M14 16v8" />
        <path d="M26 16v8" />
      </g>
      
      {/* Central processing unit */}
      <rect
        x="16"
        y="16"
        width="8"
        height="8"
        fill="white"
        rx="1"
        className="drop-shadow-sm"
      />
      
      {/* Dollar sign in center */}
      <text
        x="20"
        y="22"
        textAnchor="middle"
        className="fill-blue-600 text-xs font-bold"
        style={{ fontSize: '8px' }}
      >
        $
      </text>
    </svg>
  )
}

export function LogoText({ className }: { className?: string }) {
  return (
    <span className={cn('text-xl font-bold text-slate-900 dark:text-white', className)}>
      AI<span className="text-blue-600">Pay</span>PerCrawl
    </span>
  )
}

export function LogoWithText({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Logo />
      <LogoText />
    </div>
  )
} 