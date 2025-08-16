// Repository exports for easy importing
export * from './types';
export * from './BaseRepository';

// Core repositories
export * from './UserRepository';
export * from './ArtistRepository';
export * from './AlbumRepository';
export * from './SongRepository';
export * from './PlaylistRepository';

// Relationship repositories
export * from './ListeningHistoryRepository';
export * from './UserLikesRepository';
export * from './UserFollowsRepository';
export * from './UserLibraryRepository';

// Repository instances for direct use
import { userRepository } from './UserRepository';
import { artistRepository } from './ArtistRepository';
import { albumRepository } from './AlbumRepository';
import { songRepository } from './SongRepository';
import { playlistRepository } from './PlaylistRepository';
import { listeningHistoryRepository } from './ListeningHistoryRepository';
import { userLikesRepository } from './UserLikesRepository';
import { userFollowsRepository } from './UserFollowsRepository';
import { userLibraryRepository } from './UserLibraryRepository';

export {
  userRepository,
  artistRepository,
  albumRepository,
  songRepository,
  playlistRepository,
  listeningHistoryRepository,
  userLikesRepository,
  userFollowsRepository,
  userLibraryRepository
};

// Repository collection for dependency injection or centralized access
export const repositories = {
  user: userRepository,
  artist: artistRepository,
  album: albumRepository,
  song: songRepository,
  playlist: playlistRepository,
  listeningHistory: listeningHistoryRepository,
  userLikes: userLikesRepository,
  userFollows: userFollowsRepository,
  userLibrary: userLibraryRepository,
} as const;

// Type for the repositories collection
export type Repositories = typeof repositories;

// Helper type to get repository type by name
export type RepositoryKey = keyof Repositories;
export type RepositoryType<K extends RepositoryKey> = Repositories[K];