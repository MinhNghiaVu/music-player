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
    // Basic validation
    if (!input.album_id) {
      logger.error(`Album ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Album ID is required');
    }

    if (!input.artist_id) {
      logger.error(`Artist ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Artist ID is required');
    }

    const role = input.role || 'primary';

    // Check if album artist relationship already exists
    const exists = await this.albumArtistsRepo.albumArtistExistsByAlbumAndArtist(
      input.album_id,
      input.artist_id,
      role
    );
    if (exists) {
      logger.error(`Album artist relationship already exists for album ${input.album_id}, artist ${input.artist_id}, role ${role}`);
      throw new Error('Album artist relationship already exists');
    }

    const albumArtistData: Prisma.AlbumArtistCreateInput = {
      album_id: input.album_id,
      artist_id: input.artist_id,
      role: role,
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

  async getAlbumArtistsByAlbumId (
    albumId: string
  ): Promise<AlbumArtist[]> {
    if (!albumId) {
      logger.error('Album ID is missing or empty');
      throw new Error('Album ID is required');
    }

    return this.albumArtistsRepo.getAlbumArtistsByAlbumId(albumId);
  };

  async getAlbumArtistsByArtistId (
    artistId: string
  ): Promise<AlbumArtist[]> {
    if (!artistId) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    return this.albumArtistsRepo.getAlbumArtistsByArtistId(artistId);
  };

  async getAlbumArtistByAlbumAndArtist (
    albumId: string,
    artistId: string,
    role: string = 'primary'
  ): Promise<AlbumArtist | null> {
    if (!albumId) {
      logger.error('Album ID is missing or empty');
      throw new Error('Album ID is required');
    }

    if (!artistId) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    return this.albumArtistsRepo.getAlbumArtistByAlbumAndArtist(albumId, artistId, role);
  };

  async updateAlbumArtist (
    id: string,
    input: Prisma.AlbumArtistUpdateInput
  ): Promise<AlbumArtist> {
    if (!id) {
      logger.error('Album artist ID is missing or empty');
      throw new Error('Album artist ID is required');
    }

    // Check if album artist relationship exists
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

  async deleteAlbumArtistByAlbumAndArtist (
    albumId: string,
    artistId: string,
    role: string = 'primary'
  ): Promise<AlbumArtist> {
    if (!albumId) {
      logger.error('Album ID is missing or empty');
      throw new Error('Album ID is required');
    }

    if (!artistId) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    const exists = await this.albumArtistsRepo.albumArtistExistsByAlbumAndArtist(albumId, artistId, role);
    if (!exists) {
      logger.error(`Album artist relationship does not exist for album ${albumId}, artist ${artistId}, role ${role}`);
      throw new Error('Album artist relationship not found');
    }

    return this.albumArtistsRepo.deleteAlbumArtistByAlbumAndArtist(albumId, artistId, role);
  };
}
