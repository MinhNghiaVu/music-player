// src/album-artists/dto/create-album-artist.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateAlbumArtistDto {
  @IsString()
  album_id!: string;

  @IsString()
  artist_id!: string;

  @IsOptional()
  @IsString()
  role?: string;
}
