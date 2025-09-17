import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { Playlist, Prisma } from '@prisma/client';

@Injectable()
export class PlaylistsRepo {
  // ========== CREATE ==========
  async createPlaylist (
    data: Prisma.PlaylistCreateInput
  ): Promise<Playlist> {
    return prisma.playlist.create({ data });
  }

  // ========== READ ==========
  async getPlaylistById (
    id: string
  ): Promise<Playlist | null> {
    return prisma.playlist.findUnique({ where: { id } });
  }

  async getAllPlaylists (): Promise<Playlist[]> {
    return prisma.playlist.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  async getPlaylistsByUserId (userId: string): Promise<Playlist[]> {
    return prisma.playlist.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
  }

  async getPublicPlaylists (): Promise<Playlist[]> {
    return prisma.playlist.findMany({
      where: { is_public: true },
      orderBy: { created_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updatePlaylist (
    id: string, 
    data: Prisma.PlaylistUpdateInput
  ): Promise<Playlist> {
    return prisma.playlist.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deletePlaylist (
    id: string
  ): Promise<Playlist> {
    return prisma.playlist.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async playlistExists (
    id: string
  ): Promise<boolean> {
    const playlist = await prisma.playlist.findUnique({ where: { id } });
    return playlist !== null;
  };

  async countPlaylists (): Promise<number> {
    return prisma.playlist.count();
  };
}