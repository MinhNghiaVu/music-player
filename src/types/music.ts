export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  genre: string[];
  audioUrl: string;
  coverUrl?: string;
  uploadedAt: Date;
  playCount: number;
  liked?: boolean;
  disliked?: boolean;
  likes?: number;
  dislikes?: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  coverUrl?: string;
  createdAt: Date;
  isPublic: boolean;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}
