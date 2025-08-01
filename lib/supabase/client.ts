'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/supabase/database.types'
import { useSession } from '@clerk/nextjs'

export const createClient = (clerkToken?: string | null) => {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: clerkToken
          ? {
              Authorization: `Bearer ${clerkToken}`,
            }
          : {},
      },
    }
  )

  return client
}

// Hook to create Supabase client with Clerk JWT
export const useSupabaseClient = () => {
  const { session } = useSession()
  
  const getToken = async () => {
    if (!session) return null
    
    try {
      const token = await session.getToken({
        template: process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME || 'supabase'
      })
      return token
    } catch (error) {
      console.error('Error getting Clerk JWT:', error)
      return null
    }
  }

  const createAuthenticatedClient = async () => {
    const token = await getToken()
    return createClient(token)
  }

  return { createAuthenticatedClient, createClient }
}
