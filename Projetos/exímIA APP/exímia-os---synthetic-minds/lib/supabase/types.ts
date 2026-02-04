// TypeScript types for Supabase database
// Generated types will be added here after running migrations

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'moderator'
          preferences: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          preferences?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {}
  }
  academy: {
    Tables: {}
    Views: {}
    Functions: {}
    Enums: {}
  }
  biblioteca: {
    Tables: {}
    Views: {}
    Functions: {}
    Enums: {}
  }
}
