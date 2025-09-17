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
    // Basic validation
    if (!input.name) {
      logger.error(`Genre name is missing in input ${JSON.stringify(input)}`);
      throw new Error('Genre name is required');
    }

    // Check if genre name already exists
    const nameExists = await this.genresRepo.genreNameExists(input.name);
    if (nameExists) {
      logger.error(`Genre name ${input.name} already exists`);
      throw new Error('Genre name already exists');
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

  async getGenreByName (
    name: string
  ): Promise<Genre | null> {
    if (!name) {
      logger.error('Genre name is missing or empty');
      throw new Error('Genre name is required');
    }

    return this.genresRepo.getGenreByName(name.trim());
  };

  async getAllGenres (): Promise<Genre[]> {
    return this.genresRepo.getAllGenres();
  };

  async getParentGenres (): Promise<Genre[]> {
    return this.genresRepo.getParentGenres();
  };

  async getSubGenresByParentId (parentId: string): Promise<Genre[]> {
    if (!parentId) {
      logger.error('Parent genre ID is missing or empty');
      throw new Error('Parent genre ID is required');
    }

    return this.genresRepo.getSubGenresByParentId(parentId);
  };

  async updateGenre (
    id: string,
    input: Prisma.GenreUpdateInput
  ): Promise<Genre> {
    if (!id) {
      logger.error('Genre ID is missing or empty');
      throw new Error('Genre ID is required');
    }

    // Check if genre exists
    const exists = await this.genresRepo.genreExists(id);
    if (!exists) {
      logger.error(`Genre with ID ${id} does not exist`);
      throw new Error('Genre not found');
    }

    // Validate name if provided
    if (input.name !== undefined && !input.name) {
      logger.error(`Invalid genre name for ID ${id}`);
      throw new Error('Genre name cannot be empty');
    }

    // Check if new name already exists (if changing name)
    if (input.name) {
      const nameExists = await this.genresRepo.genreNameExists(input.name);
      if (nameExists) {
        const existingGenre = await this.genresRepo.getGenreByName(input.name);
        if (existingGenre && existingGenre.id !== id) {
          logger.error(`Genre name ${input.name} already exists for another genre`);
          throw new Error('Genre name already exists');
        }
      }
    }

    const updateData: Prisma.GenreUpdateInput = {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.parent_genre_id !== undefined && { parent_genre_id: input.parent_genre_id }),
    };

    return this.genresRepo.updateGenre(id, updateData);
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
