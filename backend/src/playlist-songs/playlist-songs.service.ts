import { Injectable } from '@nestjs/common';
import { PlaylistSongsRepo } from './playlist-songs.repository';
import type { PlaylistSong, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class PlaylistSongsService {
  constructor(private readonly playlistSongsRepo: PlaylistSongsRepo) {}

  async createPlaylistSong(
    input: Prisma.PlaylistSongCreateInput
  ): Promise<PlaylistSong> {
    if (!input.playlist_id) {
      logger.error(`Playlist ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Playlist ID is required');
    }

    if (!input.song_id) {
      logger.error(`Song ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Song ID is required');
    }

    if (input.position === undefined || input.position < 0) {
      logger.error(`Invalid position ${input.position} in input ${JSON.stringify(input)}`);
      throw new Error('Position must be a non-negative number');
    }

    const playlistSongData: Prisma.PlaylistSongCreateInput = {
      playlist_id: input.playlist_id,
      song_id: input.song_id,
      position: input.position,
      added_by: input.added_by,
    };

    logger.info(`Creating playlist song with data: ${JSON.stringify(playlistSongData)}`);
    return this.playlistSongsRepo.createPlaylistSong(playlistSongData);
  };

  async getPlaylistSongById (
    id: string
  ): Promise<PlaylistSong | null> {
    if (!id) {
      logger.error('Playlist song ID is missing or empty');
      throw new Error('Playlist song ID is required');
    }

    return this.playlistSongsRepo.getPlaylistSongById(id);
  };

  async getAllPlaylistSongs (): Promise<PlaylistSong[]> {
    return this.playlistSongsRepo.getAllPlaylistSongs();
  };

  async updatePlaylistSong (
    id: string,
    input: Prisma.PlaylistSongUpdateInput
  ): Promise<PlaylistSong> {
    if (!id) {
      logger.error('Playlist song ID is missing or empty');
      throw new Error('Playlist song ID is required');
    }

    const exists = await this.playlistSongsRepo.playlistSongExists(id);
    if (!exists) {
      logger.error(`Playlist song with ID ${id} does not exist`);
      throw new Error('Playlist song not found');
    }

    return this.playlistSongsRepo.updatePlaylistSong(id, input);
  };

  async deletePlaylistSong (
    id: string
  ): Promise<PlaylistSong> {
    if (!id) {
      logger.error('Playlist song ID is missing or empty');
      throw new Error('Playlist song ID is required');
    }

    const exists = await this.playlistSongsRepo.playlistSongExists(id);
    if (!exists) {
      logger.error(`Playlist song with ID ${id} does not exist`);
      throw new Error('Playlist song not found');
    }

    return this.playlistSongsRepo.deletePlaylistSong(id);
  };
}