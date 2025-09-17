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
    return prisma.userFollow.findUnique({ where: { id } });
  }

  async getAllUserFollows (): Promise<UserFollow[]> {
    return prisma.userFollow.findMany({
      orderBy: { created_at: 'desc' }
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

  // ========== UTILITY ==========
  async userFollowExists (
    id: string
  ): Promise<boolean> {
    const userFollow = await prisma.userFollow.findUnique({ where: { id } });
    return userFollow !== null;
  };
}