import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { UserPreferences, Prisma } from '@prisma/client';

@Injectable()
export class UserPreferencesRepo {
  // ========== CREATE ==========
  async createUserPreferences (
    data: Prisma.UserPreferencesCreateInput
  ): Promise<UserPreferences> {
    return prisma.userPreferences.create({ data });
  }

  // ========== READ ==========
  async getUserPreferencesById (
    id: string
  ): Promise<UserPreferences | null> {
    return prisma.userPreferences.findUnique({ where: { id } });
  }

  async getAllUserPreferences (): Promise<UserPreferences[]> {
    return prisma.userPreferences.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updateUserPreferences (
    id: string, 
    data: Prisma.UserPreferencesUpdateInput
  ): Promise<UserPreferences> {
    return prisma.userPreferences.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteUserPreferences (
    id: string
  ): Promise<UserPreferences> {
    return prisma.userPreferences.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async userPreferencesExists (
    id: string
  ): Promise<boolean> {
    const userPreferences = await prisma.userPreferences.findUnique({ where: { id } });
    return userPreferences !== null;
  };
}