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
    return prisma.playlistSong.findUnique({ where: { id } });
  }

  async getAllPlaylistSongs (): Promise<PlaylistSong[]> {
    return prisma.playlistSong.findMany({
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
}