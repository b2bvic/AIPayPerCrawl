'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Globe, 
  Shield,
  Trash2,
  Save,
  AlertCircle
} from 'lucide-react'

// Mock user data - replace with actual user data from auth
const mockUser = {
  name: 'John Publisher',
  email: 'john@example.com',
  isPublisher: true,
  createdAt: '2024-01-01',
  emailVerified: true,
  twoFactorEnabled: false,
  notifications: {
    email: true,
    crawlActivity: true,
    paymentUpdates: true,
    newsletter: false,
  },
  preferences: {
    timezone: 'UTC',
    language: 'en',
  }
}

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile')
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: mockUser.notifications,
    preferences: mockUser.preferences,
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ]

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update
    console.log('Saving profile:', formData)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password change
    console.log('Changing password')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header user={mockUser} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                    Profile Information
                  </h2>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                        {mockUser.emailVerified && (
                          <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Member Since
                      </label>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(mockUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                    Security Settings
                  </h2>

                  {/* Change Password */}
                  <form onSubmit={handleChangePassword} className="space-y-6 mb-8">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Change Password</h3>
                    
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>

                    <Button type="submit">
                      Update Password
                    </Button>
                  </form>

                  {/* Two-Factor Authentication */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Add an extra layer of security to your account
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                          Status: {mockUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <Button variant="outline">
                        {mockUser.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                      </Button>
                    </div>
                  </div>

                  {/* Account Deletion */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-8 mt-8">
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-3 text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                        Email Notifications
                      </h3>
                      <div className="space-y-4">
                        {Object.entries({
                          email: 'General notifications',
                          crawlActivity: 'Crawl activity alerts',
                          paymentUpdates: 'Payment and billing updates',
                          newsletter: 'Product updates and newsletter',
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center justify-between">
                            <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                            <input
                              type="checkbox"
                              checked={formData.notifications[key as keyof typeof formData.notifications]}
                              onChange={(e) => setFormData({
                                ...formData,
                                notifications: {
                                  ...formData.notifications,
                                  [key]: e.target.checked
                                }
                              })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                    Preferences
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        value={formData.preferences.timezone}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, timezone: e.target.value }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Language
                      </label>
                      <select
                        id="language"
                        value={formData.preferences.language}
                        onChange={(e) => setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, language: e.target.value }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}