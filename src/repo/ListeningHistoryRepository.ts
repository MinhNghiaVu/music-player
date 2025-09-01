import { prisma } from '../database/client';
import type { ListeningHistory, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createListeningHistory = async (data: Prisma.ListeningHistoryCreateInput): Promise<ListeningHistory> => {
  return prisma.listeningHistory.create({ data });
};

export const recordListening = async (
  userId: string, 
  songId: string,
  playDurationSeconds?: number,
  completed?: boolean,
  deviceType?: string,
  source?: string
): Promise<ListeningHistory> => {
  return prisma.listeningHistory.create({
    data: {
      user: { connect: { id: userId } },
      song: { connect: { id: songId } },
      play_duration_seconds: playDurationSeconds,
      completed: completed || false,
      device_type: deviceType,
      source: source
    }
  });
};

// ========== READ ==========
export const getListeningHistoryById = async (id: string): Promise<ListeningHistory | null> => {
  return prisma.listeningHistory.findUnique({ where: { id } });
};

export const getUserListeningHistory = async (
  userId: string, 
  limit: number = 50
): Promise<ListeningHistory[]> => {
  return prisma.listeningHistory.findMany({
    where: { user_id: userId },
    include: {
      song: {
        include: {
          album: true,
          song_artists: { include: { artist: true } }
        }
      }
    },
    orderBy: { played_at: 'desc' },
    take: limit
  });
};

export const getRecentlyPlayed = async (
  userId: string, 
  limit: number = 20
) => {
  return prisma.listeningHistory.findMany({
    where: { user_id: userId },
    include: {
      song: {
        include: {
          album: true,
          song_artists: { include: { artist: true } }
        }
      }
    },
    orderBy: { played_at: 'desc' },
    take: limit,
    distinct: ['song_id']
  });
};

export const getMostPlayedSongs = async (
  userId: string, 
  limit: number = 20
) => {
  return prisma.listeningHistory.groupBy({
    by: ['song_id'],
    where: { user_id: userId },
    _count: { song_id: true },
    orderBy: { _count: { song_id: 'desc' } },
    take: limit
  });
};

// ========== UPDATE ==========
export const updateListeningHistory = async (
  id: string, 
  data: Prisma.ListeningHistoryUpdateInput
): Promise<ListeningHistory> => {
  return prisma.listeningHistory.update({
    where: { id },
    data
  });
};

// ========== DELETE ==========
export const deleteListeningHistory = async (id: string): Promise<ListeningHistory> => {
  return prisma.listeningHistory.delete({ where: { id } });
};

export const clearListeningHistory = async (userId: string): Promise<void> => {
  await prisma.listeningHistory.deleteMany({
    where: { user_id: userId }
  });
};

// ========== UTILITY ==========
export const listeningHistoryExists = async (id: string): Promise<boolean> => {
  const history = await prisma.listeningHistory.findUnique({ where: { id } });
  return history !== null;
};

export const countUserListenings = async (userId: string): Promise<number> => {
  return prisma.listeningHistory.count({
    where: { user_id: userId }
  });
};

export const getSongPlayCount = async (userId: string, songId: string): Promise<number> => {
  return prisma.listeningHistory.count({
    where: {
      user_id: userId,
      song_id: songId
    }
  });
};