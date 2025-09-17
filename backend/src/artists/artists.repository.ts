
import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { Artist, Prisma } from '@prisma/client';

@Injectable()
export class ArtistsRepo {
  // ========== CREATE ==========
  async createArtist (
    data: Prisma.ArtistCreateInput
  ): Promise<Artist> {
    return prisma.artist.create({ data });
  }

  // ========== READ ==========
  async getArtistById (
    id: string
  ): Promise<Artist | null> {
    return prisma.artist.findUnique({ where: { id } });
  }

  async getAllArtists (): Promise<Artist[]> {
    return prisma.artist.findMany({
      orderBy: { name: 'asc' }
    });
  }

  // ========== UPDATE ==========
  async updateArtist (
    id: string, 
    data: Prisma.ArtistUpdateInput
  ): Promise<Artist> {
    return prisma.artist.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteArtist (
    id: string
  ): Promise<Artist> {
    return prisma.artist.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async artistExists (
    id: string
  ): Promise<boolean> {
    const artist = await prisma.artist.findUnique({ where: { id } });
    return artist !== null;
  };

  async countArtists (): Promise<number> {
    return prisma.artist.count();
  };
}
