import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../../database/client';
import type { UserLike, Prisma } from '@prisma/client';

@Injectable()
export class UserLikesRepo {
  // ========== CREATE ==========
  async createUserLike (
    data: Prisma.UserLikeCreateInput
  ): Promise<UserLike> {
    return prisma.userLike.create({ data });
  }

  // ========== READ ==========
  async getUserLikeById (
    id: string
  ): Promise<UserLike | null> {
    return prisma.userLike.findUnique({ where: { id } });
  }

  async getUserLikesByUserId (
    userId: string
  ): Promise<UserLike[]> {
    return prisma.userLike.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
  }

  async getUserLikesByType (
    userId: string,
    likeableType: string
  ): Promise<UserLike[]> {
    return prisma.userLike.findMany({
      where: { 
        user_id: userId,
        likeable_type: likeableType
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getUserLikeByUserAndItem (
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<UserLike | null> {
    return prisma.userLike.findUnique({
      where: {
        user_id_likeable_type_likeable_id: {
          user_id: userId,
          likeable_type: likeableType,
          likeable_id: likeableId
        }
      }
    });
  }

  // ========== UPDATE ==========
  async updateUserLike (
    id: string, 
    data: Prisma.UserLikeUpdateInput
  ): Promise<UserLike> {
    return prisma.userLike.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteUserLike (
    id: string
  ): Promise<UserLike> {
    return prisma.userLike.delete({ where: { id } });
  };

  async deleteUserLikeByUserAndItem (
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<UserLike> {
    return prisma.userLike.delete({
      where: {
        user_id_likeable_type_likeable_id: {
          user_id: userId,
          likeable_type: likeableType,
          likeable_id: likeableId
        }
      }
    });
  };

  // ========== UTILITY ==========
  async userLikeExists (
    id: string
  ): Promise<boolean> {
    const userLike = await prisma.userLike.findUnique({ where: { id } });
    return userLike !== null;
  };

  async userLikeExistsByUserAndItem (
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<boolean> {
    const userLike = await this.getUserLikeByUserAndItem(userId, likeableType, likeableId);
    return userLike !== null;
  };

  async countUserLikes (): Promise<number> {
    return prisma.userLike.count();
  };
}