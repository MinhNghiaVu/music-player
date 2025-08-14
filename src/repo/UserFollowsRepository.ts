import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  UserFollowModel,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class UserFollowsRepository extends AbstractBaseRepository<
  UserFollowModel,
  Prisma.UserFollowCreateInput,
  Prisma.UserFollowUpdateInput,
  Prisma.UserFollowWhereUniqueInput
> {
  constructor() {
    super('userFollow');
  }

  // Create operations
  async createUserFollow(data: Prisma.UserFollowCreateInput): Promise<UserFollowModel> {
    return this.create(data);
  }

  async createManyUserFollows(data: Prisma.UserFollowCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readUserFollow(id: string, options?: RepositoryOptions): Promise<UserFollowModel | null> {
    return this.findUnique({ id }, options);
  }

  async readUserFollows(options?: RepositoryOptions): Promise<UserFollowModel[]> {
    return this.findMany(options);
  }

  async readUserFollowsPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readUserFollowsByFollower(
    followerId: string,
    options?: RepositoryOptions
  ): Promise<UserFollowModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        follower_id: followerId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async readUserFollowsByType(
    followerId: string,
    followableType: string,
    options?: RepositoryOptions
  ): Promise<UserFollowModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        follower_id: followerId,
        followable_type: followableType,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async readFollowedArtists(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          follower_id: userId,
          followable_type: 'artist',
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Get artist details
      const artistIds = result.map(follow => follow.followable_id);
      const artists = await this.prisma.artist.findMany({
        where: {
          id: { in: artistIds },
        },
      });

      // Combine with follow data
      return result.map(follow => ({
        follow,
        artist: artists.find(artist => artist.id === follow.followable_id),
      }));
    } catch (error) {
      logger.error('Error fetching followed artists', { userId, error });
      throw error;
    }
  }

  async readFollowedUsers(
    userId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          follower_id: userId,
          followable_type: 'user',
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Get user details
      const userIds = result.map(follow => follow.followable_id);
      const users = await this.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          id: true,
          username: true,
          display_name: true,
          profile_image_url: true,
        },
      });

      // Combine with follow data
      return result.map(follow => ({
        follow,
        user: users.find(user => user.id === follow.followable_id),
      }));
    } catch (error) {
      logger.error('Error fetching followed users', { userId, error });
      throw error;
    }
  }

  async readFollowers(
    followableType: string,
    followableId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.findMany({
        ...options,
        where: {
          ...options?.where,
          followable_type: followableType,
          followable_id: followableId,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      // Get follower details
      const followerIds = result.map(follow => follow.follower_id);
      const followers = await this.prisma.user.findMany({
        where: {
          id: { in: followerIds },
        },
        select: {
          id: true,
          username: true,
          display_name: true,
          profile_image_url: true,
        },
      });

      // Combine with follow data
      return result.map(follow => ({
        follow,
        follower: followers.find(user => user.id === follow.follower_id),
      }));
    } catch (error) {
      logger.error('Error fetching followers', { followableType, followableId, error });
      throw error;
    }
  }

  // Update operations
  async updateUserFollow(id: string, data: Prisma.UserFollowUpdateInput): Promise<UserFollowModel> {
    return this.update({ id }, data);
  }

  async updateManyUserFollows(
    where: Prisma.UserFollowWhereInput,
    data: Prisma.UserFollowUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteUserFollow(id: string): Promise<UserFollowModel> {
    return this.delete({ id });
  }

  async deleteManyUserFollows(where?: Prisma.UserFollowWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteUserFollowsByFollower(followerId: string): Promise<Prisma.BatchPayload> {
    return this.deleteMany({
      follower_id: followerId,
    });
  }

  // Utility operations
  async userFollowExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countUserFollows(options?: { where?: Prisma.UserFollowWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countUserFollowsByFollower(followerId: string): Promise<number> {
    return this.count({
      where: {
        follower_id: followerId,
      },
    });
  }

  async countUserFollowsByType(followerId: string, followableType: string): Promise<number> {
    return this.count({
      where: {
        follower_id: followerId,
        followable_type: followableType,
      },
    });
  }

  async countFollowersForItem(followableType: string, followableId: string): Promise<number> {
    return this.count({
      where: {
        followable_type: followableType,
        followable_id: followableId,
      },
    });
  }

  // Complex business logic operations
  async followItem(
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<UserFollowModel> {
    try {
      // Validate followable type
      if (!['user', 'artist'].includes(followableType)) {
        throw new ValidationError('Invalid followable type', 'followable_type');
      }

      // Prevent self-following for users
      if (followableType === 'user' && followerId === followableId) {
        throw new ValidationError('Cannot follow yourself', 'followable_id');
      }

      // Check if already following
      const existingFollow = await this.findFirst({
        where: {
          follower_id: followerId,
          followable_type: followableType,
          followable_id: followableId,
        },
      });

      if (existingFollow) {
        throw new ValidationError('Already following this item', 'followable_id');
      }

      // Create follow
      const follow = await this.create({
        follower: { connect: { id: followerId } },
        followable_type: followableType,
        followable_id: followableId,
        ...(followableType === 'artist' && {
          artist: { connect: { id: followableId } },
        }),
      });

      return follow;
    } catch (error) {
      logger.error('Error following item', { followerId, followableType, followableId, error });
      throw error;
    }
  }

  async unfollowItem(
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<void> {
    try {
      // Find the follow
      const follow = await this.findFirst({
        where: {
          follower_id: followerId,
          followable_type: followableType,
          followable_id: followableId,
        },
      });

      if (!follow) {
        throw new NotFoundError('Follow', `${followerId}:${followableType}:${followableId}`);
      }

      // Delete follow
      await this.delete({ id: follow.id });
    } catch (error) {
      logger.error('Error unfollowing item', { followerId, followableType, followableId, error });
      throw error;
    }
  }

  async toggleFollow(
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<{ following: boolean; follow?: UserFollowModel }> {
    try {
      const existingFollow = await this.findFirst({
        where: {
          follower_id: followerId,
          followable_type: followableType,
          followable_id: followableId,
        },
      });

      if (existingFollow) {
        await this.unfollowItem(followerId, followableType, followableId);
        return { following: false };
      } else {
        const follow = await this.followItem(followerId, followableType, followableId);
        return { following: true, follow };
      }
    } catch (error) {
      logger.error('Error toggling follow', { followerId, followableType, followableId, error });
      throw error;
    }
  }

  async isFollowing(
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<boolean> {
    try {
      const follow = await this.findFirst({
        where: {
          follower_id: followerId,
          followable_type: followableType,
          followable_id: followableId,
        },
      });

      return follow !== null;
    } catch (error) {
      logger.error('Error checking if following', { followerId, followableType, followableId, error });
      throw error;
    }
  }

  async getUserFollowStats(userId: string): Promise<{
    totalFollowing: number;
    followingArtists: number;
    followingUsers: number;
    totalFollowers: number;
  }> {
    try {
      const [totalFollowing, followingArtists, followingUsers, totalFollowers] = await Promise.all([
        this.countUserFollowsByFollower(userId),
        this.countUserFollowsByType(userId, 'artist'),
        this.countUserFollowsByType(userId, 'user'),
        this.countFollowersForItem('user', userId),
      ]);

      return {
        totalFollowing,
        followingArtists,
        followingUsers,
        totalFollowers,
      };
    } catch (error) {
      logger.error('Error getting user follow stats', { userId, error });
      throw error;
    }
  }

  async getMutualFollows(
    userId1: string,
    userId2: string
  ): Promise<{
    mutualArtists: any[];
    mutualUsers: any[];
  }> {
    try {
      // Get artists followed by both users
      const user1Artists = await this.findMany({
        where: {
          follower_id: userId1,
          followable_type: 'artist',
        },
        select: { followable_id: true },
      });

      const user2Artists = await this.findMany({
        where: {
          follower_id: userId2,
          followable_type: 'artist',
        },
        select: { followable_id: true },
      });

      const mutualArtistIds = user1Artists
        .map(f => f.followable_id)
        .filter(id => user2Artists.some(f => f.followable_id === id));

      // Get users followed by both users
      const user1Users = await this.findMany({
        where: {
          follower_id: userId1,
          followable_type: 'user',
        },
        select: { followable_id: true },
      });

      const user2Users = await this.findMany({
        where: {
          follower_id: userId2,
          followable_type: 'user',
        },
        select: { followable_id: true },
      });

      const mutualUserIds = user1Users
        .map(f => f.followable_id)
        .filter(id => user2Users.some(f => f.followable_id === id));

      // Get details
      const [mutualArtists, mutualUsers] = await Promise.all([
        this.prisma.artist.findMany({
          where: { id: { in: mutualArtistIds } },
        }),
        this.prisma.user.findMany({
          where: { id: { in: mutualUserIds } },
          select: {
            id: true,
            username: true,
            display_name: true,
            profile_image_url: true,
          },
        }),
      ]);

      return {
        mutualArtists,
        mutualUsers,
      };
    } catch (error) {
      logger.error('Error getting mutual follows', { userId1, userId2, error });
      throw error;
    }
  }

  async getFollowActivity(
    userId: string,
    limit: number = 20
  ): Promise<UserFollowModel[]> {
    return this.findMany({
      where: {
        OR: [
          { follower_id: userId },
          { followable_type: 'user', followable_id: userId },
        ],
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    });
  }
}

export const userFollowsRepository = new UserFollowsRepository();