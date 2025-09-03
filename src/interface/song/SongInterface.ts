export interface CreateSongInput {
  title: string;
  duration_seconds: number;
  song_number?: number;
  disc_number?: number;
  album_id?: string;
  audio_url?: string;
  preview_url?: string;
  lyrics?: string;
  explicit?: boolean;
  isrc?: string;
  genres?: string[];
  release_date?: Date;
}

export interface UpdateSongInput {
  title?: string;
  duration_seconds?: number;
  song_number?: number;
  disc_number?: number;
  album_id?: string;
  audio_url?: string;
  preview_url?: string;
  lyrics?: string;
  explicit?: boolean;
  isrc?: string;
  play_count?: bigint;
  like_count?: number;
  genres?: string[];
  release_date?: Date;
}