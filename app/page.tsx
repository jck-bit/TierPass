import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      features: ['Community events', 'Basic workshops', 'Email support'],
      eventCount: 2
    },
    {
      name: 'Silver',
      price: '$29/mo',
      color: 'bg-gray-300 text-gray-900 border-gray-400',
      features: ['All Free benefits', 'Advanced masterclasses', 'Priority support', 'Q&A sessions'],
      eventCount: 4
    },
    {
      name: 'Gold',
      price: '$79/mo',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-400',
      features: ['All Silver benefits', 'Exclusive summits', 'Direct chat support', 'Networking events'],
      eventCount: 6
    },
    {
      name: 'Platinum',
      price: '$199/mo',
      color: 'bg-purple-100 text-purple-800 border-purple-400',
      features: ['All Gold benefits', 'VIP forums', '1-on-1 mentorship', 'Concierge support'],
      eventCount: 8
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Exclusive Events for Every Member
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our tier-based event platform and unlock access to workshops, summits, and networking opportunities tailored to your membership level.
        </p>
        
        <SignedOut>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/sign-up" 
              className="px-8 py-3 bg-[#6c47ff] text-white font-semibold rounded-full hover:bg-[#5a3ee6] transition-colors"
            >
              Get Started Free
            </Link>
            <Link 
              href="/sign-in" 
              className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </SignedOut>
        
        <SignedIn>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-3 bg-[#6c47ff] text-white font-semibold rounded-full hover:bg-[#5a3ee6] transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/events" 
              className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </SignedIn>
      </section>

      {/* Membership Tiers */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Choose Your Membership Tier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${tier.color} mb-4`}>
                {tier.name}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {tier.price}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-4">
                Access to {tier.eventCount} event types
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#6c47ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Exclusive Access</h3>
            <p className="text-gray-600">Events tailored to your membership tier with increasing exclusivity</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#6c47ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-gray-600">Built with Clerk.dev authentication and Supabase security</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#6c47ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-gray-600">Sign up and immediately access events for your tier</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p> 2024 Event Showcase. Built with Next.js, Clerk, Supabase, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
