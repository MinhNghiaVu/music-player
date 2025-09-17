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
import { SongsService } from "@/song/song.service"
import { CreateSongDto } from "@/song/dto/create-song.dto"
import { UpdateSongDto } from "@/song/dto/update-song.dto"
import type { Song } from "@prisma/client"

@Controller('songs') 
export class SongController {
  constructor(private readonly songsService: SongsService) {};

  @Post() // POST /songs
  @HttpCode(HttpStatus.CREATED)
  async createSong (
    @Body(ValidationPipe) createSongDto: CreateSongDto
  ): Promise<Song> {
    return this.songsService.createSong(createSongDto);
  }

  @Get(':id') // GET /songs/:id
  async getSongById (
    @Param('id') id: string
  ): Promise<Song | null> {
    return this.songsService.getSongById(id);
  }

  @Get() // GET /songs
  async getAllSongs(): Promise<Song[]> {
    return this.songsService.getAllSongs();
  }

  @Patch(':id') // PATCH /songs/:id
  async updateSong (
    @Param('id') id: string,
    @Body(ValidationPipe) updateSongDto: UpdateSongDto
  ): Promise<Song> {
    return this.songsService.updateSong(id, updateSongDto);
  }

  @Delete(':id') // DELETE /songs/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSong (
    @Param('id') id: string
  ): Promise<Song> {
    return this.songsService.deleteSong(id);
  }
}
