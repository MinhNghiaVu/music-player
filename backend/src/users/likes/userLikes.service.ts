import { Injectable } from '@nestjs/common';
import { UserLikesRepo } from './userLikes.repository';
import type { UserLike, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class UserLikesService {
  constructor(private readonly userLikesRepo: UserLikesRepo) {}

  async createUserLike(
    input: Prisma.UserLikeCreateInput
  ): Promise<UserLike> {
    // Basic validation
    if (!input.user_id) {
      logger.error(`User ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('User ID is required');
    }

    if (!input.likeable_type) {
      logger.error(`Likeable type is missing in input ${JSON.stringify(input)}`);
      throw new Error('Likeable type is required');
    }

    if (!input.likeable_id) {
      logger.error(`Likeable ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Likeable ID is required');
    }

    // Check if like already exists
    const exists = await this.userLikesRepo.userLikeExistsByUserAndItem(
      input.user_id,
      input.likeable_type,
      input.likeable_id
    );
    if (exists) {
      logger.error(`User like already exists for user ${input.user_id}, type ${input.likeable_type}, id ${input.likeable_id}`);
      throw new Error('User like already exists');
    }

    const userLikeData: Prisma.UserLikeCreateInput = {
      user_id: input.user_id,
      likeable_type: input.likeable_type,
      likeable_id: input.likeable_id,
    };

    logger.info(`Creating user like with data: ${JSON.stringify(userLikeData)}`);

    return this.userLikesRepo.createUserLike(userLikeData);
  };

  async getUserLikeById (
    id: string
  ): Promise<UserLike | null> {
    if (!id) {
      logger.error('User like ID is missing or empty');
      throw new Error('User like ID is required');
    }

    return this.userLikesRepo.getUserLikeById(id);
  };

  async getUserLikesByUserId (
    userId: string
  ): Promise<UserLike[]> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    return this.userLikesRepo.getUserLikesByUserId(userId);
  };

  async getUserLikesByType (
    userId: string,
    likeableType: string
  ): Promise<UserLike[]> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!likeableType) {
      logger.error('Likeable type is missing or empty');
      throw new Error('Likeable type is required');
    }

    return this.userLikesRepo.getUserLikesByType(userId, likeableType);
  };

  async getUserLikeByUserAndItem (
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<UserLike | null> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!likeableType) {
      logger.error('Likeable type is missing or empty');
      throw new Error('Likeable type is required');
    }

    if (!likeableId) {
      logger.error('Likeable ID is missing or empty');
      throw new Error('Likeable ID is required');
    }

    return this.userLikesRepo.getUserLikeByUserAndItem(userId, likeableType, likeableId);
  };

  async updateUserLike (
    id: string,
    input: Prisma.UserLikeUpdateInput
  ): Promise<UserLike> {
    if (!id) {
      logger.error('User like ID is missing or empty');
      throw new Error('User like ID is required');
    }

    // Check if user like exists
    const exists = await this.userLikesRepo.userLikeExists(id);
    if (!exists) {
      logger.error(`User like with ID ${id} does not exist`);
      throw new Error('User like not found');
    }

    return this.userLikesRepo.updateUserLike(id, input);
  };

  async deleteUserLike (
    id: string
  ): Promise<UserLike> {
    if (!id) {
      logger.error('User like ID is missing or empty');
      throw new Error('User like ID is required');
    }

    const exists = await this.userLikesRepo.userLikeExists(id);
    if (!exists) {
      logger.error(`User like with ID ${id} does not exist`);
      throw new Error('User like not found');
    }

    return this.userLikesRepo.deleteUserLike(id);
  };

  async deleteUserLikeByUserAndItem (
    userId: string,
    likeableType: string,
    likeableId: string
  ): Promise<UserLike> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!likeableType) {
      logger.error('Likeable type is missing or empty');
      throw new Error('Likeable type is required');
    }

    if (!likeableId) {
      logger.error('Likeable ID is missing or empty');
      throw new Error('Likeable ID is required');
    }

    const exists = await this.userLikesRepo.userLikeExistsByUserAndItem(userId, likeableType, likeableId);
    if (!exists) {
      logger.error(`User like does not exist for user ${userId}, type ${likeableType}, id ${likeableId}`);
      throw new Error('User like not found');
    }

    return this.userLikesRepo.deleteUserLikeByUserAndItem(userId, likeableType, likeableId);
  };
}
