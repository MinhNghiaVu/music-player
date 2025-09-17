import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { Genre, Prisma } from '@prisma/client';

@Injectable()
export class GenresRepo {
  // ========== CREATE ==========
  async createGenre (
    data: Prisma.GenreCreateInput
  ): Promise<Genre> {
    return prisma.genre.create({ data });
  }

  // ========== READ ==========
  async getGenreById (
    id: string
  ): Promise<Genre | null> {
    return prisma.genre.findUnique({ where: { id } });
  }

  async getAllGenres (): Promise<Genre[]> {
    return prisma.genre.findMany({
      orderBy: { name: 'asc' }
    });
  }

  // ========== UPDATE ==========
  async updateGenre (
    id: string, 
    data: Prisma.GenreUpdateInput
  ): Promise<Genre> {
    return prisma.genre.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteGenre (
    id: string
  ): Promise<Genre> {
    return prisma.genre.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async genreExists (
    id: string
  ): Promise<boolean> {
    const genre = await prisma.genre.findUnique({ where: { id } });
    return genre !== null;
  };
}