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

  @Get() // GET /search-queries
  async getAllSearchQueries(): Promise<SearchQuery[]> {
    return this.searchQueriesService.getAllSearchQueries();
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