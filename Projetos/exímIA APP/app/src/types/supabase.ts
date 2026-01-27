/**
 * Supabase client and database types
 */

export type SupabaseClient = ReturnType<typeof import('@supabase/supabase-js').createClient>;

export interface Database {
  public: {
    Tables: {
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['goals']['Row']>;
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['habits']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['habits']['Row']>;
      };
      inbox_items: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inbox_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['inbox_items']['Row']>;
      };
    };
  };
}
