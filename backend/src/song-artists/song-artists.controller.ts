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
import { SongArtistsService } from "@/song-artists/song-artists.service"
import { CreateSongArtistDto } from "@/song-artists/dto/create-song-artist.dto"
import { UpdateSongArtistDto } from "@/song-artists/dto/update-song-artist.dto"
import type { SongArtist } from "@prisma/client"

@Controller('song-artists') 
export class SongArtistsController {
  constructor(private readonly songArtistsService: SongArtistsService) {};

  @Post() // POST /song-artists
  @HttpCode(HttpStatus.CREATED)
  async createSongArtist (
    @Body(ValidationPipe) createSongArtistDto: CreateSongArtistDto
  ): Promise<SongArtist> {
    return this.songArtistsService.createSongArtist(createSongArtistDto);
  }

  @Get(':id') // GET /song-artists/:id
  async getSongArtistById (
    @Param('id') id: string
  ): Promise<SongArtist | null> {
    return this.songArtistsService.getSongArtistById(id);
  }

  @Get('song/:songId') // GET /song-artists/song/:songId
  async getSongArtistsBySongId (
    @Param('songId') songId: string
  ): Promise<SongArtist[]> {
    return this.songArtistsService.getSongArtistsBySongId(songId);
  }

  @Get('artist/:artistId') // GET /song-artists/artist/:artistId
  async getSongArtistsByArtistId (
    @Param('artistId') artistId: string
  ): Promise<SongArtist[]> {
    return this.songArtistsService.getSongArtistsByArtistId(artistId);
  }

  @Get('song/:songId/artist/:artistId') // GET /song-artists/song/:songId/artist/:artistId?role=main
  async getSongArtistBySongAndArtist (
    @Param('songId') songId: string,
    @Param('artistId') artistId: string,
    @Param('role') role?: string
  ): Promise<SongArtist | null> {
    return this.songArtistsService.getSongArtistBySongAndArtist(songId, artistId, role || 'main');
  }

  @Patch(':id') // PATCH /song-artists/:id
  async updateSongArtist (
    @Param('id') id: string,
    @Body(ValidationPipe) updateSongArtistDto: UpdateSongArtistDto
  ): Promise<SongArtist> {
    return this.songArtistsService.updateSongArtist(id, updateSongArtistDto);
  }

  @Delete(':id') // DELETE /song-artists/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSongArtist (
    @Param('id') id: string
  ): Promise<SongArtist> {
    return this.songArtistsService.deleteSongArtist(id);
  }

  @Delete('song/:songId/artist/:artistId') // DELETE /song-artists/song/:songId/artist/:artistId?role=main
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSongArtistBySongAndArtist (
    @Param('songId') songId: string,
    @Param('artistId') artistId: string,
    @Param('role') role?: string
  ): Promise<SongArtist> {
    return this.songArtistsService.deleteSongArtistBySongAndArtist(songId, artistId, role || 'main');
  }
}
