import { Injectable } from '@nestjs/common';
import { OfflineDownloadsRepo } from './offline-downloads.repository';
import type { OfflineDownload, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class OfflineDownloadsService {
  constructor(private readonly offlineDownloadsRepo: OfflineDownloadsRepo) {}

  async createOfflineDownload(
    input: Prisma.OfflineDownloadCreateInput
  ): Promise<OfflineDownload> {
    // Basic validation
    if (!input.user_id) {
      logger.error(`User ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('User ID is required');
    }

    if (!input.song_id) {
      logger.error(`Song ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Song ID is required');
    }

    // Check if offline download already exists
    const exists = await this.offlineDownloadsRepo.offlineDownloadExistsByUserAndSong(
      input.user_id,
      input.song_id
    );
    if (exists) {
      logger.error(`Offline download already exists for user ${input.user_id}, song ${input.song_id}`);
      throw new Error('Offline download already exists');
    }

    const offlineDownloadData: Prisma.OfflineDownloadCreateInput = {
      user_id: input.user_id,
      song_id: input.song_id,
      download_quality: input.download_quality || 'normal',
      expires_at: input.expires_at,
      file_size_bytes: input.file_size_bytes,
    };

    logger.info(`Creating offline download with data: ${JSON.stringify(offlineDownloadData)}`);

    return this.offlineDownloadsRepo.createOfflineDownload(offlineDownloadData);
  };

  async getOfflineDownloadById (
    id: string
  ): Promise<OfflineDownload | null> {
    if (!id) {
      logger.error('Offline download ID is missing or empty');
      throw new Error('Offline download ID is required');
    }

    return this.offlineDownloadsRepo.getOfflineDownloadById(id);
  };

  async getOfflineDownloadsByUserId (
    userId: string
  ): Promise<OfflineDownload[]> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    return this.offlineDownloadsRepo.getOfflineDownloadsByUserId(userId);
  };

  async getOfflineDownloadByUserAndSong (
    userId: string,
    songId: string
  ): Promise<OfflineDownload | null> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!songId) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    return this.offlineDownloadsRepo.getOfflineDownloadByUserAndSong(userId, songId);
  };

  async updateOfflineDownload (
    id: string,
    input: Prisma.OfflineDownloadUpdateInput
  ): Promise<OfflineDownload> {
    if (!id) {
      logger.error('Offline download ID is missing or empty');
      throw new Error('Offline download ID is required');
    }

    // Check if offline download exists
    const exists = await this.offlineDownloadsRepo.offlineDownloadExists(id);
    if (!exists) {
      logger.error(`Offline download with ID ${id} does not exist`);
      throw new Error('Offline download not found');
    }

    return this.offlineDownloadsRepo.updateOfflineDownload(id, input);
  };

  async deleteOfflineDownload (
    id: string
  ): Promise<OfflineDownload> {
    if (!id) {
      logger.error('Offline download ID is missing or empty');
      throw new Error('Offline download ID is required');
    }

    const exists = await this.offlineDownloadsRepo.offlineDownloadExists(id);
    if (!exists) {
      logger.error(`Offline download with ID ${id} does not exist`);
      throw new Error('Offline download not found');
    }

    return this.offlineDownloadsRepo.deleteOfflineDownload(id);
  };

  async deleteOfflineDownloadByUserAndSong (
    userId: string,
    songId: string
  ): Promise<OfflineDownload> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (!songId) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    const exists = await this.offlineDownloadsRepo.offlineDownloadExistsByUserAndSong(userId, songId);
    if (!exists) {
      logger.error(`Offline download does not exist for user ${userId}, song ${songId}`);
      throw new Error('Offline download not found');
    }

    return this.offlineDownloadsRepo.deleteOfflineDownloadByUserAndSong(userId, songId);
  };
}
