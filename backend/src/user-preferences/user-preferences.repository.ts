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
    return prisma.userPreferences.findUnique({ 
      where: { id },
      include: {
        user: true
      }
    });
  }

  async getUserPreferencesByUserId (
    userId: string
  ): Promise<UserPreferences | null> {
    return prisma.userPreferences.findUnique({ 
      where: { user_id: userId },
      include: {
        user: true
      }
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

  async updateUserPreferencesByUserId (
    userId: string, 
    data: Prisma.UserPreferencesUpdateInput
  ): Promise<UserPreferences> {
    return prisma.userPreferences.update({
      where: { user_id: userId },
      data
    });
  };

  // ========== DELETE ==========
  async deleteUserPreferences (
    id: string
  ): Promise<UserPreferences> {
    return prisma.userPreferences.delete({ where: { id } });
  };

  async deleteUserPreferencesByUserId (
    userId: string
  ): Promise<UserPreferences> {
    return prisma.userPreferences.delete({ where: { user_id: userId } });
  };

  // ========== UTILITY ==========
  async userPreferencesExists (
    id: string
  ): Promise<boolean> {
    const userPreferences = await prisma.userPreferences.findUnique({ where: { id } });
    return userPreferences !== null;
  };

  async userPreferencesExistsByUserId (
    userId: string
  ): Promise<boolean> {
    const userPreferences = await prisma.userPreferences.findUnique({ where: { user_id: userId } });
    return userPreferences !== null;
  };

  async countUserPreferences (): Promise<number> {
    return prisma.userPreferences.count();
  };
}
