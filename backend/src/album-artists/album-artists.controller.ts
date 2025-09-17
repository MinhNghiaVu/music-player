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

  @Get('album/:albumId') // GET /album-artists/album/:albumId
  async getAlbumArtistsByAlbumId (
    @Param('albumId') albumId: string
  ): Promise<AlbumArtist[]> {
    return this.albumArtistsService.getAlbumArtistsByAlbumId(albumId);
  }

  @Get('artist/:artistId') // GET /album-artists/artist/:artistId
  async getAlbumArtistsByArtistId (
    @Param('artistId') artistId: string
  ): Promise<AlbumArtist[]> {
    return this.albumArtistsService.getAlbumArtistsByArtistId(artistId);
  }

  @Get('album/:albumId/artist/:artistId') // GET /album-artists/album/:albumId/artist/:artistId?role=primary
  async getAlbumArtistByAlbumAndArtist (
    @Param('albumId') albumId: string,
    @Param('artistId') artistId: string,
    @Param('role') role?: string
  ): Promise<AlbumArtist | null> {
    return this.albumArtistsService.getAlbumArtistByAlbumAndArtist(albumId, artistId, role || 'primary');
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

  @Delete('album/:albumId/artist/:artistId') // DELETE /album-artists/album/:albumId/artist/:artistId?role=primary
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbumArtistByAlbumAndArtist (
    @Param('albumId') albumId: string,
    @Param('artistId') artistId: string,
    @Param('role') role?: string
  ): Promise<AlbumArtist> {
    return this.albumArtistsService.deleteAlbumArtistByAlbumAndArtist(albumId, artistId, role || 'primary');
  }
}
