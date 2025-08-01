import type { Database } from '@/database/types';

export type Song = Database['public']['Tables']['song']['Row'];
export type SongInsert = Database['public']['Tables']['song']['Insert'];
export type SongUpdate = Database['public']['Tables']['song']['Update'];