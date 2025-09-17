import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { Song, Prisma } from '@prisma/client';

@Injectable()
export class SongsRepo {
  // ========== CREATE ==========
  async createSong (
    data: Prisma.SongCreateInput
  ): Promise<Song> {
    return prisma.song.create({ data });
  }

  // ========== READ ==========
  async getSongById (
    id: string
  ): Promise<Song | null> {
    return prisma.song.findUnique({ where: { id } });
  }

  async getAllSongs (): Promise<Song[]> {
    return prisma.song.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updateSong (
    id: string, 
    data: Prisma.SongUpdateInput
  ): Promise<Song> {
    return prisma.song.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteSong (
    id: string
  ): Promise<Song> {
    return prisma.song.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async songExists (
    id: string
  ): Promise<boolean> {
    const song = await prisma.song.findUnique({ where: { id } });
    return song !== null;
  };
}