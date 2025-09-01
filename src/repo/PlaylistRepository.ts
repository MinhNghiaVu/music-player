import { prisma } from '../database/client';
import type { Playlist, PlaylistSong, Prisma } from '@prisma/client';

// ========== CREATE ==========
export const createPlaylist = async (data: Prisma.PlaylistCreateInput): Promise<Playlist> => {
  return prisma.playlist.create({ data });
};

export const createPlaylistSong = async (data: Prisma.PlaylistSongCreateInput): Promise<PlaylistSong> => {
  return prisma.playlistSong.create({ data });
};

// ========== READ ==========
export const getPlaylistById = async (id: string): Promise<Playlist | null> => {
  return prisma.playlist.findUnique({ where: { id } });
};

export const getPlaylistWithSongs = async (id: string) => {
  return prisma.playlist.findUnique({
    where: { id },
    include: {
      playlist_songs: {
        include: {
          song: {
            include: {
              album: true,
              song_artists: { include: { artist: true } }
            }
          }
        },
        orderBy: { position: 'asc' }
      }
    }
  });
};

export const getUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  return prisma.playlist.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: 'desc' }
  });
};

export const getPublicPlaylists = async (limit: number = 20): Promise<Playlist[]> => {
  return prisma.playlist.findMany({
    where: { is_public: true },
    orderBy: { updated_at: 'desc' },
    take: limit
  });
};

export const searchPlaylists = async (query: string): Promise<Playlist[]> => {
  return prisma.playlist.findMany({
    where: {
      AND: [
        { is_public: true },
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        }
      ]
    },
    take: 20
  });
};

// ========== UPDATE ==========
export const updatePlaylist = async (
  id: string, 
  data: Prisma.PlaylistUpdateInput
): Promise<Playlist> => {
  return prisma.playlist.update({
    where: { id },
    data
  });
};

export const addSongToPlaylist = async (
  playlistId: string, 
  songId: string, 
  position: number,
  addedBy?: string
): Promise<PlaylistSong> => {
  return prisma.playlistSong.create({
    data: {
      playlist_id: playlistId,
      song_id: songId,
      position,
      added_by: addedBy
    }
  });
};

export const removeSongFromPlaylist = async (
  playlistId: string, 
  songId: string
): Promise<void> => {
  await prisma.playlistSong.deleteMany({
    where: {
      playlist_id: playlistId,
      song_id: songId
    }
  });
};

export const updatePlaylistSongPosition = async (
  id: string,
  position: number
): Promise<PlaylistSong> => {
  return prisma.playlistSong.update({
    where: { id },
    data: { position }
  });
};

// ========== DELETE ==========
export const deletePlaylist = async (id: string): Promise<Playlist> => {
  return prisma.playlist.delete({ where: { id } });
};

export const deletePlaylistSong = async (id: string): Promise<PlaylistSong> => {
  return prisma.playlistSong.delete({ where: { id } });
};

// ========== UTILITY ==========
export const playlistExists = async (id: string): Promise<boolean> => {
  const playlist = await prisma.playlist.findUnique({ where: { id } });
  return playlist !== null;
};

export const countUserPlaylists = async (userId: string): Promise<number> => {
  return prisma.playlist.count({
    where: { user_id: userId }
  });
};

export const getPlaylistSongCount = async (playlistId: string): Promise<number> => {
  return prisma.playlistSong.count({
    where: { playlist_id: playlistId }
  });
};