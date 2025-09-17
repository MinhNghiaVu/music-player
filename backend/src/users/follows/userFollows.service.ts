import { Injectable } from '@nestjs/common';
import { UserFollowsRepo } from './userFollows.repository';
import type { UserFollow, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class UserFollowsService {
  constructor(private readonly userFollowsRepo: UserFollowsRepo) {}

  async createUserFollow(
    input: Prisma.UserFollowCreateInput
  ): Promise<UserFollow> {
    // Basic validation
    if (!input.follower_id) {
      logger.error(`Follower ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Follower ID is required');
    }

    if (!input.followable_type) {
      logger.error(`Followable type is missing in input ${JSON.stringify(input)}`);
      throw new Error('Followable type is required');
    }

    if (!input.followable_id) {
      logger.error(`Followable ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Followable ID is required');
    }

    // Check if follow already exists
    const exists = await this.userFollowsRepo.userFollowExistsByFollowerAndFollowable(
      input.follower_id,
      input.followable_type,
      input.followable_id
    );
    if (exists) {
      logger.error(`User follow already exists for follower ${input.follower_id}, type ${input.followable_type}, id ${input.followable_id}`);
      throw new Error('User follow already exists');
    }

    const userFollowData: Prisma.UserFollowCreateInput = {
      follower_id: input.follower_id,
      followable_type: input.followable_type,
      followable_id: input.followable_id,
    };

    logger.info(`Creating user follow with data: ${JSON.stringify(userFollowData)}`);

    return this.userFollowsRepo.createUserFollow(userFollowData);
  };

  async getUserFollowById (
    id: string
  ): Promise<UserFollow | null> {
    if (!id) {
      logger.error('User follow ID is missing or empty');
      throw new Error('User follow ID is required');
    }

    return this.userFollowsRepo.getUserFollowById(id);
  };

  async getUserFollowsByFollowerId (
    followerId: string
  ): Promise<UserFollow[]> {
    if (!followerId) {
      logger.error('Follower ID is missing or empty');
      throw new Error('Follower ID is required');
    }

    return this.userFollowsRepo.getUserFollowsByFollowerId(followerId);
  };

  async getUserFollowsByFollowableId (
    followableType: string,
    followableId: string
  ): Promise<UserFollow[]> {
    if (!followableType) {
      logger.error('Followable type is missing or empty');
      throw new Error('Followable type is required');
    }

    if (!followableId) {
      logger.error('Followable ID is missing or empty');
      throw new Error('Followable ID is required');
    }

    return this.userFollowsRepo.getUserFollowsByFollowableId(followableType, followableId);
  };

  async getUserFollowByFollowerAndFollowable (
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<UserFollow | null> {
    if (!followerId) {
      logger.error('Follower ID is missing or empty');
      throw new Error('Follower ID is required');
    }

    if (!followableType) {
      logger.error('Followable type is missing or empty');
      throw new Error('Followable type is required');
    }

    if (!followableId) {
      logger.error('Followable ID is missing or empty');
      throw new Error('Followable ID is required');
    }

    return this.userFollowsRepo.getUserFollowByFollowerAndFollowable(followerId, followableType, followableId);
  };

  async updateUserFollow (
    id: string,
    input: Prisma.UserFollowUpdateInput
  ): Promise<UserFollow> {
    if (!id) {
      logger.error('User follow ID is missing or empty');
      throw new Error('User follow ID is required');
    }

    // Check if user follow exists
    const exists = await this.userFollowsRepo.userFollowExists(id);
    if (!exists) {
      logger.error(`User follow with ID ${id} does not exist`);
      throw new Error('User follow not found');
    }

    return this.userFollowsRepo.updateUserFollow(id, input);
  };

  async deleteUserFollow (
    id: string
  ): Promise<UserFollow> {
    if (!id) {
      logger.error('User follow ID is missing or empty');
      throw new Error('User follow ID is required');
    }

    const exists = await this.userFollowsRepo.userFollowExists(id);
    if (!exists) {
      logger.error(`User follow with ID ${id} does not exist`);
      throw new Error('User follow not found');
    }

    return this.userFollowsRepo.deleteUserFollow(id);
  };

  async deleteUserFollowByFollowerAndFollowable (
    followerId: string,
    followableType: string,
    followableId: string
  ): Promise<UserFollow> {
    if (!followerId) {
      logger.error('Follower ID is missing or empty');
      throw new Error('Follower ID is required');
    }

    if (!followableType) {
      logger.error('Followable type is missing or empty');
      throw new Error('Followable type is required');
    }

    if (!followableId) {
      logger.error('Followable ID is missing or empty');
      throw new Error('Followable ID is required');
    }

    const exists = await this.userFollowsRepo.userFollowExistsByFollowerAndFollowable(followerId, followableType, followableId);
    if (!exists) {
      logger.error(`User follow does not exist for follower ${followerId}, type ${followableType}, id ${followableId}`);
      throw new Error('User follow not found');
    }

    return this.userFollowsRepo.deleteUserFollowByFollowerAndFollowable(followerId, followableType, followableId);
  };
}
