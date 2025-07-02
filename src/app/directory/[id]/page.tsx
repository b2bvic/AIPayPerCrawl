import React from 'react'
import DomainDetailClient from './DomainDetailClient'

// Generate static params for static export
export async function generateStaticParams() {
  // Generate params for all domains in our database
  try {
    const response = await fetch('https://5debb506.aipaypercrawl.pages.dev/api/domains?limit=100')
    const result = await response.json()
    
    if (result.success && result.domains) {
      return result.domains.map((domain: any) => ({
        id: domain.id
      }))
    }
  } catch (error) {
    console.error('Error generating static params:', error)
  }
  
  // Fallback to basic IDs if API fails
  return [
    { id: 'domain_example1' },
    { id: 'domain_news1' },
    { id: 'domain_ecom1' },
    { id: 'domain_tech1' },
    { id: 'domain_biz1' },
    { id: 'domain_health1' },
    { id: 'domain_edu1' },
    { id: 'domain_fin1' },
    { id: 'domain_travel1' },
    { id: 'domain_game1' },
    { id: 'domain_legal1' },
    { id: 'domain_real1' },
    { id: 'domain_auto1' },
    { id: 'domain_food1' },
    { id: 'domain_fashion1' },
    { id: 'domain_sports1' },
    { id: 'domain_gov1' },
    { id: 'domain_startup1' },
    { id: 'domain_crypto1' },
    { id: 'domain_medical1' },
  ]
}

export default async function DomainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <DomainDetailClient id={id} />
} 