export interface ISong {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export type SongInsert = Omit<ISong, 'id' | 'created_at' | 'updated_at'>;
export type SongUpdate = Partial<SongInsert>;