// Define the Database type based on Supabase's generated types
export type Database = {
  public: {
    Tables: {
      song: {
        Row: {
          id: string;
          title: string;
          artist: string;
          duration: number;
          url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist: string;
          duration: number;
          url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          artist?: string;
          duration?: number;
          url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};