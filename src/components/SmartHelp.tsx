'use client'

import React, { useState, useCallback } from 'react'
import { HelpCircle, Search, ExternalLink, Clock, AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { 
  getTechnicalDocumentationCached, 
  getTroubleshootingSolutions,
  TechnicalResource,
  checkWebSearchHealth
} from '@/lib/webAgent'

interface SmartHelpProps {
  context?: string // e.g., 'quote-generation', 'domain-search', 'api-integration'
  trigger?: 'button' | 'auto' | 'error'
  errorMessage?: string
  className?: string
}

export function SmartHelp({ 
  context = 'general', 
  trigger = 'button', 
  errorMessage,
  className = '' 
}: SmartHelpProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resources, setResources] = useState<TechnicalResource[]>([])
  const [searchHealth, setSearchHealth] = useState<'unknown' | 'healthy' | 'degraded' | 'unhealthy'>('unknown')

  const fetchHelpResources = useCallback(async () => {
    setIsLoading(true)
    
    try {
      // Check web search health first
      const health = await checkWebSearchHealth()
      setSearchHealth(health.status)

      let helpResources: TechnicalResource[] = []

      if (errorMessage) {
        // Get troubleshooting solutions for specific errors
        helpResources = await getTroubleshootingSolutions(errorMessage, context)
      } else {
        // Get general documentation based on context
        const contextQueries = {
          'quote-generation': 'API quote generation pricing calculation',
          'domain-search': 'domain directory search filters',
          'api-integration': 'REST API integration tutorial',
          'payment': 'payment processing integration',
          'publisher-dashboard': 'publisher analytics dashboard',
          'general': 'web scraping API getting started'
        }

        const query = contextQueries[context as keyof typeof contextQueries] || contextQueries.general
        
        helpResources = await getTechnicalDocumentationCached(query, {
          difficulty: 'beginner',
          type: 'tutorial'
        })
      }

      setResources(helpResources)
    } catch (error) {
      console.error('Failed to fetch help resources:', error)
      setSearchHealth('unhealthy')
      
      // Fallback to static help content
      setResources([
        {
          title: 'Getting Started Guide',
          url: '/api-docs',
          content: 'Check our API documentation for basic integration steps.',
          type: 'documentation',
          lastUpdated: new Date(),
          difficulty: 'beginner'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }, [context, errorMessage])

  const handleToggleHelp = useCallback(async () => {
    if (!isOpen && resources.length === 0) {
      await fetchHelpResources()
    }
    setIsOpen(!isOpen)
  }, [isOpen, resources.length, fetchHelpResources])

  // Auto-trigger for errors
  React.useEffect(() => {
    if (trigger === 'error' && errorMessage) {
      handleToggleHelp()
    }
  }, [trigger, errorMessage, handleToggleHelp])

  const getContextTitle = () => {
    const titles = {
      'quote-generation': 'Quote Generation Help',
      'domain-search': 'Domain Search Help',
      'api-integration': 'API Integration Help',
      'payment': 'Payment Help',
      'publisher-dashboard': 'Publisher Dashboard Help',
      'general': 'Help & Support'
    }
    return titles[context as keyof typeof titles] || titles.general
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50'
      case 'intermediate': return 'text-yellow-600 bg-yellow-50'
      case 'advanced': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return '📚'
      case 'documentation': return '📖'
      case 'troubleshooting': return '🔧'
      case 'example': return '💡'
      default: return '📄'
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      {trigger === 'button' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleHelp}
          className="flex items-center space-x-1"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help</span>
        </Button>
      )}

      {/* Error Banner */}
      {trigger === 'error' && errorMessage && (
        <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{errorMessage}</p>
            <Button
              variant="link"
              size="sm"
              onClick={handleToggleHelp}
              className="text-red-600 p-0 h-auto font-medium"
            >
              Get help with this error →
            </Button>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{getContextTitle()}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Search Health Indicator */}
            {searchHealth !== 'unknown' && (
              <div className="flex items-center space-x-1 mt-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  searchHealth === 'healthy' ? 'bg-green-500' : 
                  searchHealth === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-gray-500">
                  Search: {searchHealth}
                </span>
              </div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Finding relevant help...</p>
              </div>
            ) : resources.length > 0 ? (
              <div className="p-4 space-y-3">
                {resources.map((resource, index) => (
                  <div key={index} className="border border-gray-100 rounded-md p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getResourceIcon(resource.type)}</span>
                        <h4 className="font-medium text-sm text-gray-900 leading-tight">
                          {resource.title}
                        </h4>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {resource.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{resource.lastUpdated.toLocaleDateString()}</span>
                      </div>
                      
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No help resources found for this context.</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={fetchHelpResources}
                  className="mt-2"
                >
                  Try searching again
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Need more help?</span>
              <a
                href="/support"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Context-specific help components for easy integration
export function QuoteGenerationHelp({ className }: { className?: string }) {
  return (
    <SmartHelp
      context="quote-generation"
      trigger="button"
      className={className}
    />
  )
}

export function APIIntegrationHelp({ className }: { className?: string }) {
  return (
    <SmartHelp
      context="api-integration"
      trigger="button"
      className={className}
    />
  )
}

export function ErrorHelp({ 
  errorMessage, 
  context,
  className 
}: { 
  errorMessage: string
  context?: string
  className?: string 
}) {
  return (
    <SmartHelp
      context={context}
      trigger="error"
      errorMessage={errorMessage}
      className={className}
    />
  )
}