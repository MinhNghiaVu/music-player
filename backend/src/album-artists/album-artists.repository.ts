import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { AlbumArtist, Prisma } from '@prisma/client';

@Injectable()
export class AlbumArtistsRepo {
  // ========== CREATE ==========
  async createAlbumArtist (
    data: Prisma.AlbumArtistCreateInput
  ): Promise<AlbumArtist> {
    return prisma.albumArtist.create({ data });
  }

  // ========== READ ==========
  async getAlbumArtistById (
    id: string
  ): Promise<AlbumArtist | null> {
    return prisma.albumArtist.findUnique({ where: { id } });
  }

  async getAllAlbumArtists (): Promise<AlbumArtist[]> {
    return prisma.albumArtist.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updateAlbumArtist (
    id: string, 
    data: Prisma.AlbumArtistUpdateInput
  ): Promise<AlbumArtist> {
    return prisma.albumArtist.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteAlbumArtist (
    id: string
  ): Promise<AlbumArtist> {
    return prisma.albumArtist.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async albumArtistExists (
    id: string
  ): Promise<boolean> {
    const albumArtist = await prisma.albumArtist.findUnique({ where: { id } });
    return albumArtist !== null;
  };
}