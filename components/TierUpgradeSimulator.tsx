'use client'

import { useState } from 'react'
import { TierType } from '@/lib/services/events'
import { useRouter } from 'next/navigation'

interface TierUpgradeSimulatorProps {
  currentTier: TierType
  userId: string
}

const tiers: TierType[] = ['free', 'silver', 'gold', 'platinum']

const tierInfo = {
  free: {
    price: '$0',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    description: 'Perfect for getting started'
  },
  silver: {
    price: '$29/mo',
    color: 'bg-gray-300 text-gray-900 border-gray-400',
    description: 'Great for regular attendees'
  },
  gold: {
    price: '$79/mo',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    description: 'Ideal for professionals'
  },
  platinum: {
    price: '$199/mo',
    color: 'bg-purple-100 text-purple-800 border-purple-400',
    description: 'Ultimate VIP experience'
  }
}

export default function TierUpgradeSimulator({ currentTier, userId }: TierUpgradeSimulatorProps) {
  const [selectedTier, setSelectedTier] = useState<TierType>(currentTier)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleTierUpdate = async () => {
    if (selectedTier === currentTier) return

    setIsUpdating(true)
    try {
      // Call API to update user tier in Clerk metadata
      const response = await fetch('/api/update-tier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tier: selectedTier
        })
      })

      if (response.ok) {
        // Refresh the page to show updated tier
        router.refresh()
      } else {
        console.error('Failed to update tier')
        alert('Failed to update tier. Please try again.')
      }
    } catch (error) {
      console.error('Error updating tier:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tier Selection */}
      <div className="space-y-3">
        {tiers.map((tier) => (
          <label
            key={tier}
            className={`relative flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedTier === tier 
                ? 'border-[#6c47ff] bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4">
              <input
                type="radio"
                name="tier"
                value={tier}
                checked={selectedTier === tier}
                onChange={(e) => setSelectedTier(e.target.value as TierType)}
                className="w-4 h-4 text-[#6c47ff] focus:ring-[#6c47ff] focus:ring-offset-0"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${tierInfo[tier].color}`}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </span>
                  {tier === currentTier && (
                    <span className="text-xs text-gray-500 font-medium">Current</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{tierInfo[tier].description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">{tierInfo[tier].price}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Update Button */}
      <button
        onClick={handleTierUpdate}
        disabled={selectedTier === currentTier || isUpdating}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          selectedTier === currentTier || isUpdating
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#6c47ff] text-white hover:bg-[#5a3ee6]'
        }`}
      >
        {isUpdating ? 'Updating...' : selectedTier === currentTier ? 'Current Tier' : 'Simulate Tier Change'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        This is a simulation for testing purposes. In production, tier changes would require payment processing.
      </p>
    </div>
  )
}
