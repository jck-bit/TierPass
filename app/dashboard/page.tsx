import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { TierType } from '@/lib/services/events'
import TierUpgradeSimulator from '@/app/_components/TierUpgradeSimulator'

export default async function DashboardPage() {
  // Check if user is authenticated
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  // Get current user and their tier from metadata
  let user = null
  let userTier: TierType = 'free'

  try {
    user = await currentUser()
    userTier = (user?.publicMetadata?.tier as TierType) || 'free'
  } catch (error) {
    console.error('Error fetching user:', error)
    // Use default tier if there's an error
    userTier = 'free'
  }

  const tierBenefits = {
    free: [
      'Access to community events',
      'Basic workshops and meetups',
      'Email support',
      'Community forum access'
    ],
    silver: [
      'All Free tier benefits',
      'Advanced workshops and masterclasses',
      'Priority email support',
      'Monthly expert Q&A sessions',
      'Recording access for 30 days'
    ],
    gold: [
      'All Silver tier benefits',
      'Exclusive summits and conferences',
      'Premium workshops with industry leaders',
      'Direct support chat',
      'Lifetime recording access',
      'Networking events'
    ],
    platinum: [
      'All Gold tier benefits',
      'VIP executive forums',
      'One-on-one mentorship sessions',
      'Early access to all events',
      'Private networking dinners',
      'Concierge support'
    ]
  }

  const tierColors = {
    free: 'bg-gray-100 text-gray-800 border-gray-300',
    silver: 'bg-gray-300 text-gray-900 border-gray-400',
    gold: 'bg-yellow-100 text-yellow-800 border-yellow-400',
    platinum: 'bg-purple-100 text-purple-800 border-purple-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-lg text-gray-600">Current membership:</span>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold border-2 ${tierColors[userTier]}`}>
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Tier
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Benefits */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Current Benefits
            </h2>
            <ul className="space-y-3">
              {tierBenefits[userTier].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="/events"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#6c47ff] text-white font-semibold rounded-lg hover:bg-[#5a3ee6] transition-colors"
              >
                Browse Available Events
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Tier Upgrade Simulator */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tier Upgrade
            </h2>
            <p className="text-gray-600 mb-6">
              Test how different membership tiers unlock exclusive events. This is for demonstration purposes only.
            </p>
            <TierUpgradeSimulator currentTier={userTier} userId={userId} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-[#6c47ff] mb-2">
              {userTier === 'free' ? '2' : userTier === 'silver' ? '4' : userTier === 'gold' ? '6' : '8'}
            </div>
            <p className="text-gray-600">Events Available</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {userTier === 'platinum' ? '0' : userTier === 'gold' ? '2' : userTier === 'silver' ? '4' : '6'}
            </div>
            <p className="text-gray-600">Locked Events</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {userTier === 'free' ? '3' : userTier === 'silver' ? '2' : userTier === 'gold' ? '1' : '0'}
            </div>
            <p className="text-gray-600">Upgrades Available</p>
          </div>
        </div>
      </div>
    </div>
  )
}
