'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  DollarSign,
  Percent,
  Users,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Gift,
  Save,
  X
} from 'lucide-react'

interface PricingTier {
  id: string
  name: string
  pricePerRequest: number
  description: string
  isDefault: boolean
}

interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
  validUntil: string
  usageLimit: number
  usedCount: number
  isActive: boolean
  partnerEmail: string
}

const mockPricingTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Standard',
    pricePerRequest: 0.001,
    description: 'Standard pricing for commercial AI companies',
    isDefault: true,
  },
  {
    id: '2', 
    name: 'Premium',
    pricePerRequest: 0.002,
    description: 'Premium pricing for high-volume requests',
    isDefault: false,
  },
  {
    id: '3',
    name: 'Research',
    pricePerRequest: 0.0005,
    description: 'Discounted rate for academic research',
    isDefault: false,
  },
]

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'RESEARCH2024',
    type: 'percentage',
    value: 50,
    description: 'Academic research discount',
    validUntil: '2024-12-31',
    usageLimit: 1000,
    usedCount: 156,
    isActive: true,
    partnerEmail: 'research@university.edu',
  },
  {
    id: '2',
    code: 'STARTUP30',
    type: 'percentage', 
    value: 30,
    description: 'Startup partner discount',
    validUntil: '2024-06-30',
    usageLimit: 500,
    usedCount: 423,
    isActive: true,
    partnerEmail: 'team@startup.com',
  },
]

export function PricingManager() {
  const [activeTab, setActiveTab] = useState<'pricing' | 'coupons'>('pricing')
  const [pricingTiers, setPricingTiers] = useState(mockPricingTiers)
  const [coupons, setCoupons] = useState(mockCoupons)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null)
  const [showNewTierForm, setShowNewTierForm] = useState(false)
  const [showNewCouponForm, setShowNewCouponForm] = useState(false)

  const [newTier, setNewTier] = useState<Partial<PricingTier>>({
    name: '',
    pricePerRequest: 0.001,
    description: '',
    isDefault: false,
  })

  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    type: 'percentage',
    value: 0,
    description: '',
    validUntil: '',
    usageLimit: 100,
    partnerEmail: '',
  })

  const handleSaveTier = () => {
    if (editingTier) {
      setPricingTiers(prev => 
        prev.map(tier => 
          tier.id === editingTier 
            ? { ...tier, ...newTier } as PricingTier
            : tier
        )
      )
      setEditingTier(null)
    } else {
      const tier: PricingTier = {
        id: Date.now().toString(),
        name: newTier.name || '',
        pricePerRequest: newTier.pricePerRequest || 0.001,
        description: newTier.description || '',
        isDefault: newTier.isDefault || false,
      }
      setPricingTiers(prev => [...prev, tier])
      setShowNewTierForm(false)
    }
    setNewTier({ name: '', pricePerRequest: 0.001, description: '', isDefault: false })
  }

  const handleSaveCoupon = () => {
    if (editingCoupon) {
      setCoupons(prev =>
        prev.map(coupon =>
          coupon.id === editingCoupon
            ? { ...coupon, ...newCoupon } as Coupon
            : coupon
        )
      )
      setEditingCoupon(null)
    } else {
      const coupon: Coupon = {
        id: Date.now().toString(),
        code: newCoupon.code || '',
        type: newCoupon.type || 'percentage',
        value: newCoupon.value || 0,
        description: newCoupon.description || '',
        validUntil: newCoupon.validUntil || '',
        usageLimit: newCoupon.usageLimit || 100,
        usedCount: 0,
        isActive: true,
        partnerEmail: newCoupon.partnerEmail || '',
      }
      setCoupons(prev => [...prev, coupon])
      setShowNewCouponForm(false)
    }
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 0,
      description: '',
      validUntil: '',
      usageLimit: 100,
      partnerEmail: '',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'pricing'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Pricing Tiers
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
              activeTab === 'coupons'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Gift className="h-4 w-4" />
            Research Coupons
          </button>
        </nav>
      </div>

      {/* Pricing Tiers Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Pricing Tiers
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Manage different pricing levels for your domains.
              </p>
            </div>
            <Button 
              onClick={() => setShowNewTierForm(true)}
              disabled={showNewTierForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>

          {/* New Tier Form */}
          {showNewTierForm && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    Add New Pricing Tier
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewTierForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tier Name
                    </label>
                    <input
                      type="text"
                      value={newTier.name}
                      onChange={(e) => setNewTier(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Premium"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Price per Request (USD)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={newTier.pricePerRequest}
                      onChange={(e) => setNewTier(prev => ({ ...prev, pricePerRequest: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTier.description}
                    onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this pricing tier..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={handleSaveTier}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Tier
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Pricing Tiers List */}
          <div className="space-y-4">
            {pricingTiers.map((tier) => (
              <Card key={tier.id}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                            {tier.name}
                          </h3>
                          {tier.isDefault && (
                            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {tier.description}
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                          {formatCurrency(tier.pricePerRequest)} per request
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setEditingTier(tier.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Research Partner Coupons
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                Create and manage discount coupons for research partners.
              </p>
            </div>
            <Button 
              onClick={() => setShowNewCouponForm(true)}
              disabled={showNewCouponForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </div>

          {/* New Coupon Form */}
          {showNewCouponForm && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    Create New Coupon
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNewCouponForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="RESEARCH2024"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Partner Email
                    </label>
                    <input
                      type="email"
                      value={newCoupon.partnerEmail}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, partnerEmail: e.target.value }))}
                      placeholder="research@university.edu"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Discount Type
                    </label>
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {newCoupon.type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount ($)'}
                    </label>
                    <input
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, usageLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={newCoupon.validUntil}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Academic research discount"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveCoupon}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </div>
            </Card>
          )}

          {/* Coupons List */}
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Gift className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                            {coupon.code}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            coupon.isActive 
                              ? 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30'
                              : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                          }`}>
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {coupon.description} • {coupon.partnerEmail}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-300">
                          <span>
                            {coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`}
                          </span>
                          <span>•</span>
                          <span>
                            {coupon.usedCount}/{coupon.usageLimit} used
                          </span>
                          <span>•</span>
                          <span>
                            Expires {formatDate(coupon.validUntil)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={() => setEditingCoupon(coupon.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}