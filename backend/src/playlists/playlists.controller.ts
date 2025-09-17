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
import { PlaylistsService } from "@/playlists/playlists.service"
import { CreatePlaylistDto } from "@/playlists/dto/create-playlist.dto"
import { UpdatePlaylistDto } from "@/playlists/dto/update-playlist.dto"
import type { Playlist } from "@prisma/client"

@Controller('playlists') 
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {};

  @Post() // POST /playlists
  @HttpCode(HttpStatus.CREATED)
  async createPlaylist (
    @Body(ValidationPipe) createPlaylistDto: CreatePlaylistDto
  ): Promise<Playlist> {
    return this.playlistsService.createPlaylist(createPlaylistDto);
  }

  @Get(':id') // GET /playlists/:id
  async getPlaylistById (
    @Param('id') id: string
  ): Promise<Playlist | null> {
    return this.playlistsService.getPlaylistById(id);
  }

  @Get() // GET /playlists
  async getAllPlaylists(): Promise<Playlist[]> {
    return this.playlistsService.getAllPlaylists();
  }

  @Get('user/:userId') // GET /playlists/user/:userId
  async getPlaylistsByUserId (
    @Param('userId') userId: string
  ): Promise<Playlist[]> {
    return this.playlistsService.getPlaylistsByUserId(userId);
  }

  @Get('public/all') // GET /playlists/public/all
  async getPublicPlaylists(): Promise<Playlist[]> {
    return this.playlistsService.getPublicPlaylists();
  }

  @Patch(':id') // PATCH /playlists/:id
  async updatePlaylist (
    @Param('id') id: string,
    @Body(ValidationPipe) updatePlaylistDto: UpdatePlaylistDto
  ): Promise<Playlist> {
    return this.playlistsService.updatePlaylist(id, updatePlaylistDto);
  }

  @Delete(':id') // DELETE /playlists/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlaylist (
    @Param('id') id: string
  ): Promise<Playlist> {
    return this.playlistsService.deletePlaylist(id);
  }
}
