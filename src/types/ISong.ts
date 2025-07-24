export interface ISong {
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