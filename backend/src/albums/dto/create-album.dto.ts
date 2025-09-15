// src/albums/dto/create-album.dto.ts
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

// TODO: Fix this to match what needs validation
export class CreateAlbumDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  cover_image_url?: string;

  @IsOptional()
  @IsDateString()
  release_date?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];
}