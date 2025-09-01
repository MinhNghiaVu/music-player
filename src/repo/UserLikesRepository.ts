import { prisma } from '../database/client';
import type { UserLike, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createUserLike = async (data: Prisma.UserLikeCreateInput): Promise<UserLike> => {
  return prisma.userLike.create({ data });
};

export const likeSong = async (userId: string, songId: string): Promise<UserLike> => {
  return prisma.userLike.create({
    data: {
      user: { connect: { id: userId } },
      likeable_type: 'song',
      likeable_id: songId
    }
  });
};

export const likeAlbum = async (userId: string, albumId: string): Promise<UserLike> => {
  return prisma.userLike.create({
    data: {
      user: { connect: { id: userId } },
      likeable_type: 'album',
      likeable_id: albumId
    }
  });
};

export const likeArtist = async (userId: string, artistId: string): Promise<UserLike> => {
  return prisma.userLike.create({
    data: {
      user: { connect: { id: userId } },
      likeable_type: 'artist',
      likeable_id: artistId
    }
  });
};

// ========== READ ==========
export const getUserLikes = async (userId: string): Promise<UserLike[]> => {
  return prisma.userLike.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' }
  });
};

export const getUserLikedSongs = async (userId: string): Promise<UserLike[]> => {
  return prisma.userLike.findMany({
    where: {
      user_id: userId,
      likeable_type: 'song'
    },
    orderBy: { created_at: 'desc' }
  });
};

export const getUserLikedAlbums = async (userId: string): Promise<UserLike[]> => {
  return prisma.userLike.findMany({
    where: {
      user_id: userId,
      likeable_type: 'album'
    },
    orderBy: { created_at: 'desc' }
  });
};

export const isLiked = async (
  userId: string, 
  likeableType: string, 
  likeableId: string
): Promise<boolean> => {
  const like = await prisma.userLike.findFirst({
    where: {
      user_id: userId,
      likeable_type: likeableType,
      likeable_id: likeableId
    }
  });
  return like !== null;
};

// ========== DELETE ==========
export const deleteUserLike = async (id: string): Promise<UserLike> => {
  return prisma.userLike.delete({ where: { id } });
};

export const unlikeItem = async (
  userId: string, 
  likeableType: string, 
  likeableId: string
): Promise<void> => {
  await prisma.userLike.deleteMany({
    where: {
      user_id: userId,
      likeable_type: likeableType,
      likeable_id: likeableId
    }
  });
};

export const unlikeSong = async (userId: string, songId: string): Promise<void> => {
  return unlikeItem(userId, 'song', songId);
};

export const unlikeAlbum = async (userId: string, albumId: string): Promise<void> => {
  return unlikeItem(userId, 'album', albumId);
};

export const unlikeArtist = async (userId: string, artistId: string): Promise<void> => {
  return unlikeItem(userId, 'artist', artistId);
};

// ========== UTILITY ==========
export const countUserLikes = async (userId: string): Promise<number> => {
  return prisma.userLike.count({
    where: { user_id: userId }
  });
};