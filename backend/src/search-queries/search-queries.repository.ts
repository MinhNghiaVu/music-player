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

  async getAllSearchQueries (): Promise<SearchQuery[]> {
    return prisma.searchQuery.findMany({
      orderBy: { searched_at: 'desc' }
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
}