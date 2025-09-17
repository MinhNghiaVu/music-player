import { Injectable } from '@nestjs/common';
import { PlaylistsRepo } from './playlists.repository';
import type { Playlist, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistsRepo: PlaylistsRepo) {}

  async createPlaylist(
    input: Prisma.PlaylistCreateInput
  ): Promise<Playlist> {
    if (!input.name) {
      logger.error(`Playlist name is missing in input ${JSON.stringify(input)}`);
      throw new Error('Playlist name is required');
    }

    if (!input.user_id) {
      logger.error(`User ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('User ID is required');
    }

    const playlistData: Prisma.PlaylistCreateInput = {
      name: input.name.trim(),
      description: input.description?.trim(),
      cover_image_url: input.cover_image_url,
      user_id: input.user_id,
      is_public: input.is_public || false,
      is_collaborative: input.is_collaborative || false,
    };

    logger.info(`Creating playlist with data: ${JSON.stringify(playlistData)}`);
    return this.playlistsRepo.createPlaylist(playlistData);
  };

  async getPlaylistById (
    id: string
  ): Promise<Playlist | null> {
    if (!id) {
      logger.error('Playlist ID is missing or empty');
      throw new Error('Playlist ID is required');
    }

    return this.playlistsRepo.getPlaylistById(id);
  };

  async getAllPlaylists (): Promise<Playlist[]> {
    return this.playlistsRepo.getAllPlaylists();
  };

  async updatePlaylist (
    id: string,
    input: Prisma.PlaylistUpdateInput
  ): Promise<Playlist> {
    if (!id) {
      logger.error('Playlist ID is missing or empty');
      throw new Error('Playlist ID is required');
    }

    const exists = await this.playlistsRepo.playlistExists(id);
    if (!exists) {
      logger.error(`Playlist with ID ${id} does not exist`);
      throw new Error('Playlist not found');
    }

    if (input.name !== undefined && !input.name) {
      logger.error(`Invalid playlist name for ID ${id}`);
      throw new Error('Playlist name cannot be empty');
    }

    const updateData: Prisma.PlaylistUpdateInput = {
      ...input,
      updated_at: new Date()
    };

    return this.playlistsRepo.updatePlaylist(id, updateData);
  };

  async deletePlaylist (
    id: string
  ): Promise<Playlist> {
    if (!id) {
      logger.error('Playlist ID is missing or empty');
      throw new Error('Playlist ID is required');
    }

    const exists = await this.playlistsRepo.playlistExists(id);
    if (!exists) {
      logger.error(`Playlist with ID ${id} does not exist`);
      throw new Error('Playlist not found');
    }

    return this.playlistsRepo.deletePlaylist(id);
  };
}
