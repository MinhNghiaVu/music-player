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
    if (!input.user_id) {
      logger.error(`User ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('User ID is required');
    }

    if (!input.song_id) {
      logger.error(`Song ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Song ID is required');
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

  async getAllOfflineDownloads (): Promise<OfflineDownload[]> {
    return this.offlineDownloadsRepo.getAllOfflineDownloads();
  };

  async updateOfflineDownload (
    id: string,
    input: Prisma.OfflineDownloadUpdateInput
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
}