import { prisma } from '../database/client';
import type { User, UserPreferences, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({ data });
};

export const createUserPreferences = async (data: Prisma.UserPreferencesCreateInput): Promise<UserPreferences> => {
  return prisma.userPreferences.create({ data });
};

// ========== READ ==========
export const getUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { username } });
};

export const getUserWithPlaylists = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      playlists: {
        orderBy: { updated_at: 'desc' }
      }
    }
  });
};

export const getUserWithPreferences = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      user_preferences: true
    }
  });
};

export const searchUsers = async (query: string): Promise<User[]> => {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { display_name: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 20
  });
};

// ========== UPDATE ==========
export const updateUser = async (
  id: string, 
  data: Prisma.UserUpdateInput
): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data
  });
};

export const updateUserPreferences = async (
  userId: string, 
  data: Prisma.UserPreferencesUpdateInput
): Promise<UserPreferences> => {
  return prisma.userPreferences.update({
    where: { user_id: userId },
    data
  });
};

export const updateLastActiveAt = async (id: string): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data: { last_active_at: new Date() }
  });
};

// ========== DELETE ==========
export const deleteUser = async (id: string): Promise<User> => {
  return prisma.user.delete({ where: { id } });
};

// ========== UTILITY ==========
export const userExists = async (id: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user !== null;
};

export const emailExists = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user !== null;
};

export const usernameExists = async (username: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { username } });
  return user !== null;
};

export const countUsers = async (): Promise<number> => {
  return prisma.user.count();
};