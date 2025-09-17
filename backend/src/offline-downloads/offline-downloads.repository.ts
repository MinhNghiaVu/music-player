import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { OfflineDownload, Prisma } from '@prisma/client';

@Injectable()
export class OfflineDownloadsRepo {
  // ========== CREATE ==========
  async createOfflineDownload (
    data: Prisma.OfflineDownloadCreateInput
  ): Promise<OfflineDownload> {
    return prisma.offlineDownload.create({ data });
  }

  // ========== READ ==========
  async getOfflineDownloadById (
    id: string
  ): Promise<OfflineDownload | null> {
    return prisma.offlineDownload.findUnique({ where: { id } });
  }

  async getAllOfflineDownloads (): Promise<OfflineDownload[]> {
    return prisma.offlineDownload.findMany({
      orderBy: { downloaded_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updateOfflineDownload (
    id: string, 
    data: Prisma.OfflineDownloadUpdateInput
  ): Promise<OfflineDownload> {
    return prisma.offlineDownload.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteOfflineDownload (
    id: string
  ): Promise<OfflineDownload> {
    return prisma.offlineDownload.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async offlineDownloadExists (
    id: string
  ): Promise<boolean> {
    const offlineDownload = await prisma.offlineDownload.findUnique({ where: { id } });
    return offlineDownload !== null;
  };
}