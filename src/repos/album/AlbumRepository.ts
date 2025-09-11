import { prisma } from '../../database/client';
import type { Album, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createAlbum = async (data: Prisma.AlbumCreateInput): Promise<Album> => {
  return prisma.album.create({ data });
};

// ========== READ ==========
export const getAlbumById = async (id: string): Promise<Album | null> => {
  return prisma.album.findUnique({ where: { id } });
};

export const getAllAlbums = async (): Promise<Album[]> => {
  return prisma.album.findMany({
    orderBy: { release_date: 'desc' }
  });
};

export const getAlbumWithSongs = async (id: string) => {
  return prisma.album.findUnique({
    where: { id },
    include: {
      songs: {
        include: {
          song_artists: {
            include: { artist: true }
          }
        },
        orderBy: { song_number: 'asc' }
      },
      album_artists: {
        include: { artist: true }
      }
    }
  });
};

export const searchAlbums = async (query: string): Promise<Album[]> => {
  return prisma.album.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { release_date: 'desc' },
    take: 20
  });
};

export const getAlbumsByGenre = async (genre: string): Promise<Album[]> => {
  return prisma.album.findMany({
    where: {
      genres: { has: genre }
    },
    orderBy: { release_date: 'desc' },
    take: 20
  });
};

export const getRecentAlbums = async (limit: number = 10): Promise<Album[]> => {
  return prisma.album.findMany({
    orderBy: { release_date: 'desc' },
    take: limit
  });
};

// ========== UPDATE ==========
export const updateAlbum = async (
  id: string, 
  data: Prisma.AlbumUpdateInput
): Promise<Album> => {
  return prisma.album.update({
    where: { id },
    data
  });
};

// ========== DELETE ==========
export const deleteAlbum = async (id: string): Promise<Album> => {
  return prisma.album.delete({ where: { id } });
};

// ========== UTILITY ==========
export const albumExists = async (id: string): Promise<boolean> => {
  const album = await prisma.album.findUnique({ where: { id } });
  return album !== null;
};

export const countAlbums = async (): Promise<number> => {
  return prisma.album.count();
};