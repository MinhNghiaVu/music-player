import { prisma } from '../../database/client';
import type { Artist, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createArtist = async (data: Prisma.ArtistCreateInput): Promise<Artist> => {
  return prisma.artist.create({ data });
};

// ========== READ ==========
export const getArtistById = async (id: string): Promise<Artist | null> => {
  return prisma.artist.findUnique({ where: { id } });
};

export const getAllArtists = async (): Promise<Artist[]> => {
  return prisma.artist.findMany({
    orderBy: { name: 'asc' }
  });
};

export const getArtistWithAlbums = async (id: string) => {
  return prisma.artist.findUnique({
    where: { id },
    include: {
      album_artists: {
        include: { album: true }
      }
    }
  });
};

export const getArtistWithSongs = async (id: string) => {
  return prisma.artist.findUnique({
    where: { id },
    include: {
      song_artists: {
        include: { 
          song: { 
            include: { album: true } 
          }
        }
      }
    }
  });
};

export const searchArtists = async (query: string): Promise<Artist[]> => {
  return prisma.artist.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' }
    },
    take: 20
  });
};

export const getPopularArtists = async (limit: number = 10): Promise<Artist[]> => {
  return prisma.artist.findMany({
    orderBy: { monthly_listeners: 'desc' },
    take: limit
  });
};

export const getVerifiedArtists = async (limit: number = 20): Promise<Artist[]> => {
  return prisma.artist.findMany({
    where: { verified: true },
    orderBy: { monthly_listeners: 'desc' },
    take: limit
  });
};

// ========== UPDATE ==========
export const updateArtist = async (
  id: string, 
  data: Prisma.ArtistUpdateInput
): Promise<Artist> => {
  return prisma.artist.update({
    where: { id },
    data
  });
};

// ========== DELETE ==========
export const deleteArtist = async (id: string): Promise<Artist> => {
  return prisma.artist.delete({ where: { id } });
};

// ========== UTILITY ==========
export const artistExists = async (id: string): Promise<boolean> => {
  const artist = await prisma.artist.findUnique({ where: { id } });
  return artist !== null;
};

export const countArtists = async (): Promise<number> => {
  return prisma.artist.count();
};