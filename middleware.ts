import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/events(.*)',
  '/api/events(.*)',
  '/api/update-tier(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Protect routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const { getToken } = await auth()
    
    if (getToken) {
      try {
        // Get the JWT token with custom claims
        const token = await getToken({
          template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME || 'supabase'
        })
        
        if (token) {
          
          const requestHeaders = new Headers(req.headers)
          requestHeaders.set('x-clerk-jwt-token', token)
          
          return NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
        }
      } catch (error) {
        console.error('Error getting JWT token in middleware:', error)
      }
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
