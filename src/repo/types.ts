import { Prisma } from '@prisma/client';

// Base types for repository operations
export interface PaginationOptions {
  page?: number;
  limit?: number;
  skip?: number;
  take?: number;
}

export interface SortOptions {
  orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface FilterOptions {
  where?: Record<string, any>;
}

export interface RepositoryOptions extends PaginationOptions, SortOptions, FilterOptions {
  include?: Record<string, any>;
  select?: Record<string, any>;
}

// Paginated result type
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Base repository interface
export interface BaseRepository<T, CreateInput, UpdateInput, WhereUniqueInput> {
  // Create operations
  create(data: CreateInput): Promise<T>;
  createMany(data: CreateInput[]): Promise<Prisma.BatchPayload>;

  // Read operations
  findUnique(where: WhereUniqueInput, options?: RepositoryOptions): Promise<T | null>;
  findFirst(options?: RepositoryOptions): Promise<T | null>;
  findMany(options?: RepositoryOptions): Promise<T[]>;
  findManyPaginated(options?: RepositoryOptions): Promise<PaginatedResult<T>>;
  count(options?: FilterOptions): Promise<number>;

  // Update operations
  update(where: WhereUniqueInput, data: UpdateInput): Promise<T>;
  updateMany(where: FilterOptions['where'], data: UpdateInput): Promise<Prisma.BatchPayload>;

  // Delete operations
  delete(where: WhereUniqueInput): Promise<T>;
  deleteMany(where?: FilterOptions['where']): Promise<Prisma.BatchPayload>;

  // Utility operations
  exists(where: WhereUniqueInput): Promise<boolean>;
}

// Repository error types
export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class NotFoundError extends RepositoryError {
  constructor(resource: string, identifier: string | object) {
    super(
      `${resource} not found: ${typeof identifier === 'string' ? identifier : JSON.stringify(identifier)}`,
      'NOT_FOUND'
    );
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends RepositoryError {
  constructor(resource: string, field: string, value: string) {
    super(
      `${resource} with ${field} '${value}' already exists`,
      'DUPLICATE_ENTRY'
    );
    this.name = 'DuplicateError';
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// Prisma model types for type safety
export type UserModel = Prisma.UserGetPayload<{}>;
export type ArtistModel = Prisma.ArtistGetPayload<{}>;
export type AlbumModel = Prisma.AlbumGetPayload<{}>;
export type SongModel = Prisma.SongGetPayload<{}>;
export type PlaylistModel = Prisma.PlaylistGetPayload<{}>;
export type ListeningHistoryModel = Prisma.ListeningHistoryGetPayload<{}>;
export type UserLikeModel = Prisma.UserLikeGetPayload<{}>;
export type UserFollowModel = Prisma.UserFollowGetPayload<{}>;
export type UserLibraryModel = Prisma.UserLibraryGetPayload<{}>;
export type PlaylistSongModel = Prisma.PlaylistSongGetPayload<{}>;
export type AlbumArtistModel = Prisma.AlbumArtistGetPayload<{}>;
export type SongArtistModel = Prisma.SongArtistGetPayload<{}>;
export type GenreModel = Prisma.GenreGetPayload<{}>;
export type UserPreferencesModel = Prisma.UserPreferencesGetPayload<{}>;
export type OfflineDownloadModel = Prisma.OfflineDownloadGetPayload<{}>;
export type SearchQueryModel = Prisma.SearchQueryGetPayload<{}>;

// Common query options for different models
export interface UserWithRelations extends Prisma.UserGetPayload<{
  include: {
    playlists: true;
    user_preferences: true;
    user_library: true;
  };
}> {}

export interface ArtistWithRelations extends Prisma.ArtistGetPayload<{
  include: {
    album_artists: {
      include: {
        album: true;
      };
    };
    song_artists: {
      include: {
        song: true;
      };
    };
  };
}> {}

export interface AlbumWithRelations extends Prisma.AlbumGetPayload<{
  include: {
    songs: true;
    album_artists: {
      include: {
        artist: true;
      };
    };
  };
}> {}

export interface SongWithRelations extends Prisma.SongGetPayload<{
  include: {
    album: true;
    song_artists: {
      include: {
        artist: true;
      };
    };
  };
}> {}

export interface PlaylistWithRelations extends Prisma.PlaylistGetPayload<{
  include: {
    user: true;
    playlist_songs: {
      include: {
        song: {
          include: {
            song_artists: {
              include: {
                artist: true;
              };
            };
          };
        };
      };
    };
  };
}> {}