---
title:: Block AI Crawlers on Vercel and Netlify: Edge Function Implementation
description:: Configure Vercel Edge Functions and Netlify Edge Handlers to block or throttle AI training crawlers with serverless access control.
focus_keyword:: vercel netlify block ai crawlers
category:: Technical
author:: Victor Valentine Romo
date:: 2026.02.08
---

# Block AI Crawlers on Vercel and Netlify: Edge Function Implementation

Modern JAMstack deployment platforms **Vercel** and **Netlify** host millions of websites through serverless architectures that excel at static site delivery but require different approaches to crawler management than traditional server configurations. Publishers deploying on these platforms can't edit Apache `.htaccess` files or modify nginx configurations—instead, they must use **edge functions** that execute at CDN edge locations before requests reach static assets. This architecture provides powerful distributed control but demands understanding platform-specific APIs and deployment patterns.

**Edge functions** on both platforms run JavaScript/TypeScript code in V8 isolates at CDN edges worldwide, enabling microsecond-latency request interception. For AI crawler blocking, edge functions inspect request headers, evaluate User-Agent strings and IP addresses, enforce rate limits, and return rejection responses or forward requests to static content—all without origin server involvement. This edge execution minimizes infrastructure costs even under heavy crawler load because rejected requests consume minimal compute.

The serverless nature creates both advantages and constraints. Functions scale automatically handling traffic spikes, deploy globally providing consistent blocking worldwide, and integrate naturally with modern web development workflows. However, they operate in restricted runtime environments with memory/execution limits, lack persistent storage requiring external state management for rate limiting, and charge per invocation creating cost considerations for high-traffic sites.

## Vercel Edge Functions for Crawler Blocking

Vercel's edge middleware system provides request interception capabilities suitable for implementing sophisticated crawler controls.

