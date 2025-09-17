import { Injectable } from '@nestjs/common';
import { UserPreferencesRepo } from './user-preferences.repository';
import type { UserPreferences, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class UserPreferencesService {
  constructor(private readonly userPreferencesRepo: UserPreferencesRepo) {}

  async createUserPreferences(
    input: Prisma.UserPreferencesCreateInput
  ): Promise<UserPreferences> {
    // Basic validation
    if (!input.user_id) {
      logger.error(`User ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('User ID is required');
    }

    // Check if user preferences already exist
    const exists = await this.userPreferencesRepo.userPreferencesExistsByUserId(input.user_id);
    if (exists) {
      logger.error(`User preferences already exist for user ${input.user_id}`);
      throw new Error('User preferences already exist');
    }

    const userPreferencesData: Prisma.UserPreferencesCreateInput = {
      user_id: input.user_id,
      audio_quality: input.audio_quality || 'high',
      autoplay_enabled: input.autoplay_enabled !== undefined ? input.autoplay_enabled : true,
      crossfade_duration: input.crossfade_duration || 0,
      explicit_content_filter: input.explicit_content_filter !== undefined ? input.explicit_content_filter : false,
      social_features_enabled: input.social_features_enabled !== undefined ? input.social_features_enabled : true,
      notifications_enabled: input.notifications_enabled !== undefined ? input.notifications_enabled : true,
      offline_downloads_enabled: input.offline_downloads_enabled !== undefined ? input.offline_downloads_enabled : false,
    };

    logger.info(`Creating user preferences with data: ${JSON.stringify(userPreferencesData)}`);

    return this.userPreferencesRepo.createUserPreferences(userPreferencesData);
  };

  async getUserPreferencesById (
    id: string
  ): Promise<UserPreferences | null> {
    if (!id) {
      logger.error('User preferences ID is missing or empty');
      throw new Error('User preferences ID is required');
    }

    return this.userPreferencesRepo.getUserPreferencesById(id);
  };

  async getUserPreferencesByUserId (
    userId: string
  ): Promise<UserPreferences | null> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    return this.userPreferencesRepo.getUserPreferencesByUserId(userId);
  };

  async updateUserPreferences (
    id: string,
    input: Prisma.UserPreferencesUpdateInput
  ): Promise<UserPreferences> {
    if (!id) {
      logger.error('User preferences ID is missing or empty');
      throw new Error('User preferences ID is required');
    }

    // Check if user preferences exist
    const exists = await this.userPreferencesRepo.userPreferencesExists(id);
    if (!exists) {
      logger.error(`User preferences with ID ${id} does not exist`);
      throw new Error('User preferences not found');
    }

    const updateData: Prisma.UserPreferencesUpdateInput = {
      ...input,
      updated_at: new Date()
    };

    return this.userPreferencesRepo.updateUserPreferences(id, updateData);
  };

  async updateUserPreferencesByUserId (
    userId: string,
    input: Prisma.UserPreferencesUpdateInput
  ): Promise<UserPreferences> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    // Check if user preferences exist
    const exists = await this.userPreferencesRepo.userPreferencesExistsByUserId(userId);
    if (!exists) {
      logger.error(`User preferences for user ${userId} do not exist`);
      throw new Error('User preferences not found');
    }

    const updateData: Prisma.UserPreferencesUpdateInput = {
      ...input,
      updated_at: new Date()
    };

    return this.userPreferencesRepo.updateUserPreferencesByUserId(userId, updateData);
  };

  async deleteUserPreferences (
    id: string
  ): Promise<UserPreferences> {
    if (!id) {
      logger.error('User preferences ID is missing or empty');
      throw new Error('User preferences ID is required');
    }

    const exists = await this.userPreferencesRepo.userPreferencesExists(id);
    if (!exists) {
      logger.error(`User preferences with ID ${id} does not exist`);
      throw new Error('User preferences not found');
    }

    return this.userPreferencesRepo.deleteUserPreferences(id);
  };

  async deleteUserPreferencesByUserId (
    userId: string
  ): Promise<UserPreferences> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    const exists = await this.userPreferencesRepo.userPreferencesExistsByUserId(userId);
    if (!exists) {
      logger.error(`User preferences for user ${userId} do not exist`);
      throw new Error('User preferences not found');
    }

    return this.userPreferencesRepo.deleteUserPreferencesByUserId(userId);
  };
}
