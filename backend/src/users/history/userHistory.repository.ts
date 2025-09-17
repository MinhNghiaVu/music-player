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
    return prisma.listeningHistory.findUnique({ where: { id } });
  }

  async getAllListeningHistory (): Promise<ListeningHistory[]> {
    return prisma.listeningHistory.findMany({
      orderBy: { played_at: 'desc' }
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

  // ========== UTILITY ==========
  async listeningHistoryExists (
    id: string
  ): Promise<boolean> {
    const history = await prisma.listeningHistory.findUnique({ where: { id } });
    return history !== null;
  };
}