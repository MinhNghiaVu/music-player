import { Injectable } from '@nestjs/common';
import { GenresRepo } from './genres.repository';
import type { Genre, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class GenresService {
  constructor(private readonly genresRepo: GenresRepo) {}

  async createGenre(
    input: Prisma.GenreCreateInput
  ): Promise<Genre> {
    if (!input.name) {
      logger.error(`Genre name is missing in input ${JSON.stringify(input)}`);
      throw new Error('Genre name is required');
    }

    const genreData: Prisma.GenreCreateInput = {
      name: input.name.trim(),
      description: input.description?.trim(),
      parent_genre_id: input.parent_genre_id,
    };

    logger.info(`Creating genre with data: ${JSON.stringify(genreData)}`);
    return this.genresRepo.createGenre(genreData);
  };

  async getGenreById (
    id: string
  ): Promise<Genre | null> {
    if (!id) {
      logger.error('Genre ID is missing or empty');
      throw new Error('Genre ID is required');
    }

    return this.genresRepo.getGenreById(id);
  };

  async getAllGenres (): Promise<Genre[]> {
    return this.genresRepo.getAllGenres();
  };

  async updateGenre (
    id: string,
    input: Prisma.GenreUpdateInput
  ): Promise<Genre> {
    if (!id) {
      logger.error('Genre ID is missing or empty');
      throw new Error('Genre ID is required');
    }

    const exists = await this.genresRepo.genreExists(id);
    if (!exists) {
      logger.error(`Genre with ID ${id} does not exist`);
      throw new Error('Genre not found');
    }

    if (input.name !== undefined && !input.name) {
      logger.error(`Invalid genre name for ID ${id}`);
      throw new Error('Genre name cannot be empty');
    }

    return this.genresRepo.updateGenre(id, input);
  };

  async deleteGenre (
    id: string
  ): Promise<Genre> {
    if (!id) {
      logger.error('Genre ID is missing or empty');
      throw new Error('Genre ID is required');
    }

    const exists = await this.genresRepo.genreExists(id);
    if (!exists) {
      logger.error(`Genre with ID ${id} does not exist`);
      throw new Error('Genre not found');
    }

    return this.genresRepo.deleteGenre(id);
  };
}