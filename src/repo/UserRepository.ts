import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  UserModel, 
  UserWithRelations,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class UserRepository extends AbstractBaseRepository<
  UserModel,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereUniqueInput
> {
  constructor() {
    super('user');
  }

  // Create operations
  async createUser(data: Prisma.UserCreateInput): Promise<UserModel> {
    return this.create(data);
  }

  async createManyUsers(data: Prisma.UserCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readUser(id: string, options?: RepositoryOptions): Promise<UserModel | null> {
    return this.findUnique({ id }, options);
  }

  async readUserByEmail(email: string, options?: RepositoryOptions): Promise<UserModel | null> {
    return this.findUnique({ email }, options);
  }

  async readUserByUsername(username: string, options?: RepositoryOptions): Promise<UserModel | null> {
    return this.findUnique({ username }, options);
  }

  async readUserWithRelations(id: string): Promise<UserWithRelations | null> {
    return this.findUnique(
      { id },
      {
        include: {
          playlists: true,
          user_preferences: true,
          user_library: true,
        },
      }
    ) as Promise<UserWithRelations | null>;
  }

  async readUsers(options?: RepositoryOptions): Promise<UserModel[]> {
    return this.findMany(options);
  }

  async readUsersPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readActiveUsers(options?: RepositoryOptions): Promise<UserModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        is_active: true,
      },
    });
  }

  async readUsersBySubscriptionTier(
    subscriptionTier: string,
    options?: RepositoryOptions
  ): Promise<UserModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        subscription_tier: subscriptionTier,
      },
    });
  }

  async readUsersByCountry(
    countryCode: string,
    options?: RepositoryOptions
  ): Promise<UserModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        country_code: countryCode,
      },
    });
  }

  // Update operations
  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<UserModel> {
    return this.update({ id }, data);
  }

  async updateUserByEmail(email: string, data: Prisma.UserUpdateInput): Promise<UserModel> {
    return this.update({ email }, data);
  }

  async updateUserLastActive(id: string): Promise<UserModel> {
    return this.update(
      { id },
      {
        last_active_at: new Date(),
      }
    );
  }

  async updateUserSubscription(
    id: string,
    subscriptionTier: string
  ): Promise<UserModel> {
    if (!['free', 'premium', 'family'].includes(subscriptionTier)) {
      throw new ValidationError('Invalid subscription tier', 'subscription_tier');
    }

    return this.update(
      { id },
      {
        subscription_tier: subscriptionTier,
      }
    );
  }

  async updateManyUsers(
    where: Prisma.UserWhereInput,
    data: Prisma.UserUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteUser(id: string): Promise<UserModel> {
    return this.delete({ id });
  }

  async deleteUserByEmail(email: string): Promise<UserModel> {
    return this.delete({ email });
  }

  async deleteInactiveUsers(inactiveDays: number = 365): Promise<Prisma.BatchPayload> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);

    return this.deleteMany({
      OR: [
        {
          last_active_at: {
            lt: cutoffDate,
          },
        },
        {
          last_active_at: null,
          created_at: {
            lt: cutoffDate,
          },
        },
      ],
      is_active: false,
    });
  }

  async deleteManyUsers(where?: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  // Utility operations
  async userExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async userExistsByEmail(email: string): Promise<boolean> {
    return this.exists({ email });
  }

  async userExistsByUsername(username: string): Promise<boolean> {
    return this.exists({ username });
  }

  async countUsers(options?: { where?: Prisma.UserWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countActiveUsers(): Promise<number> {
    return this.count({
      where: {
        is_active: true,
      },
    });
  }

  async countUsersBySubscriptionTier(subscriptionTier: string): Promise<number> {
    return this.count({
      where: {
        subscription_tier: subscriptionTier,
      },
    });
  }

  // Complex business logic operations
  async readUserWithFullProfile(id: string): Promise<UserWithRelations | null> {
    try {
      const user = await this.findUnique(
        { id },
        {
          include: {
            playlists: {
              include: {
                playlist_tracks: {
                  include: {
                    track: {
                      include: {
                        track_artists: {
                          include: {
                            artist: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            user_preferences: true,
            user_library: {
              include: {
                track: {
                  include: {
                    track_artists: {
                      include: {
                        artist: true,
                      },
                    },
                  },
                },
              },
            },
            listening_history: {
              orderBy: {
                played_at: 'desc',
              },
              take: 50,
              include: {
                track: {
                  include: {
                    track_artists: {
                      include: {
                        artist: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }
      );

      return user as UserWithRelations | null;
    } catch (error) {
      logger.error('Error fetching user with full profile', { userId: id, error });
      throw error;
    }
  }

  async searchUsers(query: string, options?: RepositoryOptions): Promise<UserModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        OR: [
          {
            username: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            display_name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async updateUserProfile(
    id: string,
    profileData: {
      display_name?: string;
      profile_image_url?: string;
      country_code?: string;
      language_preference?: string;
    }
  ): Promise<UserModel> {
    const user = await this.readUser(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }

    return this.update({ id }, profileData);
  }

  async deactivateUser(id: string): Promise<UserModel> {
    return this.update(
      { id },
      {
        is_active: false,
        updated_at: new Date(),
      }
    );
  }

  async reactivateUser(id: string): Promise<UserModel> {
    return this.update(
      { id },
      {
        is_active: true,
        last_active_at: new Date(),
        updated_at: new Date(),
      }
    );
  }
}

export const userRepository = new UserRepository();