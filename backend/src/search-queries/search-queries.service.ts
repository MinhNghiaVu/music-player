import { Injectable } from '@nestjs/common';
import { SearchQueriesRepo } from './search-queries.repository';
import type { SearchQuery, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable()
export class SearchQueriesService {
  constructor(private readonly searchQueriesRepo: SearchQueriesRepo) {}

  async createSearchQuery(
    input: Prisma.SearchQueryCreateInput
  ): Promise<SearchQuery> {
    if (!input.query_text) {
      logger.error(`Query text is missing in input ${JSON.stringify(input)}`);
      throw new Error('Query text is required');
    }

    const searchQueryData: Prisma.SearchQueryCreateInput = {
      user_id: input.user_id,
      query_text: input.query_text.trim(),
      result_count: input.result_count || 0,
      clicked_result: input.clicked_result || false,
    };

    logger.info(`Creating search query with data: ${JSON.stringify(searchQueryData)}`);
    return this.searchQueriesRepo.createSearchQuery(searchQueryData);
  };

  async getSearchQueryById (
    id: string
  ): Promise<SearchQuery | null> {
    if (!id) {
      logger.error('Search query ID is missing or empty');
      throw new Error('Search query ID is required');
    }

    return this.searchQueriesRepo.getSearchQueryById(id);
  };

  async getAllSearchQueries (): Promise<SearchQuery[]> {
    return this.searchQueriesRepo.getAllSearchQueries();
  };

  async updateSearchQuery (
    id: string,
    input: Prisma.SearchQueryUpdateInput
  ): Promise<SearchQuery> {
    if (!id) {
      logger.error('Search query ID is missing or empty');
      throw new Error('Search query ID is required');
    }

    const exists = await this.searchQueriesRepo.searchQueryExists(id);
    if (!exists) {
      logger.error(`Search query with ID ${id} does not exist`);
      throw new Error('Search query not found');
    }

    return this.searchQueriesRepo.updateSearchQuery(id, input);
  };

  async deleteSearchQuery (
    id: string
  ): Promise<SearchQuery> {
    if (!id) {
      logger.error('Search query ID is missing or empty');
      throw new Error('Search query ID is required');
    }

    const exists = await this.searchQueriesRepo.searchQueryExists(id);
    if (!exists) {
      logger.error(`Search query with ID ${id} does not exist`);
      throw new Error('Search query not found');
    }

    return this.searchQueriesRepo.deleteSearchQuery(id);
  };
}