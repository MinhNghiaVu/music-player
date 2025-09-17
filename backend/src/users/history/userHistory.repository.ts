import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../../database/client';
import type { ListeningHistory, Prisma } from '@prisma/client';

@Injectable()
export class UserHistoryRepo {
  // ========== CREATE ==========
  async createListeningHistory (
    data: Prisma.ListeningHistoryCreateInput
  ): Promise<ListeningHistory> {
    return prisma.listeningHistory.create({ data });
  }

  // ========== READ ==========
  async getListeningHistoryById (
    id: string
  ): Promise<ListeningHistory | null> {
    return prisma.listeningHistory.findUnique({ 
      where: { id },
      include: {
        user: true,
        song: true
      }
    });
  }

  async getListeningHistoryByUserId (
    userId: string
  ): Promise<ListeningHistory[]> {
    return prisma.listeningHistory.findMany({
      where: { user_id: userId },
      include: {
        song: true
      },
      orderBy: { played_at: 'desc' }
    });
  }

  async getListeningHistoryBySongId (
    songId: string
  ): Promise<ListeningHistory[]> {
    return prisma.listeningHistory.findMany({
      where: { song_id: songId },
      include: {
        user: true
      },
      orderBy: { played_at: 'desc' }
    });
  }

  async getRecentListeningHistory (
    userId: string,
    limit: number = 50
  ): Promise<ListeningHistory[]> {
    return prisma.listeningHistory.findMany({
      where: { user_id: userId },
      include: {
        song: true
      },
      orderBy: { played_at: 'desc' },
      take: limit
    });
  }

  // ========== UPDATE ==========
  async updateListeningHistory (
    id: string, 
    data: Prisma.ListeningHistoryUpdateInput
  ): Promise<ListeningHistory> {
    return prisma.listeningHistory.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteListeningHistory (
    id: string
  ): Promise<ListeningHistory> {
    return prisma.listeningHistory.delete({ where: { id } });
  };

  async deleteListeningHistoryByUserId (
    userId: string
  ): Promise<{ count: number }> {
    return prisma.listeningHistory.deleteMany({
      where: { user_id: userId }
    });
  };

  // ========== UTILITY ==========
  async listeningHistoryExists (
    id: string
  ): Promise<boolean> {
    const history = await prisma.listeningHistory.findUnique({ where: { id } });
    return history !== null;
  };

  async countListeningHistory (): Promise<number> {
    return prisma.listeningHistory.count();
  };
}