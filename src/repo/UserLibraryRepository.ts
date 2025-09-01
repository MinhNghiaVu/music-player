import { prisma } from '../database/client';
import type { UserLibrary, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createUserLibrary = async (data: Prisma.UserLibraryCreateInput): Promise<UserLibrary> => {
  return prisma.userLibrary.create({ data });
};

export const addToLibrary = async (
  userId: string, 
  itemType: string, 
  itemId: string
): Promise<UserLibrary> => {
  return prisma.userLibrary.create({
    data: {
      user_id: userId,
      item_type: itemType,
      item_id: itemId
    }
  });
};

export const addSongToLibrary = async (userId: string, songId: string): Promise<UserLibrary> => {
  return addToLibrary(userId, 'song', songId);
};

export const addAlbumToLibrary = async (userId: string, albumId: string): Promise<UserLibrary> => {
  return addToLibrary(userId, 'album', albumId);
};

export const addPlaylistToLibrary = async (userId: string, playlistId: string): Promise<UserLibrary> => {
  return addToLibrary(userId, 'playlist', playlistId);
};

// ========== READ ==========
export const getUserLibrary = async (userId: string): Promise<UserLibrary[]> => {
  return prisma.userLibrary.findMany({
    where: { user_id: userId },
    orderBy: { added_at: 'desc' }
  });
};

export const getLibrarySongs = async (userId: string): Promise<UserLibrary[]> => {
  return prisma.userLibrary.findMany({
    where: {
      user_id: userId,
      item_type: 'song'
    },
    include: {
      song: {
        include: {
          album: true,
          song_artists: { include: { artist: true } }
        }
      }
    },
    orderBy: { added_at: 'desc' }
  });
};

export const getLibraryAlbums = async (userId: string): Promise<UserLibrary[]> => {
  return prisma.userLibrary.findMany({
    where: {
      user_id: userId,
      item_type: 'album'
    },
    orderBy: { added_at: 'desc' }
  });
};

export const getLibraryPlaylists = async (userId: string): Promise<UserLibrary[]> => {
  return prisma.userLibrary.findMany({
    where: {
      user_id: userId,
      item_type: 'playlist'
    },
    orderBy: { added_at: 'desc' }
  });
};

export const isInLibrary = async (
  userId: string, 
  itemType: string, 
  itemId: string
): Promise<boolean> => {
  const item = await prisma.userLibrary.findFirst({
    where: {
      user_id: userId,
      item_type: itemType,
      item_id: itemId
    }
  });
  return item !== null;
};

// ========== DELETE ==========
export const deleteUserLibrary = async (id: string): Promise<UserLibrary> => {
  return prisma.userLibrary.delete({ where: { id } });
};

export const removeFromLibrary = async (
  userId: string, 
  itemType: string, 
  itemId: string
): Promise<void> => {
  await prisma.userLibrary.deleteMany({
    where: {
      user_id: userId,
      item_type: itemType,
      item_id: itemId
    }
  });
};

export const removeSongFromLibrary = async (userId: string, songId: string): Promise<void> => {
  return removeFromLibrary(userId, 'song', songId);
};

export const removeAlbumFromLibrary = async (userId: string, albumId: string): Promise<void> => {
  return removeFromLibrary(userId, 'album', albumId);
};

export const removePlaylistFromLibrary = async (userId: string, playlistId: string): Promise<void> => {
  return removeFromLibrary(userId, 'playlist', playlistId);
};

// ========== UTILITY ==========
export const countLibraryItems = async (userId: string): Promise<number> => {
  return prisma.userLibrary.count({
    where: { user_id: userId }
  });
};