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
import { AlbumsService } from "@/albums/albums.service"
import type { Album, Prisma } from "@prisma/client"

@Controller('albums') 
export const albumController = {
  constructor(private readonly albumsService: AlbumsService) {};

  @Post() // POST /albums
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(
    @Body(ValidationPipe) createAlbumDto: CreateAlbumDto
  ): Promise<Album> {
    return this.albumsService.createAlbum(data);
  }

  @Get(':id') // GET /albums/:id
  async getAlbumById(
    @Param('id') id: string
  ): Promise<Album | null> {
    return this.albumsService.getAlbumById(id);
  }

  @Get() // GET /albums
  async getAllAlbums(): Promise<Album[]> {
    return this.albumsService.getAllAlbums();
  }

  @Patch(':id') // PATCH /albums/:id
  async updateAlbum(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) 
    data: Prisma.AlbumUpdateInput
  ): Promise<Album> {
    return this.albumsService.updateAlbum(id, data);
  }

  @Delete(':id') // DELETE /albums/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(
    @Param('id') id: string
  ): Promise<Album> {
    return this.albumsService.deleteAlbum(id);
  }
}