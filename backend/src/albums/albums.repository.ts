import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { Album, Prisma } from '@prisma/client';

@Injectable
export class albumRepo {
  // ========== CREATE ==========
  async createAlbum (
    data: Prisma.AlbumCreateInput
  ): Promise<Album> {
    return prisma.album.create({ data });
  }

  // ========== READ ==========
  async getAlbumById (
    id: string
  ): Promise<Album | null> {
    return prisma.album.findUnique({ where: { id } });
  }

  async getAllAlbums (): Promise<Album[]> {
    return prisma.album.findMany({
      orderBy: { release_date: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updateAlbum (
    id: string, 
    data: Prisma.AlbumUpdateInput
  ): Promise<Album> {
    return prisma.album.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteAlbum (
    id: string
  ): Promise<Album> {
    return prisma.album.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async albumExists (
    id: string
  ): Promise<boolean> {
    const album = await prisma.album.findUnique({ where: { id } });
    return album !== null;
  };

  export const countAlbums = async (): Promise<number> => {
    return prisma.album.count();
  };
}
