import { prisma } from '../database/client';
import type { UserFollow, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createUserFollow = async (data: Prisma.UserFollowCreateInput): Promise<UserFollow> => {
  return prisma.userFollow.create({ data });
};

export const followUser = async (followerId: string, followingId: string): Promise<UserFollow> => {
  return prisma.userFollow.create({
    data: {
      follower_id: followerId,
      followable_type: 'user',
      followable_id: followingId
    }
  });
};

export const followArtist = async (userId: string, artistId: string): Promise<UserFollow> => {
  return prisma.userFollow.create({
    data: {
      follower_id: userId,
      followable_type: 'artist',
      followable_id: artistId,
    }
  });
};

// ========== READ ==========
export const getUserFollows = async (userId: string): Promise<UserFollow[]> => {
  return prisma.userFollow.findMany({
    where: { follower_id: userId },
    orderBy: { created_at: 'desc' }
  });
};

export const getUserFollowers = async (userId: string): Promise<UserFollow[]> => {
  return prisma.userFollow.findMany({
    where: {
      followable_type: 'user',
      followable_id: userId
    },
    orderBy: { created_at: 'desc' }
  });
};

export const getFollowedArtists = async (userId: string): Promise<UserFollow[]> => {
  return prisma.userFollow.findMany({
    where: {
      follower_id: userId,
      followable_type: 'artist'
    },
    include: {
      artist: true
    },
    orderBy: { created_at: 'desc' }
  });
};

export const isFollowing = async (
  followerId: string, 
  followableType: string, 
  followableId: string
): Promise<boolean> => {
  const follow = await prisma.userFollow.findFirst({
    where: {
      follower_id: followerId,
      followable_type: followableType,
      followable_id: followableId
    }
  });
  return follow !== null;
};

// ========== DELETE ==========
export const deleteUserFollow = async (id: string): Promise<UserFollow> => {
  return prisma.userFollow.delete({ where: { id } });
};

export const unfollowItem = async (
  followerId: string, 
  followableType: string, 
  followableId: string
): Promise<void> => {
  await prisma.userFollow.deleteMany({
    where: {
      follower_id: followerId,
      followable_type: followableType,
      followable_id: followableId
    }
  });
};

export const unfollowUser = async (followerId: string, followingId: string): Promise<void> => {
  return unfollowItem(followerId, 'user', followingId);
};

export const unfollowArtist = async (userId: string, artistId: string): Promise<void> => {
  return unfollowItem(userId, 'artist', artistId);
};

// ========== UTILITY ==========
export const countFollowers = async (userId: string): Promise<number> => {
  return prisma.userFollow.count({
    where: {
      followable_type: 'user',
      followable_id: userId
    }
  });
};

export const countFollowing = async (userId: string): Promise<number> => {
  return prisma.userFollow.count({
    where: { follower_id: userId }
  });
};