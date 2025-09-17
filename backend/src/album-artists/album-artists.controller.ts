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
import { AlbumArtistsService } from "@/album-artists/album-artists.service"
import { CreateAlbumArtistDto } from "@/album-artists/dto/create-album-artist.dto"
import { UpdateAlbumArtistDto } from "@/album-artists/dto/update-album-artist.dto"
import type { AlbumArtist } from "@prisma/client"

@Controller('album-artists') 
export class AlbumArtistsController {
  constructor(private readonly albumArtistsService: AlbumArtistsService) {};

  @Post() // POST /album-artists
  @HttpCode(HttpStatus.CREATED)
  async createAlbumArtist (
    @Body(ValidationPipe) createAlbumArtistDto: CreateAlbumArtistDto
  ): Promise<AlbumArtist> {
    return this.albumArtistsService.createAlbumArtist(createAlbumArtistDto);
  }

  @Get(':id') // GET /album-artists/:id
  async getAlbumArtistById (
    @Param('id') id: string
  ): Promise<AlbumArtist | null> {
    return this.albumArtistsService.getAlbumArtistById(id);
  }

  @Get() // GET /album-artists
  async getAllAlbumArtists(): Promise<AlbumArtist[]> {
    return this.albumArtistsService.getAllAlbumArtists();
  }

  @Patch(':id') // PATCH /album-artists/:id
  async updateAlbumArtist (
    @Param('id') id: string,
    @Body(ValidationPipe) updateAlbumArtistDto: UpdateAlbumArtistDto
  ): Promise<AlbumArtist> {
    return this.albumArtistsService.updateAlbumArtist(id, updateAlbumArtistDto);
  }

  @Delete(':id') // DELETE /album-artists/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumArtist (
    @Param('id') id: string
  ): Promise<AlbumArtist> {
    return this.albumArtistsService.deleteAlbumArtist(id);
  }
}