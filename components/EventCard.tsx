import { Event } from '@/lib/services/events'
import { format } from 'date-fns'

interface EventCardProps {
  event: Event
  isAccessible: boolean
}

const tierColors = {
  free: 'bg-gray-100 text-gray-800 border-gray-300',
  silver: 'bg-gray-300 text-gray-900 border-gray-400',
  gold: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  platinum: 'bg-purple-100 text-purple-800 border-purple-400'
}

const tierGradients = {
  free: 'from-gray-50 to-gray-100',
  silver: 'from-gray-100 to-gray-200',
  gold: 'from-yellow-50 to-yellow-100',
  platinum: 'from-purple-50 to-purple-100'
}

export default function EventCard({ event, isAccessible }: EventCardProps) {
  const eventDate = new Date(event.event_date)
  const formattedDate = format(eventDate, 'MMMM d, yyyy')
  const formattedTime = format(eventDate, 'h:mm a')

  return (
    <div className={`relative overflow-hidden rounded-sm shadow-lg transition-all duration-300 ${
      isAccessible ? 'hover:shadow-xl hover:scale-99' : 'opacity-75'
    }`}>
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className={`h-full w-full object-cover ${!isAccessible ? 'blur-sm' : ''}`}
        />
        {!isAccessible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm font-medium">Upgrade to {event.tier} to access</p>
            </div>
          </div>
        )}
        {/* Tier Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${tierColors[event.tier]}`}>
            {event.tier.charAt(0).toUpperCase() + event.tier.slice(1)}
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className={`p-6 bg-gradient-to-br ${tierGradients[event.tier]}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>
        
        {/* Date and Time */}
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  )
}
