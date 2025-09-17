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
import { GenresService } from "@/genres/genres.service"
import { CreateGenreDto } from "@/genres/dto/create-genre.dto"
import { UpdateGenreDto } from "@/genres/dto/update-genre.dto"
import type { Genre } from "@prisma/client"

@Controller('genres') 
export class GenresController {
  constructor(private readonly genresService: GenresService) {};

  @Post() // POST /genres
  @HttpCode(HttpStatus.CREATED)
  async createGenre (
    @Body(ValidationPipe) createGenreDto: CreateGenreDto
  ): Promise<Genre> {
    return this.genresService.createGenre(createGenreDto);
  }

  @Get(':id') // GET /genres/:id
  async getGenreById (
    @Param('id') id: string
  ): Promise<Genre | null> {
    return this.genresService.getGenreById(id);
  }

  @Get() // GET /genres
  async getAllGenres(): Promise<Genre[]> {
    return this.genresService.getAllGenres();
  }

  @Patch(':id') // PATCH /genres/:id
  async updateGenre (
    @Param('id') id: string,
    @Body(ValidationPipe) updateGenreDto: UpdateGenreDto
  ): Promise<Genre> {
    return this.genresService.updateGenre(id, updateGenreDto);
  }

  @Delete(':id') // DELETE /genres/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGenre (
    @Param('id') id: string
  ): Promise<Genre> {
    return this.genresService.deleteGenre(id);
  }
}