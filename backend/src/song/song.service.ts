import { Injectable } from '@nestjs/common';
import { SongsRepo } from './song.repository';
import type { Song, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class SongsService {
  constructor(private readonly songsRepo: SongsRepo) {}

  async createSong(
    input: Prisma.SongCreateInput
  ): Promise<Song> {
    // Basic validation
    if (!input.title) {
      logger.error(`Song title is missing in input ${JSON.stringify(input)}`);
      throw new Error('Song title is required');
    }

    if (!input.duration_seconds || input.duration_seconds <= 0) {
      logger.error(`Invalid duration for song ${input.title}`);
      throw new Error('Song duration must be greater than 0');
    }

    const songData: Prisma.SongCreateInput = {
      title: input.title.trim(),
      duration_seconds: input.duration_seconds,
      album_id: input.album_id,
      audio_url: input.audio_url,
      preview_url: input.preview_url,
      genres: input.genres || [],
      release_date: input.release_date,
    };

    logger.info(`Creating song with data: ${JSON.stringify(songData)}`);

    return this.songsRepo.createSong(songData);
  };

  async getSongById (
    id: string
  ): Promise<Song | null> {
    if (!id) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    return this.songsRepo.getSongById(id);
  };

  async getAllSongs (): Promise<Song[]> {
    return this.songsRepo.getAllSongs();
  };

  async getSongsByAlbumId (albumId: string): Promise<Song[]> {
    if (!albumId) {
      logger.error('Album ID is missing or empty');
      throw new Error('Album ID is required');
    }

    return this.songsRepo.getSongsByAlbumId(albumId);
  };

  async updateSong (
    id: string,
    input: Prisma.SongUpdateInput
  ): Promise<Song> {
    if (!id) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    // Check if song exists
    const exists = await this.songsRepo.songExists(id);
    if (!exists) {
      logger.error(`Song with ID ${id} does not exist`);
      throw new Error('Song not found');
    }

    // Validate title if provided
    if (input.title !== undefined && !input.title) {
      logger.error(`Invalid song title for ID ${id}`);
      throw new Error('Song title cannot be empty');
    }

    // Validate duration if provided
    if (input.duration_seconds !== undefined && input.duration_seconds <= 0) {
      logger.error(`Invalid duration for song ID ${id}`);
      throw new Error('Song duration must be greater than 0');
    }

    const updateData: Prisma.SongUpdateInput = {
      ...(input.title && { title: input.title }),
      ...(input.duration_seconds && { duration_seconds: input.duration_seconds }),
      ...(input.album_id !== undefined && { album_id: input.album_id }),
      ...(input.audio_url !== undefined && { audio_url: input.audio_url }),
      ...(input.preview_url !== undefined && { preview_url: input.preview_url }),
      ...(input.genres && { genres: input.genres }),
      ...(input.release_date && { release_date: input.release_date }),
      updated_at: new Date()
    };

    return this.songsRepo.updateSong(id, updateData);
  };

  async deleteSong (
    id: string
  ): Promise<Song> {
    if (!id) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    const exists = await this.songsRepo.songExists(id);
    if (!exists) {
      logger.error(`Song with ID ${id} does not exist`);
      throw new Error('Song not found');
    }

    return this.songsRepo.deleteSong(id);
  };
}