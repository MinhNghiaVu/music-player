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

  async getAllUserLibrary (): Promise<UserLibrary[]> {
    return prisma.userLibrary.findMany({
      orderBy: { added_at: 'desc' }
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

  // ========== UTILITY ==========
  async userLibraryExists (
    id: string
  ): Promise<boolean> {
    const userLibrary = await prisma.userLibrary.findUnique({ where: { id } });
    return userLibrary !== null;
  };
}