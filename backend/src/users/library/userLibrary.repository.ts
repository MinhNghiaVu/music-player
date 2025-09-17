import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../../database/client';
import type { UserLibrary, Prisma } from '@prisma/client';

@Injectable()
export class UserLibraryRepo {
  // ========== CREATE ==========
  async createUserLibrary (
    data: Prisma.UserLibraryCreateInput
  ): Promise<UserLibrary> {
    return prisma.userLibrary.create({ data });
  }

  // ========== READ ==========
  async getUserLibraryById (
    id: string
  ): Promise<UserLibrary | null> {
    return prisma.userLibrary.findUnique({ where: { id } });
  }

  async getUserLibraryByUserId (
    userId: string
  ): Promise<UserLibrary[]> {
    return prisma.userLibrary.findMany({
      where: { user_id: userId },
      orderBy: { added_at: 'desc' }
    });
  }

  async getUserLibraryByType (
    userId: string,
    itemType: string
  ): Promise<UserLibrary[]> {
    return prisma.userLibrary.findMany({
      where: { 
        user_id: userId,
        item_type: itemType
      },
      orderBy: { added_at: 'desc' }
    });
  }

  async getUserLibraryByUserAndItem (
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<UserLibrary | null> {
    return prisma.userLibrary.findUnique({
      where: {
        user_id_item_type_item_id: {
          user_id: userId,
          item_type: itemType,
          item_id: itemId
        }
      }
    });
  }

  // ========== UPDATE ==========
  async updateUserLibrary (
    id: string, 
    data: Prisma.UserLibraryUpdateInput
  ): Promise<UserLibrary> {
    return prisma.userLibrary.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteUserLibrary (
    id: string
  ): Promise<UserLibrary> {
    return prisma.userLibrary.delete({ where: { id } });
  };

  async deleteUserLibraryByUserAndItem (
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<UserLibrary> {
    return prisma.userLibrary.delete({
      where: {
        user_id_item_type_item_id: {
          user_id: userId,
          item_type: itemType,
          item_id: itemId
        }
      }
    });
  };

  // ========== UTILITY ==========
  async userLibraryExists (
    id: string
  ): Promise<boolean> {
    const userLibrary = await prisma.userLibrary.findUnique({ where: { id } });
    return userLibrary !== null;
  };

  async userLibraryExistsByUserAndItem (
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<boolean> {
    const userLibrary = await this.getUserLibraryByUserAndItem(userId, itemType, itemId);
    return userLibrary !== null;
  };

  async countUserLibrary (): Promise<number> {
    return prisma.userLibrary.count();
  };
}