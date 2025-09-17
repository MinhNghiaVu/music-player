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
    // Basic validation
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

    // Check if email already exists
    const emailExists = await this.usersRepo.emailExists(input.email);
    if (emailExists) {
      logger.error(`Email ${input.email} already exists`);
      throw new Error('Email already exists');
    }

    // Check if username already exists
    const usernameExists = await this.usersRepo.usernameExists(input.username);
    if (usernameExists) {
      logger.error(`Username ${input.username} already exists`);
      throw new Error('Username already exists');
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

  async getUserByEmail (
    email: string
  ): Promise<User | null> {
    if (!email) {
      logger.error('Email is missing or empty');
      throw new Error('Email is required');
    }

    return this.usersRepo.getUserByEmail(email.trim().toLowerCase());
  };

  async getUserByUsername (
    username: string
  ): Promise<User | null> {
    if (!username) {
      logger.error('Username is missing or empty');
      throw new Error('Username is required');
    }

    return this.usersRepo.getUserByUsername(username.trim());
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

    // Check if user exists
    const exists = await this.usersRepo.userExists(id);
    if (!exists) {
      logger.error(`User with ID ${id} does not exist`);
      throw new Error('User not found');
    }

    // Validate username if provided
    if (input.username !== undefined && !input.username) {
      logger.error(`Invalid username for user ID ${id}`);
      throw new Error('Username cannot be empty');
    }

    // Validate email if provided
    if (input.email !== undefined && !input.email) {
      logger.error(`Invalid email for user ID ${id}`);
      throw new Error('Email cannot be empty');
    }

    // Check if new email already exists (if changing email)
    if (input.email) {
      const emailExists = await this.usersRepo.emailExists(input.email);
      if (emailExists) {
        const existingUser = await this.usersRepo.getUserByEmail(input.email);
        if (existingUser && existingUser.id !== id) {
          logger.error(`Email ${input.email} already exists for another user`);
          throw new Error('Email already exists');
        }
      }
    }

    // Check if new username already exists (if changing username)
    if (input.username) {
      const usernameExists = await this.usersRepo.usernameExists(input.username);
      if (usernameExists) {
        const existingUser = await this.usersRepo.getUserByUsername(input.username);
        if (existingUser && existingUser.id !== id) {
          logger.error(`Username ${input.username} already exists for another user`);
          throw new Error('Username already exists');
        }
      }
    }

    const updateData: Prisma.UserUpdateInput = {
      ...(input.username && { username: input.username }),
      ...(input.email && { email: input.email }),
      ...(input.password_hash && { password_hash: input.password_hash }),
      ...(input.display_name !== undefined && { display_name: input.display_name }),
      ...(input.profile_image_url !== undefined && { profile_image_url: input.profile_image_url }),
      ...(input.subscription_tier && { subscription_tier: input.subscription_tier }),
      ...(input.country_code !== undefined && { country_code: input.country_code }),
      ...(input.language_preference && { language_preference: input.language_preference }),
      ...(input.is_active !== undefined && { is_active: input.is_active }),
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
