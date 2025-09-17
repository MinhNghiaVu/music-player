import { Injectable } from '@nestjs/common';
import { ArtistsRepo } from './artists.repository';
import type { Artist, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class ArtistsService {
  constructor(private readonly artistsRepo: ArtistsRepo) {}

  async createArtist(
    input: Prisma.ArtistCreateInput
  ): Promise<Artist> {

    const artistData: Prisma.ArtistCreateInput = {
      // TODO: Apply create data
    };
    
    logger.info(`Creating artist with data: ${JSON.stringify(artistData)}`);

    return this.artistsRepo.createArtist(artistData);
  };

  async getArtistById (
    id: string
  ): Promise<Artist | null> {
    if (!id) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    return this.artistsRepo.getArtistById(id);
  };

  async getAllArtists (): Promise<Artist[]> {
    return this.artistsRepo.getAllArtists();
  };

  async updateArtist (
    id: string,
    input: Prisma.ArtistUpdateInput
  ): Promise<Artist> {
    if (!id) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    // Check if artist exists
    const exists = await this.artistsRepo.artistExists(id);
    if (!exists) {
      logger.error(`Artist with ID ${id} does not exist`);
      throw new Error('Artist not found');
    }

    const updateData: Prisma.ArtistUpdateInput = {
      // TODO: Apply update data for artists
    };

    return this.artistsRepo.updateArtist(id, updateData);
  };

  async deleteArtist (
    id: string
  ): Promise<Artist> {
    if (!id) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    const exists = await this.artistsRepo.artistExists(id);
    if (!exists) {
      logger.error(`Artist with ID ${id} does not exist`);
      throw new Error('Artist not found');
    }

    return this.artistsRepo.deleteArtist(id);
  };
}
