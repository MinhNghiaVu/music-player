import { Injectable } from '@nestjs/common';
import { UserLibraryRepo } from './userLibrary.repository';
import type { UserLibrary, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class UserLibraryService {
  constructor(private readonly userLibraryRepo: UserLibraryRepo) {}

  async createUserLibrary(
    input: Prisma.UserLibraryCreateInput
  ): Promise<UserLibrary> {
    // Basic validation
    if (!input.user_id) {
      logger.error(`User ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('User ID is required');
    }

    if (!input.item_type) {
      logger.error(`Item type is missing in input ${JSON.stringify(input)}`);
      throw new Error('Item type is required');
    }

    if (!input.item_id) {
      logger.error(`Item ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Item ID is required');
    }

    // Check if library item already exists
    const exists = await this.userLibraryRepo.userLibraryExistsByUserAndItem(
      input.user_id,
      input.item_type,
      input.item_id
    );
    if (exists) {
      logger.error(`User library item already exists for user ${input.user_id}, type ${input.item_type}, id ${input.item_id}`);
      throw new Error('User library item already exists');
    }

    const userLibraryData: Prisma.UserLibraryCreateInput = {
      user_id: input.user_id,
      item_type: input.item_type,
      item_id: input.item_id,
    };

    logger.info(`Creating user library item with data: ${JSON.stringify(userLibraryData)}`);

    return this.userLibraryRepo.createUserLibrary(userLibraryData);
  };

  async getUserLibraryById (
    id: string
  ): Promise<UserLibrary | null> {
    if (!id) {
      logger.error('User library ID is missing or empty');
      throw new Error('User library ID is required');
    }

    return this.userLibraryRepo.getUserLibraryById(id);
  };

  async getUserLibraryByUserId (
    userId: string
  ): Promise<UserLibrary[]> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    return this.userLibraryRepo.getUserLibraryByUserId(userId);
  };

  async getUserLibraryByType (
    userId: string,
    itemType: string
  ): Promise<UserLibrary[]> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!itemType) {
      logger.error('Item type is missing or empty');
      throw new Error('Item type is required');
    }

    return this.userLibraryRepo.getUserLibraryByType(userId, itemType);
  };

  async getUserLibraryByUserAndItem (
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<UserLibrary | null> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!itemType) {
      logger.error('Item type is missing or empty');
      throw new Error('Item type is required');
    }

    if (!itemId) {
      logger.error('Item ID is missing or empty');
      throw new Error('Item ID is required');
    }

    return this.userLibraryRepo.getUserLibraryByUserAndItem(userId, itemType, itemId);
  };

  async updateUserLibrary (
    id: string,
    input: Prisma.UserLibraryUpdateInput
  ): Promise<UserLibrary> {
    if (!id) {
      logger.error('User library ID is missing or empty');
      throw new Error('User library ID is required');
    }

    // Check if user library item exists
    const exists = await this.userLibraryRepo.userLibraryExists(id);
    if (!exists) {
      logger.error(`User library item with ID ${id} does not exist`);
      throw new Error('User library item not found');
    }

    return this.userLibraryRepo.updateUserLibrary(id, input);
  };

  async deleteUserLibrary (
    id: string
  ): Promise<UserLibrary> {
    if (!id) {
      logger.error('User library ID is missing or empty');
      throw new Error('User library ID is required');
    }

    const exists = await this.userLibraryRepo.userLibraryExists(id);
    if (!exists) {
      logger.error(`User library item with ID ${id} does not exist`);
      throw new Error('User library item not found');
    }

    return this.userLibraryRepo.deleteUserLibrary(id);
  };

  async deleteUserLibraryByUserAndItem (
    userId: string,
    itemType: string,
    itemId: string
  ): Promise<UserLibrary> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!itemType) {
      logger.error('Item type is missing or empty');
      throw new Error('Item type is required');
    }

    if (!itemId) {
      logger.error('Item ID is missing or empty');
      throw new Error('Item ID is required');
    }

    const exists = await this.userLibraryRepo.userLibraryExistsByUserAndItem(userId, itemType, itemId);
    if (!exists) {
      logger.error(`User library item does not exist for user ${userId}, type ${itemType}, id ${itemId}`);
      throw new Error('User library item not found');
    }

    return this.userLibraryRepo.deleteUserLibraryByUserAndItem(userId, itemType, itemId);
  };
}
