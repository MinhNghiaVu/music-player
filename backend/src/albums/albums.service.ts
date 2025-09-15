
import { Injectable } from '@nestjs/common';
import { AlbumsRepo } from './albums.repository';
import type { Album, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumsRepo: AlbumsRepo) {}

  async createAlbum(
    input: Prisma.AlbumCreateInput
  ): Promise<Album> {
    // Basic validation
    if (!input.title) {
      logger.error(`Album title is missing in input ${JSON.stringify(input)}`);
      throw new Error('Album title is required');
    }

    const albumData: Prisma.AlbumCreateInput = {
      title: input.title.trim(),
      description: input.description?.trim(),
      release_date: input.release_date,
      genres: input.genres || [],
      cover_image_url: input.cover_image_url,
    };

    logger.info(`Creating album with data: ${JSON.stringify(albumData)}`);

    return this.albumsRepo.createAlbum(albumData);
  };

  async getAlbumById (
    id: string
  ): Promise<Album | null> {
    if (!id) {
      logger.error('Album ID is missing or empty');
      throw new Error('Album ID is required');
    }

    return this.albumsRepo.getAlbumById(id);
  };

  async getAllAlbums (): Promise<Album[]> {
    return this.albumsRepo.getAllAlbums();
  };

  async updateAlbum (
    id: string,
    input: Prisma.AlbumUpdateInput
  ): Promise<Album> {
    if (!id) {
      logger.error('Album ID is missing or empty');
      throw new Error('Album ID is required');
    }

    // Check if album exists
    const exists = await this.albumsRepo.albumExists(id);
    if (!exists) {
      logger.error(`Album with ID ${id} does not exist`);
      throw new Error('Album not found');
    }

    // Validate title if provided
    if (input.title !== undefined && !input.title) {
      logger.error(`Invalid album title for ID ${id}`);
      throw new Error('Album title cannot be empty');
    }

    const updateData: Prisma.AlbumUpdateInput = {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.release_date && { release_date: input.release_date }),
      ...(input.genres && { genres: input.genres }),
      ...(input.cover_image_url !== undefined && { cover_image_url: input.cover_image_url }),
      updated_at: new Date()
    };

    return this.albumsRepo.updateAlbum(id, updateData);
  };

  async deleteAlbum (
    id: string
  ): Promise<Album> {
    if (!id) {
      logger.error('Album ID is missing or empty');
      throw new Error('Album ID is required');
    }

    const exists = await this.albumsRepo.albumExists(id);
    if (!exists) {
      logger.error(`Album with ID ${id} does not exist`);
      throw new Error('Album not found');
    }

    return this.albumsRepo.deleteAlbum(id);
  };
}