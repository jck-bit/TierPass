export default function EventCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-sm shadow-lg animate-pulse">
      {/* Event Image Skeleton */}
      <div className="h-48 bg-gray-200" />
      
      {/* Event Details Skeleton */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        
        {/* Date and Time */}
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    </div>
  )
}
