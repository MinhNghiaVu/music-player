import { Injectable } from '@nestjs/common';
import { AlbumArtistsRepo } from './album-artists.repository';
import type { AlbumArtist, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class AlbumArtistsService {
  constructor(private readonly albumArtistsRepo: AlbumArtistsRepo) {}

  async createAlbumArtist(
    input: Prisma.AlbumArtistCreateInput
  ): Promise<AlbumArtist> {
    if (!input.album_id) {
      logger.error(`Album ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Album ID is required');
    }

    if (!input.artist_id) {
      logger.error(`Artist ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Artist ID is required');
    }

    const albumArtistData: Prisma.AlbumArtistCreateInput = {
      album_id: input.album_id,
      artist_id: input.artist_id,
      role: input.role || 'primary',
    };

    logger.info(`Creating album artist relationship with data: ${JSON.stringify(albumArtistData)}`);
    return this.albumArtistsRepo.createAlbumArtist(albumArtistData);
  };

  async getAlbumArtistById (
    id: string
  ): Promise<AlbumArtist | null> {
    if (!id) {
      logger.error('Album artist ID is missing or empty');
      throw new Error('Album artist ID is required');
    }

    return this.albumArtistsRepo.getAlbumArtistById(id);
  };

  async getAllAlbumArtists (): Promise<AlbumArtist[]> {
    return this.albumArtistsRepo.getAllAlbumArtists();
  };

  async updateAlbumArtist (
    id: string,
    input: Prisma.AlbumArtistUpdateInput
  ): Promise<AlbumArtist> {
    if (!id) {
      logger.error('Album artist ID is missing or empty');
      throw new Error('Album artist ID is required');
    }

    const exists = await this.albumArtistsRepo.albumArtistExists(id);
    if (!exists) {
      logger.error(`Album artist relationship with ID ${id} does not exist`);
      throw new Error('Album artist relationship not found');
    }

    return this.albumArtistsRepo.updateAlbumArtist(id, input);
  };

  async deleteAlbumArtist (
    id: string
  ): Promise<AlbumArtist> {
    if (!id) {
      logger.error('Album artist ID is missing or empty');
      throw new Error('Album artist ID is required');
    }

    const exists = await this.albumArtistsRepo.albumArtistExists(id);
    if (!exists) {
      logger.error(`Album artist relationship with ID ${id} does not exist`);
      throw new Error('Album artist relationship not found');
    }

    return this.albumArtistsRepo.deleteAlbumArtist(id);
  };
}