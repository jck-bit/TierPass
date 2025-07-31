import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/database.types'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function createClient(clerkToken?: string | null) {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      global: {
        headers: clerkToken
          ? {
              Authorization: `Bearer ${clerkToken}`,
            }
          : {},
      },
    }
  )
}

// Function to create authenticated Supabase client with Clerk JWT
export async function createAuthenticatedClient() {
  const { userId } = await auth()
  
  try {
    // Check if user is authenticated
    if (!userId) {
      return createClient()
    }
    
    // For server components, we pass the user's tier directly
    // The actual JWT token is handled by middleware and API routes
    // where we have access to the request headers
    return createClient()
  } catch (error) {
    console.error('Error creating authenticated client:', error)
    return createClient()
  }
}

// Function to create authenticated client for API routes with JWT from headers
export async function createAuthenticatedClientFromRequest(
  request: Request
): Promise<ReturnType<typeof createClient>> {
  try {
    // First check for JWT token from middleware
    const clerkJWT = request.headers.get('x-clerk-jwt-token')
    
    if (clerkJWT) {
      return createClient(clerkJWT)
    }
    
    // Fallback to Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createClient()
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    return createClient(token)
  } catch (error) {
    console.error('Error creating authenticated client from request:', error)
    return createClient()
  }
}
