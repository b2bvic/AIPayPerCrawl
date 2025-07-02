'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react'

// Mock user data
const mockUser = {
  name: 'John Publisher',
  email: 'john@example.com',
  isPublisher: true,
}

// Mock API keys data
const mockApiKeys = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'pk_live_51234567890abcdef',
    lastUsed: '2024-01-15T10:30:00Z',
    created: '2024-01-01T00:00:00Z',
    permissions: ['read', 'write', 'crawl'],
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'pk_test_09876543210fedcba',
    lastUsed: '2024-01-14T16:45:00Z',
    created: '2024-01-05T00:00:00Z',
    permissions: ['read', 'crawl'],
  },
] as Array<{
  id: string
  name: string
  key: string
  lastUsed: string | null
  created: string
  permissions: string[]
}>

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: {
      read: true,
      write: false,
      crawl: true,
      analytics: false,
    }
  })

  const handleCopyKey = (keyId: string, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleDeleteKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(k => k.id !== keyId))
    }
  }

  const handleCreateKey = () => {
    const permissions = Object.entries(newKeyData.permissions)
      .filter(([_, enabled]) => enabled)
      .map(([permission]) => permission)

    const newKey = {
      id: Date.now().toString(),
      name: newKeyData.name,
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
      lastUsed: null,
      created: new Date().toISOString(),
      permissions,
    }

    setApiKeys([...apiKeys, newKey])
    setShowCreateModal(false)
    setNewKeyData({
      name: '',
      permissions: {
        read: true,
        write: false,
        crawl: true,
        analytics: false,
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header user={mockUser} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">API Keys</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Manage your API keys for programmatic access to AIPayPerCrawl
          </p>
        </div>

        {/* Security Notice */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Keep your API keys secure
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Never share your secret API keys in publicly accessible areas such as GitHub, client-side code, or anywhere else.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your API Keys</h2>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {apiKeys.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No API keys yet. Create your first key to get started.
                </p>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {apiKey.name}
                        </h3>
                        <div className="flex gap-2">
                          {apiKey.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {showKey === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 10)}...`}
                        </code>
                        <button
                          onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          {showKey === apiKey.id ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopyKey(apiKey.id, apiKey.key)}
                          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                          {copiedKey === apiKey.id ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>Created: {new Date(apiKey.created).toLocaleDateString()}</span>
                        {apiKey.lastUsed && (
                          <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {/* Handle regenerate */}}
                        className="p-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* API Documentation Link */}
        <div className="mt-8 bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Ready to integrate?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Learn how to use your API keys to access the AIPayPerCrawl API.
          </p>
          <Button variant="outline" href="/api-docs">
            View API Documentation
          </Button>
        </div>
      </main>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Create New API Key
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="key-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Key Name
                </label>
                <input
                  type="text"
                  id="key-name"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  placeholder="e.g., Production API Key"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Permissions
                </label>
                <div className="space-y-2">
                  {Object.entries(newKeyData.permissions).map(([permission, enabled]) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setNewKeyData({
                          ...newKeyData,
                          permissions: {
                            ...newKeyData.permissions,
                            [permission]: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300 capitalize">
                        {permission}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This key will only be shown once. Make sure to copy it and store it securely.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateKey}
                disabled={!newKeyData.name}
              >
                Create Key
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}