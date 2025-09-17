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
import { PlaylistSongsService } from "@/playlist-songs/playlist-songs.service"
import { CreatePlaylistSongDto } from "@/playlist-songs/dto/create-playlist-song.dto"
import { UpdatePlaylistSongDto } from "@/playlist-songs/dto/update-playlist-song.dto"
import type { PlaylistSong } from "@prisma/client"

@Controller('playlist-songs') 
export class PlaylistSongsController {
  constructor(private readonly playlistSongsService: PlaylistSongsService) {};

  @Post() // POST /playlist-songs
  @HttpCode(HttpStatus.CREATED)
  async createPlaylistSong (
    @Body(ValidationPipe) createPlaylistSongDto: CreatePlaylistSongDto
  ): Promise<PlaylistSong> {
    return this.playlistSongsService.createPlaylistSong(createPlaylistSongDto);
  }

  @Get(':id') // GET /playlist-songs/:id
  async getPlaylistSongById (
    @Param('id') id: string
  ): Promise<PlaylistSong | null> {
    return this.playlistSongsService.getPlaylistSongById(id);
  }

  @Get() // GET /playlist-songs
  async getAllPlaylistSongs(): Promise<PlaylistSong[]> {
    return this.playlistSongsService.getAllPlaylistSongs();
  }

  @Patch(':id') // PATCH /playlist-songs/:id
  async updatePlaylistSong (
    @Param('id') id: string,
    @Body(ValidationPipe) updatePlaylistSongDto: UpdatePlaylistSongDto
  ): Promise<PlaylistSong> {
    return this.playlistSongsService.updatePlaylistSong(id, updatePlaylistSongDto);
  }

  @Delete(':id') // DELETE /playlist-songs/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlaylistSong (
    @Param('id') id: string
  ): Promise<PlaylistSong> {
    return this.playlistSongsService.deletePlaylistSong(id);
  }
}