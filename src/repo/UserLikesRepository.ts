import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  UserLikeModel,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class UserLikesRepository extends AbstractBaseRepository<
  UserLikeModel,
  Prisma.UserLikeCreateInput,
  Prisma.UserLikeUpdateInput,
  Prisma.UserLikeWhereUniqueInput
> {
  constructor() {
    super('userLike');
  }

  // Create operations
  async createUserLike(data: Prisma.UserLikeCreateInput): Promise<UserLikeModel> {
    return this.create(data);
  }

  async createManyUserLikes(data: Prisma.UserLikeCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readUserLike(id: string, options?: RepositoryOptions): Promise<UserLikeModel | null> {
    return this.findUnique({ id }, options);
  }

  async readUserLikes(options?: RepositoryOptions): Promise<UserLikeModel[]> {
    return this.findMany(options);
  }

  async readUserLikesPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readUserLikesByUser(
    userId: string,
    options?: RepositoryOptions
  ): Promise<UserLikeModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async readUserLikesByType(
    userId: string,
    likeableType: string,
    options?: RepositoryOptions
  ): Promise<UserLikeModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
        likeable_type: likeableType,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async readLikedTracks(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          likeable_type: 'track',
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Get track details
      const trackIds = result.map(like => like.likeable_id);
      const tracks = await this.prisma.track.findMany({
        where: {
          id: { in: trackIds },
        },
        include: {
          track_artists: {
            include: {
              artist: true,
            },
          },
          album: true,
        },
      });

      // Combine with like data
      return result.map(like => ({
        like,
        track: tracks.find(track => track.id === like.likeable_id),
      }));
    } catch (error) {
      logger.error('Error fetching liked tracks', { userId, error });
      throw error;
    }
  }

  async readLikedAlbums(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          likeable_type: 'album',
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Get album details
      const albumIds = result.map(like => like.likeable_id);
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
          tracks: true,
        },
      });

      // Combine with like data
      return result.map(like => ({
        like,
        album: albums.find(album => album.id === like.likeable_id),
      }));
    } catch (error) {
      logger.error('Error fetching liked albums', { userId, error });
      throw error;
    }
  }

  async readLikedArtists(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          likeable_type: 'artist',
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Get artist details
      const artistIds = result.map(like => like.likeable_id);
      const artists = await this.prisma.artist.findMany({
        where: {
          id: { in: artistIds },
        },
      });

      // Combine with like data
      return result.map(like => ({
        like,
        artist: artists.find(artist => artist.id === like.likeable_id),
      }));
    } catch (error) {
      logger.error('Error fetching liked artists', { userId, error });
      throw error;
    }
  }

  async readLikedPlaylists(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          user_id: userId,
          likeable_type: 'playlist',
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Get playlist details
      const playlistIds = result.map(like => like.likeable_id);
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

      // Combine with like data
      return result.map(like => ({
        like,
        playlist: playlists.find(playlist => playlist.id === like.likeable_id),
      }));
    } catch (error) {
      logger.error('Error fetching liked playlists', { userId, error });
      throw error;
    }
  }

  // Update operations
  async updateUserLike(id: string, data: Prisma.UserLikeUpdateInput): Promise<UserLikeModel> {
    return this.update({ id }, data);
  }

  async updateManyUserLikes(
    where: Prisma.UserLikeWhereInput,
    data: Prisma.UserLikeUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteUserLike(id: string): Promise<UserLikeModel> {
    return this.delete({ id });
  }

  async deleteManyUserLikes(where?: Prisma.UserLikeWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteUserLikesByUser(userId: string): Promise<Prisma.BatchPayload> {
    return this.deleteMany({
      user_id: userId,
    });
  }

  // Utility operations
  async userLikeExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countUserLikes(options?: { where?: Prisma.UserLikeWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countUserLikesByUser(userId: string): Promise<number> {
    return this.count({
      where: {
        user_id: userId,
      },
    });
  }

  async countUserLikesByType(userId: string, likeableType: string): Promise<number> {
    return this.count({
      where: {
        user_id: userId,
        likeable_type: likeableType,
      },
    });
  }

  async countLikesForItem(likeableType: string, likeableId: string): Promise<number> {
    return this.count({
      where: {
        likeable_type: likeableType,
        likeable_id: likeableId,
      },
    });
  }

  // Complex business logic operations
  async likeItem(
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<UserLikeModel> {
    try {
      // Validate likeable type
      if (!['track', 'album', 'playlist', 'artist'].includes(likeableType)) {
        throw new ValidationError('Invalid likeable type', 'likeable_type');
      }

      // Check if already liked
      const existingLike = await this.findFirst({
        where: {
          user_id: userId,
          likeable_type: likeableType,
          likeable_id: likeableId,
        },
      });

      if (existingLike) {
        throw new ValidationError('Item already liked', 'likeable_id');
      }

      // Create like
      const like = await this.create({
        user: { connect: { id: userId } },
        likeable_type: likeableType,
        likeable_id: likeableId,
      });

      // Update like count on the target item if it's a track
      if (likeableType === 'track') {
        await this.prisma.track.update({
          where: { id: likeableId },
          data: {
            like_count: { increment: 1 },
          },
        });
      }

      return like;
    } catch (error) {
      logger.error('Error liking item', { userId, likeableType, likeableId, error });
      throw error;
    }
  }

  async unlikeItem(
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<void> {
    try {
      // Find the like
      const like = await this.findFirst({
        where: {
          user_id: userId,
          likeable_type: likeableType,
          likeable_id: likeableId,
        },
      });

      if (!like) {
        throw new NotFoundError('Like', `${userId}:${likeableType}:${likeableId}`);
      }

      // Delete like
      await this.delete({ id: like.id });

      // Update like count on the target item if it's a track
      if (likeableType === 'track') {
        await this.prisma.track.update({
          where: { id: likeableId },
          data: {
            like_count: { decrement: 1 },
          },
        });
      }
    } catch (error) {
      logger.error('Error unliking item', { userId, likeableType, likeableId, error });
      throw error;
    }
  }

  async toggleLike(
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<{ liked: boolean; like?: UserLikeModel }> {
    try {
      const existingLike = await this.findFirst({
        where: {
          user_id: userId,
          likeable_type: likeableType,
          likeable_id: likeableId,
        },
      });

      if (existingLike) {
        await this.unlikeItem(userId, likeableType, likeableId);
        return { liked: false };
      } else {
        const like = await this.likeItem(userId, likeableType, likeableId);
        return { liked: true, like };
      }
    } catch (error) {
      logger.error('Error toggling like', { userId, likeableType, likeableId, error });
      throw error;
    }
  }

  async isLiked(
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<boolean> {
    try {
      const like = await this.findFirst({
        where: {
          user_id: userId,
          likeable_type: likeableType,
          likeable_id: likeableId,
        },
      });

      return like !== null;
    } catch (error) {
      logger.error('Error checking if item is liked', { userId, likeableType, likeableId, error });
      throw error;
    }
  }

  async getUserLikeStats(userId: string): Promise<{
    totalLikes: number;
    likedTracks: number;
    likedAlbums: number;
    likedArtists: number;
    likedPlaylists: number;
  }> {
    try {
      const [total, tracks, albums, artists, playlists] = await Promise.all([
        this.countUserLikesByUser(userId),
        this.countUserLikesByType(userId, 'track'),
        this.countUserLikesByType(userId, 'album'),
        this.countUserLikesByType(userId, 'artist'),
        this.countUserLikesByType(userId, 'playlist'),
      ]);

      return {
        totalLikes: total,
        likedTracks: tracks,
        likedAlbums: albums,
        likedArtists: artists,
        likedPlaylists: playlists,
      };
    } catch (error) {
      logger.error('Error getting user like stats', { userId, error });
      throw error;
    }
  }

  async getPopularItems(
    likeableType: string,
    limit: number = 20,
    daysSince?: number
  ): Promise<any[]> {
    try {
      const whereClause: any = {
        likeable_type: likeableType,
      };

      if (daysSince) {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - daysSince);
        whereClause.created_at = { gte: sinceDate };
      }

      const result = await this.prisma.userLike.groupBy({
        by: ['likeable_id'],
        where: whereClause,
        _count: {
          likeable_id: true,
        },
        orderBy: {
          _count: {
            likeable_id: 'desc',
          },
        },
        take: limit,
      });

      return result.map(r => ({
        itemId: r.likeable_id,
        likeCount: r._count.likeable_id,
      }));
    } catch (error) {
      logger.error('Error getting popular items', { likeableType, error });
      throw error;
    }
  }
}

export const userLikesRepository = new UserLikesRepository();