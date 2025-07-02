import { z } from 'zod'

// Schema for market pricing data
export const MarketPricingSchema = z.object({
  domain: z.string(),
  suggestedPrice: z.number(),
  marketAverage: z.number(),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  competitorPrices: z.array(z.object({
    domain: z.string(),
    price: z.number(),
    traffic: z.number().optional(),
  })),
  factors: z.object({
    traffic: z.number(),
    vertical: z.string(),
    contentQuality: z.number(), // 0-100 score
    uniqueness: z.number(), // 0-100 score
  }),
  currency: z.string().default('USD'),
  updatedAt: z.string(),
})

export type MarketPricing = z.infer<typeof MarketPricingSchema>

/**
 * Calculate suggested pricing based on market conditions with real traffic data
 */
export async function calculateMarketPricing(
  domain: string,
  vertical?: string,
  traffic?: number,
  apiBaseUrl?: string
): Promise<MarketPricing> {
  try {
    // Get real traffic data if not provided
    let actualTraffic = traffic
    let trafficConfidence = 'provided'
    
    if (!actualTraffic && apiBaseUrl) {
      try {
        const trafficResponse = await fetch(`${apiBaseUrl}/api/traffic?domain=${encodeURIComponent(domain)}`);
        if (trafficResponse.ok) {
          const trafficData = await trafficResponse.json();
          if (trafficData.success && trafficData.data) {
            actualTraffic = trafficData.data.estimated_monthly_visits;
            trafficConfidence = trafficData.data.confidence;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch traffic data:', error);
      }
    }
    
    // Base pricing model
    const basePrice = 0.001 // $0.001 per request minimum
    
    // Enhanced traffic multiplier with confidence adjustment
    let trafficMultiplier = 1;
    if (actualTraffic) {
      // Logarithmic scaling for traffic (prevents extreme pricing for high-traffic sites)
      trafficMultiplier = Math.log10(Math.max(actualTraffic, 1000)) / 3;
      
      // Adjust based on data confidence
      const confidenceMultipliers = {
        'high': 1.0,
        'medium': 0.9,
        'low': 0.7,
        'provided': 1.0
      };
      trafficMultiplier *= confidenceMultipliers[trafficConfidence as keyof typeof confidenceMultipliers] || 0.8;
    }
    
    // Enhanced vertical multipliers based on market research
    const verticalMultipliers: Record<string, number> = {
      'Technology': 1.8,
      'Finance': 2.5,
      'Healthcare': 3.0,
      'E-commerce': 2.0,
      'News': 1.4,
      'Entertainment': 1.1,
      'Education': 1.5,
      'Government': 4.0,
      'Legal': 2.8,
      'Real Estate': 2.2,
      'Travel': 1.6,
      'Automotive': 1.7,
      'Food': 1.3,
      'Fashion': 1.4,
      'Sports': 1.2,
      'Gaming': 1.5,
    }
    
    const verticalMultiplier = vertical && verticalMultipliers[vertical] 
      ? verticalMultipliers[vertical] 
      : 1.2 // Default multiplier for unknown verticals

    // Domain quality factors
    const domainQualityScore = calculateDomainQuality(domain);
    const qualityMultiplier = 0.5 + (domainQualityScore / 100) * 1.5; // Range: 0.5 - 2.0

    // Calculate suggested price with all factors
    const rawPrice = basePrice * trafficMultiplier * verticalMultiplier * qualityMultiplier;
    const suggestedPrice = Number(Math.max(basePrice, rawPrice).toFixed(6));
    
    // Get competitor prices with traffic data integration
    const competitorPrices = await getCompetitorPrices(domain, vertical, apiBaseUrl);
    
    // Calculate market average with traffic weighting
    const marketAverage = competitorPrices.length > 0
      ? calculateTrafficWeightedAverage(competitorPrices)
      : suggestedPrice;

    // Dynamic price range based on market conditions
    const volatility = calculateMarketVolatility(competitorPrices);
    const priceRange = {
      min: Math.max(basePrice, marketAverage * (0.6 + volatility * 0.1)),
      max: marketAverage * (1.4 + volatility * 0.3),
    };

    // Enhanced content analysis
    const contentQuality = await estimateContentQuality(domain);
    const uniqueness = await estimateContentUniqueness(domain);

    return {
      domain,
      suggestedPrice,
      marketAverage,
      priceRange,
      competitorPrices,
      factors: {
        traffic: actualTraffic || 0,
        vertical: vertical || 'Unknown',
        contentQuality,
        uniqueness,
      },
      currency: 'USD',
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Market pricing calculation failed:', error)
    throw new Error('Failed to calculate market pricing')
  }
}

/**
 * Get competitor pricing data with traffic integration
 */
async function getCompetitorPrices(
  domain: string,
  vertical?: string,
  apiBaseUrl?: string
): Promise<Array<{ domain: string; price: number; traffic?: number }>> {
  // In production, this would:
  // 1. Query similar domains in the same vertical
  // 2. Fetch their current pricing
  // 3. Consider traffic levels
  
  // Mock data for now - in production would fetch from database
  const mockCompetitors = [
    { domain: 'competitor1.com', price: 0.0015, traffic: 500000 },
    { domain: 'competitor2.com', price: 0.002, traffic: 1000000 },
    { domain: 'competitor3.com', price: 0.0012, traffic: 250000 },
  ]
  
  // If we have API access, try to get real traffic data for competitors
  if (apiBaseUrl) {
    for (const competitor of mockCompetitors) {
      try {
        const trafficResponse = await fetch(`${apiBaseUrl}/api/traffic?domain=${encodeURIComponent(competitor.domain)}`);
        if (trafficResponse.ok) {
          const trafficData = await trafficResponse.json();
          if (trafficData.success && trafficData.data) {
            competitor.traffic = trafficData.data.estimated_monthly_visits;
          }
        }
      } catch (error) {
        // Continue with mock data if API fails
        console.warn(`Failed to fetch traffic for ${competitor.domain}:`, error);
      }
    }
  }
  
  return mockCompetitors
}

/**
 * Calculate domain quality score based on various factors
 */
function calculateDomainQuality(domain: string): number {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  let score = 50; // Base score
  
  // Domain length (shorter is generally better)
  const domainLength = cleanDomain.split('.')[0].length;
  if (domainLength <= 6) score += 20;
  else if (domainLength <= 10) score += 10;
  else if (domainLength > 15) score -= 10;
  
  // TLD quality
  const tld = cleanDomain.split('.').pop()?.toLowerCase();
  const premiumTLDs = ['com', 'org', 'net', 'edu', 'gov'];
  const goodTLDs = ['io', 'co', 'ai', 'tech'];
  
  if (premiumTLDs.includes(tld || '')) score += 15;
  else if (goodTLDs.includes(tld || '')) score += 10;
  else if (tld && tld.length > 3) score -= 5;
  
  // Hyphens and numbers (generally reduce quality)
  if (cleanDomain.includes('-')) score -= 5;
  if (/\d/.test(cleanDomain)) score -= 5;
  
  // Brandability (simple heuristic)
  const vowels = (cleanDomain.match(/[aeiou]/gi) || []).length;
  const consonants = cleanDomain.replace(/[aeiou\.\-\d]/gi, '').length;
  if (vowels > 0 && consonants > 0 && vowels / consonants > 0.3) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate traffic-weighted average price
 */
function calculateTrafficWeightedAverage(competitors: Array<{ domain: string; price: number; traffic?: number }>): number {
  const competitorsWithTraffic = competitors.filter(c => c.traffic && c.traffic > 0);
  
  if (competitorsWithTraffic.length === 0) {
    // Fallback to simple average
    return competitors.reduce((sum, c) => sum + c.price, 0) / competitors.length;
  }
  
  const totalWeightedPrice = competitorsWithTraffic.reduce((sum, c) => {
    const weight = Math.log10(c.traffic! + 1); // Log scale for traffic weighting
    return sum + (c.price * weight);
  }, 0);
  
  const totalWeight = competitorsWithTraffic.reduce((sum, c) => {
    return sum + Math.log10(c.traffic! + 1);
  }, 0);
  
  return totalWeightedPrice / totalWeight;
}

/**
 * Calculate market volatility based on price distribution
 */
function calculateMarketVolatility(competitors: Array<{ domain: string; price: number; traffic?: number }>): number {
  if (competitors.length < 2) return 0;
  
  const prices = competitors.map(c => c.price);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  const variance = prices.reduce((sum, price) => {
    return sum + Math.pow(price - mean, 2);
  }, 0) / prices.length;
  
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / mean;
  
  // Normalize to 0-1 scale (0 = low volatility, 1 = high volatility)
  return Math.min(1, coefficientOfVariation * 2);
}

/**
 * Estimate content quality (placeholder - would use actual content analysis)
 */
async function estimateContentQuality(domain: string): Promise<number> {
  // In production, this would analyze:
  // - Content freshness
  // - Grammar and spelling
  // - Content depth
  // - Media quality
  // - User engagement metrics
  
  // Simple heuristic based on domain characteristics for now
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  let score = 60; // Base score
  
  // Domain age estimation (would use real WHOIS data)
  if (cleanDomain.includes('blog') || cleanDomain.includes('news')) score += 10;
  if (cleanDomain.includes('wiki') || cleanDomain.includes('docs')) score += 15;
  
  // Add some randomization to simulate real analysis
  score += Math.floor(Math.random() * 20) - 10;
  
  return Math.max(30, Math.min(100, score));
}

/**
 * Estimate content uniqueness (placeholder - would use actual content analysis)
 */
async function estimateContentUniqueness(domain: string): Promise<number> {
  // In production, this would:
  // - Check for duplicate content
  // - Analyze content originality
  // - Compare against known content databases
  // - Check for plagiarism
  
  // Simple heuristic for now
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  let score = 70; // Base score
  
  // Government and educational sites typically have unique content
  const tld = cleanDomain.split('.').pop()?.toLowerCase();
  if (['gov', 'edu', 'org'].includes(tld || '')) score += 20;
  
  // News and blog sites often have original content
  if (cleanDomain.includes('news') || cleanDomain.includes('blog')) score += 10;
  
  // Add randomization to simulate real analysis
  score += Math.floor(Math.random() * 15) - 7;
  
  return Math.max(40, Math.min(100, score));
}

/**
 * Get pricing trends over time
 */
export async function getPricingTrends(
  vertical?: string,
  timeframe: 'day' | 'week' | 'month' | 'year' = 'month'
) {
  // In production, this would fetch historical pricing data
  return {
    vertical: vertical || 'all',
    timeframe,
    trend: 'increasing', // or 'decreasing', 'stable'
    changePercent: 5.2,
    dataPoints: [
      { date: '2024-01-01', avgPrice: 0.0015 },
      { date: '2024-02-01', avgPrice: 0.0016 },
      { date: '2024-03-01', avgPrice: 0.0017 },
    ],
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Optimize pricing based on demand
 */
export async function optimizePricing(
  domain: string,
  currentPrice: number,
  recentRequests: number,
  conversionRate: number
) {
  // Dynamic pricing algorithm
  const demandMultiplier = Math.min(2, Math.max(0.5, recentRequests / 1000))
  const conversionMultiplier = Math.min(1.5, Math.max(0.8, conversionRate * 2))
  
  const optimizedPrice = currentPrice * demandMultiplier * conversionMultiplier
  
  return {
    domain,
    currentPrice,
    optimizedPrice: Number(optimizedPrice.toFixed(6)),
    adjustment: ((optimizedPrice - currentPrice) / currentPrice) * 100,
    factors: {
      demand: demandMultiplier,
      conversion: conversionMultiplier,
    },
    recommendation: optimizedPrice > currentPrice ? 'increase' : 'decrease',
    updatedAt: new Date().toISOString(),
  }
} 