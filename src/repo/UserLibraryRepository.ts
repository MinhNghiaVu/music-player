import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  UserLibraryModel,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class UserLibraryRepository extends AbstractBaseRepository<
  UserLibraryModel,
  Prisma.UserLibraryCreateInput,
  Prisma.UserLibraryUpdateInput,
  Prisma.UserLibraryWhereUniqueInput
> {
  constructor() {
    super('userLibrary');
  }

  // Create operations
  async createUserLibrary(data: Prisma.UserLibraryCreateInput): Promise<UserLibraryModel> {
    return this.create(data);
  }

  async createManyUserLibrary(data: Prisma.UserLibraryCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readUserLibrary(id: string, options?: RepositoryOptions): Promise<UserLibraryModel | null> {
    return this.findUnique({ id }, options);
  }

  async readUserLibraries(options?: RepositoryOptions): Promise<UserLibraryModel[]> {
    return this.findMany(options);
  }

  async readUserLibrariesPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readUserLibraryByUser(
    userId: string,
    options?: RepositoryOptions
  ): Promise<UserLibraryModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
      },
      orderBy: {
        added_at: 'desc',
      },
    });
  }

  async readUserLibraryByType(
    userId: string,
    itemType: string,
    options?: RepositoryOptions
  ): Promise<UserLibraryModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
        item_type: itemType,
      },
      orderBy: {
        added_at: 'desc',
      },
    });
  }

  async readSavedSongs(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          item_type: 'song',
        },
        orderBy: {
          added_at: 'desc',
        },
      });

      // Get song details
      const songIds = result.map(item => item.item_id);
      const songs = await this.prisma.song.findMany({
        where: {
          id: { in: songIds },
        },
        include: {
          song_artists: {
            include: {
              artist: true,
            },
          },
          album: true,
        },
      });

      // Combine with library data
      return result.map(item => ({
        library: item,
        song: songs.find(song => song.id === item.item_id),
      }));
    } catch (error) {
      logger.error('Error fetching saved songs', { userId, error });
      throw error;
    }
  }

  async readSavedAlbums(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          item_type: 'album',
        },
        orderBy: {
          added_at: 'desc',
        },
      });

      // Get album details
      const albumIds = result.map(item => item.item_id);
      const albums = await this.prisma.album.findMany({
        where: {
          id: { in: albumIds },
        },
        include: {
          album_artists: {
            include: {
              artist: true,
            },
          },
          songs: true,
        },
      });

      // Combine with library data
      return result.map(item => ({
        library: item,
        album: albums.find(album => album.id === item.item_id),
      }));
    } catch (error) {
      logger.error('Error fetching saved albums', { userId, error });
      throw error;
    }
  }

  async readSavedArtists(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          item_type: 'artist',
        },
        orderBy: {
          added_at: 'desc',
        },
      });

      // Get artist details
      const artistIds = result.map(item => item.item_id);
      const artists = await this.prisma.artist.findMany({
        where: {
          id: { in: artistIds },
        },
      });

      // Combine with library data
      return result.map(item => ({
        library: item,
        artist: artists.find(artist => artist.id === item.item_id),
      }));
    } catch (error) {
      logger.error('Error fetching saved artists', { userId, error });
      throw error;
    }
  }

  async readSavedPlaylists(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          item_type: 'playlist',
        },
        orderBy: {
          added_at: 'desc',
        },
      });

      // Get playlist details
      const playlistIds = result.map(item => item.item_id);
      const playlists = await this.prisma.playlist.findMany({
        where: {
          id: { in: playlistIds },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              display_name: true,
            },
          },
        },
      });

      // Combine with library data
      return result.map(item => ({
        library: item,
        playlist: playlists.find(playlist => playlist.id === item.item_id),
      }));
    } catch (error) {
      logger.error('Error fetching saved playlists', { userId, error });
      throw error;
    }
  }

  // Update operations
  async updateUserLibrary(id: string, data: Prisma.UserLibraryUpdateInput): Promise<UserLibraryModel> {
    return this.update({ id }, data);
  }

  async updateManyUserLibrary(
    where: Prisma.UserLibraryWhereInput,
    data: Prisma.UserLibraryUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteUserLibrary(id: string): Promise<UserLibraryModel> {
    return this.delete({ id });
  }

  async deleteManyUserLibrary(where?: Prisma.UserLibraryWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteUserLibraryByUser(userId: string): Promise<Prisma.BatchPayload> {
    return this.deleteMany({
      user_id: userId,
    });
  }

  // Utility operations
  async userLibraryExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countUserLibrary(options?: { where?: Prisma.UserLibraryWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countUserLibraryByUser(userId: string): Promise<number> {
    return this.count({
      where: {
        user_id: userId,
      },
    });
  }

  async countUserLibraryByType(userId: string, itemType: string): Promise<number> {
    return this.count({
      where: {
        user_id: userId,
        item_type: itemType,
      },
    });
  }

  // Complex business logic operations
  async saveItem(
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<UserLibraryModel> {
    try {
      // Validate item type
      if (!['song', 'album', 'playlist', 'artist'].includes(itemType)) {
        throw new ValidationError('Invalid item type', 'item_type');
      }

      // Check if already saved
      const existingItem = await this.findFirst({
        where: {
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
        },
      });

      if (existingItem) {
        throw new ValidationError('Item already saved', 'item_id');
      }

      // Create library entry
      const libraryItem = await this.create({
        user: { connect: { id: userId } },
        item_type: itemType,
        item_id: itemId,
        ...(itemType === 'song' && {
          song: { connect: { id: itemId } },
        }),
      } as any);

      return libraryItem;
    } catch (error) {
      logger.error('Error saving item', { userId, itemType, itemId, error });
      throw error;
    }
  }

  async unsaveItem(
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<void> {
    try {
      // Find the library item
      const libraryItem = await this.findFirst({
        where: {
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
        },
      });

      if (!libraryItem) {
        throw new NotFoundError('Library item', `${userId}:${itemType}:${itemId}`);
      }

      // Delete library item
      await this.delete({ id: libraryItem.id });
    } catch (error) {
      logger.error('Error unsaving item', { userId, itemType, itemId, error });
      throw error;
    }
  }

  async toggleSave(
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<{ saved: boolean; library?: UserLibraryModel }> {
    try {
      const existingItem = await this.findFirst({
        where: {
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
        },
      });

      if (existingItem) {
        await this.unsaveItem(userId, itemType, itemId);
        return { saved: false };
      } else {
        const library = await this.saveItem(userId, itemType, itemId);
        return { saved: true, library };
      }
    } catch (error) {
      logger.error('Error toggling save', { userId, itemType, itemId, error });
      throw error;
    }
  }

  async isSaved(
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<boolean> {
    try {
      const libraryItem = await this.findFirst({
        where: {
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
        },
      });

      return libraryItem !== null;
    } catch (error) {
      logger.error('Error checking if item is saved', { userId, itemType, itemId, error });
      throw error;
    }
  }

  async getUserLibraryStats(userId: string): Promise<{
    totalSaved: number;
    savedSongs: number;
    savedAlbums: number;
    savedArtists: number;
    savedPlaylists: number;
  }> {
    try {
      const [total, songs, albums, artists, playlists] = await Promise.all([
        this.countUserLibraryByUser(userId),
        this.countUserLibraryByType(userId, 'song'),
        this.countUserLibraryByType(userId, 'album'),
        this.countUserLibraryByType(userId, 'artist'),
        this.countUserLibraryByType(userId, 'playlist'),
      ]);

      return {
        totalSaved: total,
        savedSongs: songs,
        savedAlbums: albums,
        savedArtists: artists,
        savedPlaylists: playlists,
      };
    } catch (error) {
      logger.error('Error getting user library stats', { userId, error });
      throw error;
    }
  }

  async getRecentlySaved(
    userId: string,
    limit: number = 20
  ): Promise<UserLibraryModel[]> {
    return this.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        added_at: 'desc',
      },
      take: limit,
    });
  }

  async clearUserLibrary(userId: string): Promise<Prisma.BatchPayload> {
    return this.deleteMany({
      user_id: userId,
    });
  }

  async exportUserLibrary(userId: string): Promise<{
    songs: any[];
    albums: any[];
    artists: any[];
    playlists: any[];
  }> {
    try {
      const [songs, albums, artists, playlists] = await Promise.all([
        this.readSavedSongs(userId),
        this.readSavedAlbums(userId),
        this.readSavedArtists(userId),
        this.readSavedPlaylists(userId),
      ]);

      return {
        songs,
        albums,
        artists,
        playlists,
      };
    } catch (error) {
      logger.error('Error exporting user library', { userId, error });
      throw error;
    }
  }
}

export const userLibraryRepository = new UserLibraryRepository();