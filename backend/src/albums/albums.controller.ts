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
import { CreateAlbumDto } from "@/albums/dto/create-album.dto"
import { UpdateAlbumDto } from "@/albums/dto/update-album.dto"
import type { Album } from "@prisma/client"

@Controller('albums') 
export class AlbumController {
  constructor(private readonly albumsService: AlbumsService) {};

  @Post() // POST /albums
  @HttpCode(HttpStatus.CREATED)
  async createAlbum (
    @Body(ValidationPipe) createAlbumDto: CreateAlbumDto
  ): Promise<Album> {
    return this.albumsService.createAlbum(createAlbumDto);
  }

  @Get(':id') // GET /albums/:id
  async getAlbumById (
    @Param('id') id: string
  ): Promise<Album | null> {
    return this.albumsService.getAlbumById(id);
  }

  @Get() // GET /albums
  async getAllAlbums(): Promise<Album[]> {
    return this.albumsService.getAllAlbums();
  }

  @Patch(':id') // PATCH /albums/:id
  async updateAlbum (
    @Param('id') id: string,
    @Body(ValidationPipe) updateAlbumDto: UpdateAlbumDto
  ): Promise<Album> {
    return this.albumsService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id') // DELETE /albums/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum (
    @Param('id') id: string
  ): Promise<Album> {
    return this.albumsService.deleteAlbum(id);
  }
}