import { Injectable } from '@nestjs/common';
import { UserHistoryRepo } from './userHistory.repository';
import type { ListeningHistory, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class UserHistoryService {
  constructor(private readonly userHistoryRepo: UserHistoryRepo) {}

  async createListeningHistory(
    input: Prisma.ListeningHistoryCreateInput
  ): Promise<ListeningHistory> {
    if (!input.user_id) {
      logger.error(`User ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('User ID is required');
    }

    if (!input.song_id) {
      logger.error(`Song ID is missing in input ${JSON.stringify(input)}`);
      throw new Error('Song ID is required');
    }

    const historyData: Prisma.ListeningHistoryCreateInput = {
      user_id: input.user_id,
      song_id: input.song_id,
      play_duration_seconds: input.play_duration_seconds,
      completed: input.completed || false,
      device_type: input.device_type,
      source: input.source,
      source_id: input.source_id,
    };

    logger.info(`Creating listening history with data: ${JSON.stringify(historyData)}`);
    return this.userHistoryRepo.createListeningHistory(historyData);
  };

  async getListeningHistoryById (
    id: string
  ): Promise<ListeningHistory | null> {
    if (!id) {
      logger.error('Listening history ID is missing or empty');
      throw new Error('Listening history ID is required');
    }

    return this.userHistoryRepo.getListeningHistoryById(id);
  };

  async getAllListeningHistory (): Promise<ListeningHistory[]> {
    return this.userHistoryRepo.getAllListeningHistory();
  };

  async updateListeningHistory (
    id: string,
    input: Prisma.ListeningHistoryUpdateInput
  ): Promise<ListeningHistory> {
    if (!id) {
      logger.error('Listening history ID is missing or empty');
      throw new Error('Listening history ID is required');
    }

    const exists = await this.userHistoryRepo.listeningHistoryExists(id);
    if (!exists) {
      logger.error(`Listening history with ID ${id} does not exist`);
      throw new Error('Listening history not found');
    }

    return this.userHistoryRepo.updateListeningHistory(id, input);
  };

  async deleteListeningHistory (
    id: string
  ): Promise<ListeningHistory> {
    if (!id) {
      logger.error('Listening history ID is missing or empty');
      throw new Error('Listening history ID is required');
    }

    const exists = await this.userHistoryRepo.listeningHistoryExists(id);
    if (!exists) {
      logger.error(`Listening history with ID ${id} does not exist`);
      throw new Error('Listening history not found');
    }

    return this.userHistoryRepo.deleteListeningHistory(id);
  };
}