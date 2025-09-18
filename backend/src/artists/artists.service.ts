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
    // Basic validation
    if (!input.name) {
      logger.error(`Artist name is missing in input ${JSON.stringify(input)}`);
      throw new Error('Artist name is required');
    }

    const artistData: Prisma.ArtistCreateInput = {
      name: input.name.trim(),
      bio: input.bio?.trim(),
      profile_image_url: input.profile_image_url,
      banner_image_url: input.banner_image_url,
      verified: input.verified || false,
      country_code: input.country_code,
      genres: input.genres || [],
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

    // Validate name if provided
    if (input.name !== undefined && !input.name) {
      logger.error(`Invalid artist name for ID ${id}`);
      throw new Error('Artist name cannot be empty');
    }

    const updateData: Prisma.ArtistUpdateInput = {
      ...(input.name && { name: input.name }),
      ...(input.bio !== undefined && { bio: input.bio }),
      ...(input.profile_image_url !== undefined && { profile_image_url: input.profile_image_url }),
      ...(input.banner_image_url !== undefined && { banner_image_url: input.banner_image_url }),
      ...(input.verified !== undefined && { verified: input.verified }),
      ...(input.country_code !== undefined && { country_code: input.country_code }),
      ...(input.genres !== undefined && { genres: input.genres }),
      updated_at: new Date()
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
