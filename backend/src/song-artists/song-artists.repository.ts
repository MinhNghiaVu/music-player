import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { SongArtist, Prisma } from '@prisma/client';

@Injectable()
export class SongArtistsRepo {
  // ========== CREATE ==========
  async createSongArtist (
    data: Prisma.SongArtistCreateInput
  ): Promise<SongArtist> {
    return prisma.songArtist.create({ data });
  }

  // ========== READ ==========
  async getSongArtistById (
    id: string
  ): Promise<SongArtist | null> {
    return prisma.songArtist.findUnique({ where: { id } });
  }

  async getAllSongArtists (): Promise<SongArtist[]> {
    return prisma.songArtist.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updateSongArtist (
    id: string, 
    data: Prisma.SongArtistUpdateInput
  ): Promise<SongArtist> {
    return prisma.songArtist.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteSongArtist (
    id: string
  ): Promise<SongArtist> {
    return prisma.songArtist.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async songArtistExists (
    id: string
  ): Promise<boolean> {
    const songArtist = await prisma.songArtist.findUnique({ where: { id } });
    return songArtist !== null;
  };
}