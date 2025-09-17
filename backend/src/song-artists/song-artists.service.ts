import { Injectable } from '@nestjs/common';
import { SongArtistsRepo } from './song-artists.repository';
import type { SongArtist, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class SongArtistsService {
  constructor(private readonly songArtistsRepo: SongArtistsRepo) {}

  async createSongArtist(
    input: Prisma.SongArtistCreateInput
  ): Promise<SongArtist> {
    if (!input.song_id) {
      logger.error(`Song ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Song ID is required');
    }

    if (!input.artist_id) {
      logger.error(`Artist ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Artist ID is required');
    }

    const songArtistData: Prisma.SongArtistCreateInput = {
      song_id: input.song_id,
      artist_id: input.artist_id,
      role: input.role || 'main',
    };

    logger.info(`Creating song artist relationship with data: ${JSON.stringify(songArtistData)}`);
    return this.songArtistsRepo.createSongArtist(songArtistData);
  };

  async getSongArtistById (
    id: string
  ): Promise<SongArtist | null> {
    if (!id) {
      logger.error('Song artist ID is missing or empty');
      throw new Error('Song artist ID is required');
    }

    return this.songArtistsRepo.getSongArtistById(id);
  };

  async getAllSongArtists (): Promise<SongArtist[]> {
    return this.songArtistsRepo.getAllSongArtists();
  };

  async updateSongArtist (
    id: string,
    input: Prisma.SongArtistUpdateInput
  ): Promise<SongArtist> {
    if (!id) {
      logger.error('Song artist ID is missing or empty');
      throw new Error('Song artist ID is required');
    }

    const exists = await this.songArtistsRepo.songArtistExists(id);
    if (!exists) {
      logger.error(`Song artist relationship with ID ${id} does not exist`);
      throw new Error('Song artist relationship not found');
    }

    return this.songArtistsRepo.updateSongArtist(id, input);
  };

  async deleteSongArtist (
    id: string
  ): Promise<SongArtist> {
    if (!id) {
      logger.error('Song artist ID is missing or empty');
      throw new Error('Song artist ID is required');
    }

    const exists = await this.songArtistsRepo.songArtistExists(id);
    if (!exists) {
      logger.error(`Song artist relationship with ID ${id} does not exist`);
      throw new Error('Song artist relationship not found');
    }

    return this.songArtistsRepo.deleteSongArtist(id);
  };
}