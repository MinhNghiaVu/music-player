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
    // Basic validation
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

  async getListeningHistoryByUserId (
    userId: string
  ): Promise<ListeningHistory[]> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    return this.userHistoryRepo.getListeningHistoryByUserId(userId);
  };

  async getListeningHistoryBySongId (
    songId: string
  ): Promise<ListeningHistory[]> {
    if (!songId) {
      logger.error('Song ID is missing or empty');
      throw new Error('Song ID is required');
    }

    return this.userHistoryRepo.getListeningHistoryBySongId(songId);
  };

  async getRecentListeningHistory (
    userId: string,
    limit: number = 50
  ): Promise<ListeningHistory[]> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    if (limit <= 0 || limit > 1000) {
      logger.error(`Invalid limit ${limit} for recent listening history`);
      throw new Error('Limit must be between 1 and 1000');
    }

    return this.userHistoryRepo.getRecentListeningHistory(userId, limit);
  };

  async updateListeningHistory (
    id: string,
    input: Prisma.ListeningHistoryUpdateInput
  ): Promise<ListeningHistory> {
    if (!id) {
      logger.error('Listening history ID is missing or empty');
      throw new Error('Listening history ID is required');
    }

    // Check if listening history exists
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

  async deleteListeningHistoryByUserId (
    userId: string
  ): Promise<{ count: number }> {
    if (!userId) {
      logger.error('User ID is missing or empty');
      throw new Error('User ID is required');
    }

    return this.userHistoryRepo.deleteListeningHistoryByUserId(userId);
  };
}
