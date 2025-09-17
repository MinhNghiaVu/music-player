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

  async getAllUserLikes (): Promise<UserLike[]> {
    return prisma.userLike.findMany({
      orderBy: { created_at: 'desc' }
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

  // ========== UTILITY ==========
  async userLikeExists (
    id: string
  ): Promise<boolean> {
    const userLike = await prisma.userLike.findUnique({ where: { id } });
    return userLike !== null;
  };
}