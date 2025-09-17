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
    return prisma.offlineDownload.findUnique({ 
      where: { id },
      include: {
        user: true,
        song: true
      }
    });
  }

  async getOfflineDownloadsByUserId (
    userId: string
  ): Promise<OfflineDownload[]> {
    return prisma.offlineDownload.findMany({
      where: { user_id: userId },
      include: {
        song: true
      },
      orderBy: { downloaded_at: 'desc' }
    });
  }

  async getOfflineDownloadByUserAndSong (
    userId: string,
    songId: string
  ): Promise<OfflineDownload | null> {
    return prisma.offlineDownload.findUnique({
      where: {
        user_id_song_id: {
          user_id: userId,
          song_id: songId
        }
      }
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

  async deleteOfflineDownloadByUserAndSong (
    userId: string,
    songId: string
  ): Promise<OfflineDownload> {
    return prisma.offlineDownload.delete({
      where: {
        user_id_song_id: {
          user_id: userId,
          song_id: songId
        }
      }
    });
  };

  // ========== UTILITY ==========
  async offlineDownloadExists (
    id: string
  ): Promise<boolean> {
    const offlineDownload = await prisma.offlineDownload.findUnique({ where: { id } });
    return offlineDownload !== null;
  };

  async offlineDownloadExistsByUserAndSong (
    userId: string,
    songId: string
  ): Promise<boolean> {
    const offlineDownload = await this.getOfflineDownloadByUserAndSong(userId, songId);
    return offlineDownload !== null;
  };

  async countOfflineDownloads (): Promise<number> {
    return prisma.offlineDownload.count();
  };
}
