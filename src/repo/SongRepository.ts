import { prisma } from '../database/client';
import type { Song, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createSong = async (data: Prisma.SongCreateInput): Promise<Song> => {
  return prisma.song.create({ data });
};

// ========== READ ==========
export const getSongById = async (id: string): Promise<Song | null> => {
  return prisma.song.findUnique({ where: { id } });
};

export const getSongWithDetails = async (id: string) => {
  return prisma.song.findUnique({
    where: { id },
    include: {
      album: true,
      song_artists: {
        include: { artist: true }
      }
    }
  });
};

export const getSongsByAlbum = async (albumId: string): Promise<Song[]> => {
  return prisma.song.findMany({
    where: { album_id: albumId },
    orderBy: [
      { disc_number: 'asc' },
      { song_number: 'asc' }
    ]
  });
};

export const searchSongs = async (query: string): Promise<Song[]> => {
  return prisma.song.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' }
    },
    include: {
      album: true,
      song_artists: { include: { artist: true } }
    },
    take: 50
  });
};

export const getPopularSongs = async (limit: number = 20): Promise<Song[]> => {
  return prisma.song.findMany({
    orderBy: { play_count: 'desc' },
    take: limit,
    include: {
      album: true,
      song_artists: { include: { artist: true } }
    }
  });
};

export const getSongsByGenre = async (genre: string): Promise<Song[]> => {
  return prisma.song.findMany({
    where: {
      genres: { has: genre }
    },
    include: {
      album: true,
      song_artists: { include: { artist: true } }
    },
    take: 20
  });
};

// ========== UPDATE ==========
export const updateSong = async (
  id: string, 
  data: Prisma.SongUpdateInput
): Promise<Song> => {
  return prisma.song.update({
    where: { id },
    data
  });
};

export const incrementPlayCount = async (id: string): Promise<Song> => {
  return prisma.song.update({
    where: { id },
    data: {
      play_count: { increment: 1 }
    }
  });
};

// ========== DELETE ==========
export const deleteSong = async (id: string): Promise<Song> => {
  return prisma.song.delete({ where: { id } });
};

// ========== UTILITY ==========
export const songExists = async (id: string): Promise<boolean> => {
  const song = await prisma.song.findUnique({ where: { id } });
  return song !== null;
};

export const countSongs = async (): Promise<number> => {
  return prisma.song.count();
};