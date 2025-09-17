// src/song-artists/dto/create-song-artist.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateSongArtistDto {
  @IsString()
  song_id!: string;

  @IsString()
  artist_id!: string;

  @IsOptional()
  @IsString()
  role?: string;
}
