import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { SearchQuery, Prisma } from '@prisma/client';

@Injectable()
export class SearchQueriesRepo {
  // ========== CREATE ==========
  async createSearchQuery (
    data: Prisma.SearchQueryCreateInput
  ): Promise<SearchQuery> {
    return prisma.searchQuery.create({ data });
  }

  // ========== READ ==========
  async getSearchQueryById (
    id: string
  ): Promise<SearchQuery | null> {
    return prisma.searchQuery.findUnique({ where: { id } });
  }

  async getSearchQueriesByUserId (
    userId: string
  ): Promise<SearchQuery[]> {
    return prisma.searchQuery.findMany({
      where: { user_id: userId },
      orderBy: { searched_at: 'desc' }
    });
  }

  async getRecentSearchQueries (
    limit: number = 100
  ): Promise<SearchQuery[]> {
    return prisma.searchQuery.findMany({
      orderBy: { searched_at: 'desc' },
      take: limit
    });
  }

  // ========== UPDATE ==========
  async updateSearchQuery (
    id: string, 
    data: Prisma.SearchQueryUpdateInput
  ): Promise<SearchQuery> {
    return prisma.searchQuery.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteSearchQuery (
    id: string
  ): Promise<SearchQuery> {
    return prisma.searchQuery.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async searchQueryExists (
    id: string
  ): Promise<boolean> {
    const searchQuery = await prisma.searchQuery.findUnique({ where: { id } });
    return searchQuery !== null;
  };

  async countSearchQueries (): Promise<number> {
    return prisma.searchQuery.count();
  };
}
