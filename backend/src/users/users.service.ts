import { Injectable } from '@nestjs/common';
import { UsersRepo } from './users.repository';
import type { User, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  async createUser(
    input: Prisma.UserCreateInput
  ): Promise<User> {
    if (!input.username) {
      logger.error(`Username is missing in input ${JSON.stringify(input)}`);
      throw new Error('Username is required');
    }

    if (!input.email) {
      logger.error(`Email is missing in input ${JSON.stringify(input)}`);
      throw new Error('Email is required');
    }

    if (!input.password_hash) {
      logger.error(`Password hash is missing in input ${JSON.stringify(input)}`);
      throw new Error('Password hash is required');
    }

    const userData: Prisma.UserCreateInput = {
      username: input.username.trim(),
      email: input.email.trim().toLowerCase(),
      password_hash: input.password_hash,
      display_name: input.display_name?.trim(),
      profile_image_url: input.profile_image_url,
      subscription_tier: input.subscription_tier || 'free',
      country_code: input.country_code,
      language_preference: input.language_preference || 'en',
    };

    logger.info(`Creating user with data: ${JSON.stringify({ ...userData, password_hash: '[REDACTED]' })}`);
    return this.usersRepo.createUser(userData);
  };

  async getUserById (
    id: string
  ): Promise<User | null> {
    if (!id) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    return this.usersRepo.getUserById(id);
  };

  async getAllUsers (): Promise<User[]> {
    return this.usersRepo.getAllUsers();
  };

  async updateUser (
    id: string,
    input: Prisma.UserUpdateInput
  ): Promise<User> {
    if (!id) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    const exists = await this.usersRepo.userExists(id);
    if (!exists) {
      logger.error(`User with ID ${id} does not exist`);
      throw new Error('User not found');
    }

    if (input.username !== undefined && !input.username) {
      logger.error(`Invalid username for user ID ${id}`);
      throw new Error('Username cannot be empty');
    }

    if (input.email !== undefined && !input.email) {
      logger.error(`Invalid email for user ID ${id}`);
      throw new Error('Email cannot be empty');
    }

    const updateData: Prisma.UserUpdateInput = {
      ...input,
      updated_at: new Date()
    };

    return this.usersRepo.updateUser(id, updateData);
  };

  async deleteUser (
    id: string
  ): Promise<User> {
    if (!id) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    const exists = await this.usersRepo.userExists(id);
    if (!exists) {
      logger.error(`User with ID ${id} does not exist`);
      throw new Error('User not found');
    }

    return this.usersRepo.deleteUser(id);
  };
}
