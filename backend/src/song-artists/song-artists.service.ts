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
    // Basic validation
    if (!input.song_id) {
      logger.error(`Song ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Song ID is required');
    }

    if (!input.artist_id) {
      logger.error(`Artist ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Artist ID is required');
    }

    const role = input.role || 'main';

    // Check if song artist relationship already exists
    const exists = await this.songArtistsRepo.songArtistExistsBySongAndArtist(
      input.song_id,
      input.artist_id,
      role
    );
    if (exists) {
      logger.error(`Song artist relationship already exists for song ${input.song_id}, artist ${input.artist_id}, role ${role}`);
      throw new Error('Song artist relationship already exists');
    }

    const songArtistData: Prisma.SongArtistCreateInput = {
      song_id: input.song_id,
      artist_id: input.artist_id,
      role: role,
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

  async getSongArtistsBySongId (
    songId: string
  ): Promise<SongArtist[]> {
    if (!songId) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    return this.songArtistsRepo.getSongArtistsBySongId(songId);
  };

  async getSongArtistsByArtistId (
    artistId: string
  ): Promise<SongArtist[]> {
    if (!artistId) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    return this.songArtistsRepo.getSongArtistsByArtistId(artistId);
  };

  async getSongArtistBySongAndArtist (
    songId: string,
    artistId: string,
    role: string = 'main'
  ): Promise<SongArtist | null> {
    if (!songId) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    if (!artistId) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    return this.songArtistsRepo.getSongArtistBySongAndArtist(songId, artistId, role);
  };

  async updateSongArtist (
    id: string,
    input: Prisma.SongArtistUpdateInput
  ): Promise<SongArtist> {
    if (!id) {
      logger.error('Song artist ID is missing or empty');
      throw new Error('Song artist ID is required');
    }

    // Check if song artist relationship exists
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

  async deleteSongArtistBySongAndArtist (
    songId: string,
    artistId: string,
    role: string = 'main'
  ): Promise<SongArtist> {
    if (!songId) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    if (!artistId) {
      logger.error('Artist ID is missing or empty');
      throw new Error('Artist ID is required');
    }

    const exists = await this.songArtistsRepo.songArtistExistsBySongAndArtist(songId, artistId, role);
    if (!exists) {
      logger.error(`Song artist relationship does not exist for song ${songId}, artist ${artistId}, role ${role}`);
      throw new Error('Song artist relationship not found');
    }

    return this.songArtistsRepo.deleteSongArtistBySongAndArtist(songId, artistId, role);
  };
}
