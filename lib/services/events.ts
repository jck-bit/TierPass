import { createAuthenticatedClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'

export type Event = Database['public']['Tables']['events']['Row']
export type TierType = Database['public']['Enums']['tier_type']

const tierHierarchy: Record<TierType, number> = {
  'free': 0,
  'silver': 1,
  'gold': 2,
  'platinum': 3
}

export async function getEventsForUserTier(userTier: TierType | null): Promise<Event[]> {
  const supabase = await createAuthenticatedClient()
  
  const effectiveTier = userTier || 'free'
  const userTierLevel = tierHierarchy[effectiveTier]
  
  const accessibleTiers = Object.entries(tierHierarchy)
    .filter(([_, level]) => level <= userTierLevel)
    .map(([tier]) => tier)
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .in('tier', accessibleTiers as TierType[])
    .order('event_date', { ascending: true })
  
  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  
  return data || []
}

export async function getAllEvents(): Promise<Event[]> {
  const supabase = await createAuthenticatedClient()
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('tier', { ascending: true })
    .order('event_date', { ascending: true })
  
  if (error) {
    console.error('Error fetching all events:', error)
    return []
  }
  
  return data || []
}
