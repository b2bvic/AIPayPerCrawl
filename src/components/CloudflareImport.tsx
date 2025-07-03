'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Cloud,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Shield,
  Zap
} from 'lucide-react'

interface CloudflareSettings {
  domain: string
  zoneId: string
  dns: Array<{
    type: string
    name: string
    content: string
    ttl: number
  }>
  security: {
    securityLevel: string
    sslMode: string
    botFightMode: boolean
  }
  performance: {
    caching: boolean
    minify: {
      css: boolean
      html: boolean
      js: boolean
    }
    brotli: boolean
  }
}

interface ImportProgress {
  step: string
  status: 'pending' | 'success' | 'error'
  message: string
}

export function CloudflareImport() {
  const [apiKey, setApiKey] = useState('')
  const [email, setEmail] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<ImportProgress[]>([])
  const [importedSettings, setImportedSettings] = useState<CloudflareSettings[]>([])
  const [showApiForm, setShowApiForm] = useState(true)

  const handleImport = async () => {
    if (!apiKey || !email) {
      alert('Please provide both API key and email')
      return
    }

    setIsImporting(true)
    setImportProgress([])
    setShowApiForm(false)

    const steps = [
      'Connecting to Cloudflare API',
      'Fetching zones and domains',
      'Importing DNS settings',
      'Importing security configuration',
      'Importing performance settings',
      'Finalizing import'
    ]

    try {
      // Simulate API calls with progress updates
      for (let i = 0; i < steps.length; i++) {
        setImportProgress(prev => [
          ...prev,
          { step: steps[i], status: 'pending', message: 'In progress...' }
        ])

        // Call the actual API endpoint
        const response = await fetch('/api/cloudflare/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey,
            email,
            step: i
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Import failed')
        }

        // Update progress
        setImportProgress(prev => 
          prev.map((p, idx) => 
            idx === i 
              ? { ...p, status: 'success', message: 'Completed' }
              : p
          )
        )

        // Store settings on final step
        if (i === steps.length - 1 && data.settings) {
          setImportedSettings(data.settings)
        }

        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setImportProgress(prev => [
        ...prev,
        { step: 'Import failed', status: 'error', message: errorMessage }
      ])
    } finally {
      setIsImporting(false)
    }
  }

  const handleApplySettings = async (domain: string) => {
    try {
      const response = await fetch('/api/domains/apply-cloudflare-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      })

      if (response.ok) {
        alert('Settings applied successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to apply settings: ${error.message}`)
      }
    } catch (error) {
      alert('Failed to apply settings')
    }
  }

  const resetImport = () => {
    setShowApiForm(true)
    setImportProgress([])
    setImportedSettings([])
    setIsImporting(false)
  }

  if (!showApiForm && importProgress.length > 0) {
    return (
      <Card className="p-6">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Cloud className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Importing Cloudflare Settings
            </h3>
          </div>

        <div className="space-y-3 mb-6">
          {importProgress.map((progress, index) => (
            <div key={index} className="flex items-center gap-3">
              {progress.status === 'pending' && (
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              )}
              {progress.status === 'success' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {progress.status === 'error' && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {progress.step}: {progress.message}
              </span>
            </div>
          ))}
        </div>

        {importedSettings.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white">
              Imported Domains ({importedSettings.length})
            </h4>
            {importedSettings.map((setting, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {setting.domain}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleApplySettings(setting.domain)}
                  >
                    Apply Settings
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      Security: {setting.security.securityLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      SSL: {setting.security.sslMode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-blue-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      DNS Records: {setting.dns.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isImporting && (
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={resetImport}>
              Import Another Account
            </Button>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="h-6 w-6 text-orange-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Import Cloudflare Settings
        </h3>
      </div>

      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Automatically import your domain configurations, security settings, and DNS records 
        from your Cloudflare account with a single click.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Cloudflare Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your Cloudflare Global API Key"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Find your API key in Cloudflare Dashboard → My Profile → API Tokens
          </p>
        </div>

        <Button 
          onClick={handleImport}
          disabled={!apiKey || !email || isImporting}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Import Settings
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          What will be imported:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• All domains and zones from your Cloudflare account</li>
          <li>• DNS record configurations</li>
          <li>• Security settings (SSL, Security Level, Bot Fight Mode)</li>
          <li>• Performance settings (Caching, Minification, Brotli)</li>
        </ul>
      </div>
    </Card>
  )
}