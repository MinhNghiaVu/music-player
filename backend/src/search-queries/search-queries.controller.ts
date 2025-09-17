import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { SearchQueriesService } from "@/search-queries/search-queries.service"
import { CreateSearchQueryDto } from "@/search-queries/dto/create-search-query.dto"
import { UpdateSearchQueryDto } from "@/search-queries/dto/update-search-query.dto"
import type { SearchQuery } from "@prisma/client"

@Controller('search-queries') 
export class SearchQueriesController {
  constructor(private readonly searchQueriesService: SearchQueriesService) {};

  @Post() // POST /search-queries
  @HttpCode(HttpStatus.CREATED)
  async createSearchQuery (
    @Body(ValidationPipe) createSearchQueryDto: CreateSearchQueryDto
  ): Promise<SearchQuery> {
    return this.searchQueriesService.createSearchQuery(createSearchQueryDto);
  }

  @Get(':id') // GET /search-queries/:id
  async getSearchQueryById (
    @Param('id') id: string
  ): Promise<SearchQuery | null> {
    return this.searchQueriesService.getSearchQueryById(id);
  }

  @Get('user/:userId') // GET /search-queries/user/:userId
  async getSearchQueriesByUserId (
    @Param('userId') userId: string
  ): Promise<SearchQuery[]> {
    return this.searchQueriesService.getSearchQueriesByUserId(userId);
  }

  @Get('recent/all') // GET /search-queries/recent/all?limit=100
  async getRecentSearchQueries (
    @Query('limit') limit?: string
  ): Promise<SearchQuery[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.searchQueriesService.getRecentSearchQueries(limitNum);
  }

  @Patch(':id') // PATCH /search-queries/:id
  async updateSearchQuery (
    @Param('id') id: string,
    @Body(ValidationPipe) updateSearchQueryDto: UpdateSearchQueryDto
  ): Promise<SearchQuery> {
    return this.searchQueriesService.updateSearchQuery(id, updateSearchQueryDto);
  }

  @Delete(':id') // DELETE /search-queries/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSearchQuery (
    @Param('id') id: string
  ): Promise<SearchQuery> {
    return this.searchQueriesService.deleteSearchQuery(id);
  }
}