**Basic User-Agent blocking** implements straightforward pattern matching. Create `middleware.ts` in project root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''

  const blockedCrawlers = [
    'GPTBot',
    'ClaudeBot',
    'ChatGPT-User',
    'Google-Extended',
    'CCBot',
    'anthropic-ai',
    'Claude-Web'
  ]

  const isBlocked = blockedCrawlers.some(crawler =>
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  )

  if (isBlocked) {
    return new NextResponse('AI training crawlers not permitted', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

This intercepts all requests except Next.js internals, checks User-Agent against blocked crawler list, and returns 403 for matches. The crawler list updates through code deployments when new AI training crawlers emerge.

**IP-based verification** prevents User-Agent spoofing by validating crawler identity against known IP ranges. Vercel edge functions access request IP through `request.ip`:

```typescript
const verifyIP = (ip: string, userAgent: string): boolean => {
  // OpenAI GPTBot ranges (example - must maintain updated)
  const gptbotRanges = [
    '23.98.142.0/24',
    '104.18.0.0/16',
  ]

  // Anthropic ClaudeBot ranges
  const claudebotRanges = [
    '3.144.0.0/16',
  ]

  // If claiming to be GPTBot, verify IP is in range
  if (userAgent.includes('GPTBot')) {
    return isIPInRanges(ip, gptbotRanges)
  }

  if (userAgent.includes('ClaudeBot')) {
    return isIPInRanges(ip, claudebotRanges)
  }

  return true // Not claiming to be verified crawler
}

function isIPInRanges(ip: string, ranges: string[]): boolean {
  // IP range checking logic (use library like ip-range-check)
  // Return true if IP falls within any specified range
}
```

Functions verify that crawlers claiming specific identities originate from documented IP ranges, blocking spoofed requests.

**Rate limiting with Vercel KV** requires external state storage since edge functions are stateless. Vercel KV provides Redis-compatible key-value store:

```typescript
import { kv } from '@vercel/kv'

async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const key = `ratelimit:${identifier}`
  const current = await kv.get<number>(key) || 0

  if (current >= limit) {
    return false // Rate limit exceeded
  }

  await kv.incr(key)
  await kv.expire(key, windowSeconds)

  return true // Within limit
}

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''

  // Rate limit AI crawlers to 10 requests per minute
  if (isAICrawler(userAgent)) {
    const identifier = `${request.ip}:${userAgent}`
    const allowed = await checkRateLimit(identifier, 10, 60)

    if (!allowed) {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: {
          'Retry-After': '60',
        },
      })
    }
  }

  return NextResponse.next()
}
```

This tracks request counts per IP/User-Agent combination, enforcing per-minute quotas. Vercel KV charges based on operations and storage, requiring cost monitoring for high-traffic sites.

**Environment-based configuration** enables different blocking strategies across development, staging, and production:

```typescript
const getBlockingConfig = () => {
  const env = process.env.VERCEL_ENV || 'development'

  return {
    development: {
      blockAI: false, // Allow crawlers in dev for testing
    },
    preview: {
      blockAI: true,
      rateLimit: 100, // Generous limit for preview
    },
    production: {
      blockAI: true,
      rateLimit: 10,
      strictVerification: true,
    },
  }[env]
}
```

This allows developers to test with crawlers in development while enforcing strict production controls.

**Geo-blocking capabilities** restrict crawler access by geography:

```typescript
export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'UNKNOWN'

  // Allow only US/CA/EU for AI crawlers
  const allowedCountries = ['US', 'CA', 'GB', 'DE', 'FR']

  if (isAICrawler(userAgent) && !allowedCountries.includes(country)) {
    return new NextResponse('Geographic restriction', {
      status: 451, // Unavailable For Legal Reasons
    })
  }

  return NextResponse.next()
}
```

Vercel provides geolocation data in request object, enabling regional access policies.

## Netlify Edge Handlers Implementation

Netlify's edge functions use Deno runtime and integrate with Netlify's deployment and routing system.

**Basic edge function structure** for crawler blocking. Create file in `netlify/edge-functions/`:

```typescript
// netlify/edge-functions/block-crawlers.ts
import type { Context } from "https://edge.netlify.com"

const BLOCKED_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
]

export default async (request: Request, context: Context) => {
  const userAgent = request.headers.get('user-agent') || ''

  const isBlocked = BLOCKED_CRAWLERS.some(crawler =>
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  )

  if (isBlocked) {
    return new Response('AI training crawlers not permitted', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  // Continue to origin/static asset
  return context.next()
}

export const config = { path: "/*" }
```

Configure in `netlify.toml`:

```toml
[[edge_functions]]
function = "block-crawlers"
path = "/*"
```

This intercepts all requests through the edge function before serving static assets.

**Blobs storage for rate limiting** since Netlify edge functions can't directly access Redis. Netlify Blobs provides edge-accessible key-value storage:

```typescript
import { getStore } from "@netlify/blobs"

export default async (request: Request, context: Context) => {
  const ratelimit = getStore("ratelimit")
  const userAgent = request.headers.get('user-agent') || ''

  if (isAICrawler(userAgent)) {
    const ip = context.ip
    const key = `${ip}:${Date.now() / 60000 | 0}` // Per-minute window

    const count = await ratelimit.get(key) || '0'
    const requests = parseInt(count, 10)

    if (requests >= 10) {
      return new Response('Rate limit exceeded', {
        status: 429,
        headers: { 'Retry-After': '60' },
      })
    }

    await ratelimit.set(key, String(requests + 1), {
      metadata: { expires: Date.now() + 120000 } // Expire after 2 min
    })
  }

  return context.next()
}
```

**Context-aware blocking** uses Netlify's context for deployment-specific behavior:

```typescript
export default async (request: Request, context: Context) => {
  const deployContext = context.deploy.context // production, deploy-preview, branch-deploy

  // Only block in production
  if (deployContext !== 'production') {
    return context.next()
  }

  // Apply production blocking logic
  if (isBlockedCrawler(request)) {
    return new Response('Blocked', { status: 403 })
  }

  return context.next()
}
```

**Cookie-based authentication** enables selective crawler access for licensed partners:

```typescript
const validateCrawlerToken = (request: Request): boolean => {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => c.split('='))
  )

  const token = cookies['crawler_license_token']

  // Validate against known licensed crawler tokens
  const licensedTokens = [
    process.env.OPENAI_LICENSE_TOKEN,
    process.env.ANTHROPIC_LICENSE_TOKEN,
  ]

  return licensedTokens.includes(token)
}

export default async (request: Request, context: Context) => {
  const userAgent = request.headers.get('user-agent') || ''

  if (isAICrawler(userAgent)) {
    if (!validateCrawlerToken(request)) {
      return new Response('License required', { status: 401 })
    }
  }

  return context.next()
}
```

This enables tiered licensing where authorized crawlers receive tokens granting access despite blocks.

**Logging and monitoring** tracks crawler activity:

```typescript
export default async (request: Request, context: Context) => {
  const userAgent = request.headers.get('user-agent') || ''

  if (isAICrawler(userAgent)) {
    // Log to Netlify Functions (separate serverless function)
    await fetch(`${context.site.url}/.netlify/functions/log-crawler`, {
      method: 'POST',
      body: JSON.stringify({
        timestamp: Date.now(),
        userAgent,
        ip: context.ip,
        path: new URL(request.url).pathname,
        blocked: shouldBlock(userAgent),
      }),
    })
  }

  return context.next()
}
```

Logs feed into analytics platforms (Datadog, New Relic) for compliance monitoring.

## Performance and Cost Optimization

Edge functions incur costs per invocation and execution time, requiring optimization for cost-effective crawler management.

**Early return patterns** minimize execution time by checking conditions in order of likelihood:

```typescript
export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')

  // Fast path: most requests aren't crawlers
  if (!userAgent || !userAgent.match(/bot|crawler/i)) {
    return NextResponse.next() // Exit immediately
  }

  // Slower checks only for potential crawlers
  if (isBlockedAICrawler(userAgent)) {
    return new NextResponse('Blocked', { status: 403 })
  }

  return NextResponse.next()
}
```

**Caching verification results** reduces redundant IP range checks:

```typescript
const ipVerificationCache = new Map<string, boolean>()

function isVerifiedCrawler(ip: string, userAgent: string): boolean {
  const cacheKey = `${ip}:${userAgent}`

  if (ipVerificationCache.has(cacheKey)) {
    return ipVerificationCache.get(cacheKey)!
  }

  const verified = checkIPRanges(ip, userAgent)
  ipVerificationCache.set(cacheKey, verified)

  // Limit cache size
  if (ipVerificationCache.size > 1000) {
    const firstKey = ipVerificationCache.keys().next().value
    ipVerificationCache.delete(firstKey)
  }

  return verified
}
```

**Selective path matching** avoids processing requests for static assets:

```typescript
// Vercel config
export const config = {
  matcher: [
    // Only run on HTML pages, not static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|css|js)).*)',
  ],
}
```

**Rate limit optimization** reduces storage operations:

```typescript
// Instead of incrementing on every request, batch operations
async function checkRateLimit(key: string): Promise<boolean> {
  const cached = localCache.get(key)

  if (cached && cached.count < 10 && Date.now() < cached.expires) {
    cached.count++
    return true
  }

  // Only hit KV when cache expires or limit approached
  const stored = await kv.get(key)
  // ... update logic
}
```

**Monitoring costs** through platform dashboards:

- Track edge function invocations per deployment
- Measure average execution time
- Monitor KV/Blobs operation counts
- Set billing alerts at thresholds

Typical costs for moderate traffic sites (100K requests/month) with crawler blocking run $5-20/month for edge functions plus storage costs.

## Frequently Asked Questions

**Do edge functions add latency to page loads?**

Minimal—typically 1-5ms for simple User-Agent checks. Complex operations (IP verification, rate limit lookups) might add 20-50ms. Since functions execute at CDN edges near users, latency remains low. Performance-critical sites should benchmark specific implementations and optimize hot paths.

**Can crawlers bypass edge function blocks by accessing CDN cache directly?**

No. Edge functions execute before cache lookups in request processing pipeline. Even cached content goes through edge middleware, ensuring blocks apply consistently. However, if crawler accessed content before blocks were deployed, CDN cache might serve stale allowed responses until cache expires.

**How do I test edge function crawler blocking before deploying to production?**

Both platforms offer local development environments. Vercel's `vercel dev` and Netlify's `netlify dev` run edge functions locally. Test by setting custom User-Agent in curl/Postman: `curl -A "GPTBot/1.0" https://localhost:3000` should trigger blocks if logic works correctly. Deploy to preview/staging environments before production.

**What happens when Vercel or Netlify have outages—do edge functions fail open or closed?**

During edge function failures, platforms typically fail open (serve content without middleware execution) to maintain availability. This means crawler blocks might not enforce during outages. For critical protection, implement defense-in-depth with both edge functions and origin-level blocks if possible.

**Can I use the same edge function code on both Vercel and Netlify?**

Core logic transfers but platform-specific APIs differ (Next.js middleware APIs vs. Deno edge runtime). Abstract shared logic into separate functions and create thin platform-specific wrappers. Or choose one platform's patterns and stick with it. Maintaining parallel implementations for both platforms adds maintenance burden best avoided unless multi-platform deployment is essential.

**How frequently can I update crawler block lists without performance impacts?**

Edge functions redeploy with code changes (seconds to minutes). Update block lists by changing code and redeploying. For more dynamic updates, store block lists in KV/Blobs and fetch at runtime—adds latency but enables updates without deployment. Balance update frequency against performance/cost tradeoffs based on how rapidly new crawlers emerge.
