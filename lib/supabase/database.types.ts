export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string
          event_date: string
          image_url: string
          tier: 'free' | 'silver' | 'gold' | 'platinum'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          event_date: string
          image_url: string
          tier: 'free' | 'silver' | 'gold' | 'platinum'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          event_date?: string
          image_url?: string
          tier?: 'free' | 'silver' | 'gold' | 'platinum'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tier_type: 'free' | 'silver' | 'gold' | 'platinum'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
