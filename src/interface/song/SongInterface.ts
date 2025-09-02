export interface CreateSongInput {
  title: string;
  album_id: string;
  duration_seconds: number;
  song_number?: number;
  disc_number?: number;
  genres?: string[];
  audio_url?: string;
  lyrics?: string;
  explicit?: boolean;
}

export interface UpdateSongInput {
  title?: string;
  duration_seconds?: number;
  song_number?: number;
  disc_number?: number;
  genres?: string[];
  audio_url?: string;
  lyrics?: string;
  explicit?: boolean;
}