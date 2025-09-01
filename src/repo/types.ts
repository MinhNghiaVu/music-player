import type { 
  Album, 
  Song, 
  Artist, 
  Playlist, 
  PlaylistSong,
  User,
  UserPreferences,
  UserLike,
  UserFollow,
  UserLibrary,
  ListeningHistory,
  AlbumArtist,
  SongArtist,
  Genre,
  SearchQuery,
  OfflineDownload
} from '@prisma/client';

// Re-export all Prisma types
export type { 
  Album, 
  Song, 
  Artist, 
  Playlist,
  PlaylistSong,
  User,
  UserPreferences,
  UserLike,
  UserFollow,
  UserLibrary,
  ListeningHistory,
  AlbumArtist,
  SongArtist,
  Genre,
  SearchQuery,
  OfflineDownload
};

// Common response type for your app
export interface AppResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Search result types
export interface SearchResults {
  albums: Album[];
  songs: Song[];
  artists: Artist[];
  playlists: Playlist[];
}