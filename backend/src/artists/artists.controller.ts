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
import { ArtistsService } from "@/artists/artists.service"
import { CreateArtistDto } from "@/artists/dto/create-artist.dto"
import { UpdateArtistDto } from "@/artists/dto/update-artist.dto"
import type { Artist } from "@prisma/client"

@Controller('artists') 
export class ArtistController {
  constructor(private readonly artistsService: ArtistsService) {};

  @Post() // POST /albums
  @HttpCode(HttpStatus.CREATED)
  async createArtist (
    @Body(ValidationPipe) createArtistDto: CreateArtistDto
  ): Promise<Artist> {
    return this.artistsService.createArtist(createArtistDto);
  }

  @Get(':id') // GET /albums/:id
  async getArtistById (
    @Param('id') id: string
  ): Promise<Artist | null> {
    return this.artistsService.getArtistById(id);
  }

  @Get() // GET /albums
  async getAllArtists(): Promise<Artist[]> {
    return this.artistsService.getAllArtists();
  }

  @Patch(':id') // PATCH /albums/:id
  async updateArtist (
    @Param('id') id: string,
    @Body(ValidationPipe) updateArtistDto: UpdateArtistDto
  ): Promise<Artist> {
    return this.artistsService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id') // DELETE /albums/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist (
    @Param('id') id: string
  ): Promise<Artist> {
    return this.artistsService.deleteArtist(id);
  }
}