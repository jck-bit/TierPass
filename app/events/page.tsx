import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getEventsForUserTier, getAllEvents, TierType } from '@/lib/services/events'
import EventCard from '@/app/_components/EventCard'
import EventCardSkeleton from '@/app/_components/EventCardSkeleton'
import { Suspense } from 'react'

// Loading component for events
function EventsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Error component
function EventsError({ error }: { error: Error }) {
  return (
    <div className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Events</h3>
        <p className="text-red-700">{error.message || 'Failed to load events. Please try again later.'}</p>
      </div>
    </div>
  )
}

// Separate component for events list
async function EventsList({ userTier }: { userTier: TierType }) {
  try {

    const accessibleEvents = await getEventsForUserTier(userTier)
    const allEvents = await getAllEvents()

    const accessibleEventIds = new Set(accessibleEvents.map(event => event.id))

    if (allEvents.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events available at the moment.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isAccessible={accessibleEventIds.has(event.id)}
          />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error fetching events:', error)
    throw new Error('Failed to load events')
  }
}

export default async function EventsPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  let user = null
  let userTier: TierType = 'free'

  try {
    user = await currentUser()
    userTier = (user?.publicMetadata?.tier as TierType) || 'free'
  } catch (error) {
    console.error('Error fetching user:', error)
    userTier = 'free'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exclusive Events
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Discover and attend events tailored to your membership tier
          </p>

          {/* User Tier Badge */}
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
            <span className="text-sm font-medium text-gray-600">Your tier:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${userTier === 'free' ? 'bg-gray-100 text-gray-800' :
              userTier === 'silver' ? 'bg-gray-300 text-gray-900' :
                userTier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
              }`}>
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
            </span>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {userTier === 'free' && 'Fre Tier Benefits'}
            {userTier === 'silver' && 'Silver Tier Benefits'}
            {userTier === 'gold' && 'Gold Tier Benefits'}
            {userTier === 'platinum' && 'Platinum Tier Benefits'}
          </h2>
          <p className="text-gray-600">
            {userTier === 'free' && 'Access to community events and introductory workshops'}
            {userTier === 'silver' && 'Access to Free events plus advanced workshops and masterclasses'}
            {userTier === 'gold' && 'Access to Free, Silver events plus exclusive summits and premium workshops'}
            {userTier === 'platinum' && 'Full access to all events including VIP forums and executive gatherings'}
          </p>
        </div>

        <Suspense fallback={<EventsLoading />}>
          <EventsList userTier={userTier} />
        </Suspense>

        {/* Upgrade CTA for non-platinum users */}
        {userTier !== 'platinum' && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Unlock More Exclusive Events
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Upgrade your membership to access premium events and networking opportunities
            </p>
            <button className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Upgrade Membership
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
