import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../../database/client';
import type { UserFollow, Prisma } from '@prisma/client';

@Injectable()
export class UserFollowsRepo {
  // ========== CREATE ==========
  async createUserFollow (
    data: Prisma.UserFollowCreateInput
  ): Promise<UserFollow> {
    return prisma.userFollow.create({ data });
  }

  // ========== READ ==========
  async getUserFollowById (
    id: string
  ): Promise<UserFollow | null> {
    return prisma.userFollow.findUnique({ 
      where: { id },
      include: {
        follower: true,
        artist: true
      }
    });
  }

  async getUserFollowsByFollowerId (
    followerId: string
  ): Promise<UserFollow[]> {
    return prisma.userFollow.findMany({
      where: { follower_id: followerId },
      include: {
        artist: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getUserFollowsByFollowableId (
    followableType: string,
    followableId: string
  ): Promise<UserFollow[]> {
    return prisma.userFollow.findMany({
      where: { 
        followable_type: followableType,
        followable_id: followableId
      },
      include: {
        follower: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getUserFollowByFollowerAndFollowable (
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<UserFollow | null> {
    return prisma.userFollow.findUnique({
      where: {
        follower_id_followable_type_followable_id: {
          follower_id: followerId,
          followable_type: followableType,
          followable_id: followableId
        }
      }
    });
  }

  // ========== UPDATE ==========
  async updateUserFollow (
    id: string, 
    data: Prisma.UserFollowUpdateInput
  ): Promise<UserFollow> {
    return prisma.userFollow.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteUserFollow (
    id: string
  ): Promise<UserFollow> {
    return prisma.userFollow.delete({ where: { id } });
  };

  async deleteUserFollowByFollowerAndFollowable (
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<UserFollow> {
    return prisma.userFollow.delete({
      where: {
        follower_id_followable_type_followable_id: {
          follower_id: followerId,
          followable_type: followableType,
          followable_id: followableId
        }
      }
    });
  };

  // ========== UTILITY ==========
  async userFollowExists (
    id: string
  ): Promise<boolean> {
    const userFollow = await prisma.userFollow.findUnique({ where: { id } });
    return userFollow !== null;
  };

  async userFollowExistsByFollowerAndFollowable (
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<boolean> {
    const userFollow = await this.getUserFollowByFollowerAndFollowable(followerId, followableType, followableId);
    return userFollow !== null;
  };

  async countUserFollows (): Promise<number> {
    return prisma.userFollow.count();
  };
}