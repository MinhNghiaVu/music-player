import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { PlaylistSong, Prisma } from '@prisma/client';

@Injectable()
export class PlaylistSongsRepo {
  // ========== CREATE ==========
  async createPlaylistSong (
    data: Prisma.PlaylistSongCreateInput
  ): Promise<PlaylistSong> {
    return prisma.playlistSong.create({ data });
  }

  // ========== READ ==========
  async getPlaylistSongById (
    id: string
  ): Promise<PlaylistSong | null> {
    return prisma.playlistSong.findUnique({ 
      where: { id },
      include: {
        playlist: true,
        song: true,
        added_by_user: true
      }
    });
  }

  async getPlaylistSongsByPlaylistId (
    playlistId: string
  ): Promise<PlaylistSong[]> {
    return prisma.playlistSong.findMany({
      where: { playlist_id: playlistId },
      include: {
        song: true
      },
      orderBy: { position: 'asc' }
    });
  }

  async getPlaylistSongsBySongId (
    songId: string
  ): Promise<PlaylistSong[]> {
    return prisma.playlistSong.findMany({
      where: { song_id: songId },
      include: {
        playlist: true
      },
      orderBy: { added_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updatePlaylistSong (
    id: string, 
    data: Prisma.PlaylistSongUpdateInput
  ): Promise<PlaylistSong> {
    return prisma.playlistSong.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deletePlaylistSong (
    id: string
  ): Promise<PlaylistSong> {
    return prisma.playlistSong.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async playlistSongExists (
    id: string
  ): Promise<boolean> {
    const playlistSong = await prisma.playlistSong.findUnique({ where: { id } });
    return playlistSong !== null;
  };

  async countPlaylistSongs (): Promise<number> {
    return prisma.playlistSong.count();
  };
}
