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

  async getAllUserLikes (): Promise<UserLike[]> {
    return this.userLikesRepo.getAllUserLikes();
  };

  async updateUserLike (
    id: string,
    input: Prisma.UserLikeUpdateInput
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
}
