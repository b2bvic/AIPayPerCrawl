import { NextRequest, NextResponse } from 'next/server'

interface CloudflareZone {
  id: string
  name: string
  status: string
  account: {
    id: string
    name: string
  }
}

interface CloudflareDNSRecord {
  id: string
  type: string
  name: string
  content: string
  ttl: number
}

interface CloudflareSecuritySettings {
  value: string
  id: string
}

interface CloudflareSSLSettings {
  value: string
  id: string
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey, email, step } = await request.json()

    if (!apiKey || !email) {
      return NextResponse.json(
        { error: 'API key and email are required' },
        { status: 400 }
      )
    }

    const headers = {
      'X-Auth-Email': email,
      'X-Auth-Key': apiKey,
      'Content-Type': 'application/json',
    }

    // Simulate different steps of the import process
    switch (step) {
      case 0: // Connecting to Cloudflare API
        try {
          const response = await fetch('https://api.cloudflare.com/client/v4/user', {
            headers,
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.errors?.[0]?.message || 'Authentication failed')
          }
          
          return NextResponse.json({ success: true })
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to authenticate with Cloudflare API' },
            { status: 401 }
          )
        }

      case 1: // Fetching zones and domains
        try {
          const response = await fetch('https://api.cloudflare.com/client/v4/zones', {
            headers,
          })
          
          if (!response.ok) {
            throw new Error('Failed to fetch zones')
          }
          
          const data = await response.json()
          const zones = data.result as CloudflareZone[]
          
          return NextResponse.json({ 
            success: true, 
            zones: zones.slice(0, 5) // Limit for demo
          })
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to fetch zones' },
            { status: 500 }
          )
        }

      case 2: // Importing DNS settings
      case 3: // Importing security configuration  
      case 4: // Importing performance settings
        // These steps would fetch specific settings for each zone
        return NextResponse.json({ success: true })

      case 5: // Finalizing import
        try {
          // Fetch zones first
          const zonesResponse = await fetch('https://api.cloudflare.com/client/v4/zones', {
            headers,
          })
          
          if (!zonesResponse.ok) {
            throw new Error('Failed to fetch zones')
          }
          
          const zonesData = await zonesResponse.json()
          const zones = zonesData.result as CloudflareZone[]
          
          // For each zone, fetch detailed settings
          const settings = await Promise.all(
            zones.slice(0, 3).map(async (zone) => {
              try {
                // Fetch DNS records
                const dnsResponse = await fetch(
                  `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records`,
                  { headers }
                )
                const dnsData = dnsResponse.ok ? await dnsResponse.json() : { result: [] }
                
                // Fetch security settings
                const securityResponse = await fetch(
                  `https://api.cloudflare.com/client/v4/zones/${zone.id}/settings/security_level`,
                  { headers }
                )
                const securityData = securityResponse.ok ? await securityResponse.json() : { result: { value: 'medium' } }
                
                // Fetch SSL settings
                const sslResponse = await fetch(
                  `https://api.cloudflare.com/client/v4/zones/${zone.id}/settings/ssl`,
                  { headers }
                )
                const sslData = sslResponse.ok ? await sslResponse.json() : { result: { value: 'flexible' } }

                return {
                  domain: zone.name,
                  zoneId: zone.id,
                  dns: (dnsData.result as CloudflareDNSRecord[]).map(record => ({
                    type: record.type,
                    name: record.name,
                    content: record.content,
                    ttl: record.ttl,
                  })),
                  security: {
                    securityLevel: (securityData.result as CloudflareSecuritySettings).value,
                    sslMode: (sslData.result as CloudflareSSLSettings).value,
                    botFightMode: false, // Would need separate API call
                  },
                  performance: {
                    caching: true, // Would need separate API call
                    minify: {
                      css: true,
                      html: true, 
                      js: true,
                    },
                    brotli: true,
                  },
                }
              } catch (error) {
                console.error(`Failed to fetch settings for ${zone.name}:`, error)
                return {
                  domain: zone.name,
                  zoneId: zone.id,
                  dns: [],
                  security: {
                    securityLevel: 'medium',
                    sslMode: 'flexible',
                    botFightMode: false,
                  },
                  performance: {
                    caching: true,
                    minify: { css: true, html: true, js: true },
                    brotli: true,
                  },
                }
              }
            })
          )
          
          return NextResponse.json({ 
            success: true,
            settings 
          })
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to finalize import' },
            { status: 500 }
          )
        }

      default:
        return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Cloudflare import error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}