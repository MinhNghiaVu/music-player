// src/song/dto/create-song.dto.ts
import { IsString, IsOptional, IsArray, IsDateString, IsInt, IsUrl } from 'class-validator';

export class CreateSongDto {
  @IsString()
  title!: string;

  @IsInt()
  duration_seconds!: number;

  @IsOptional()
  @IsString()
  album_id?: string;

  @IsOptional()
  @IsUrl()
  audio_url?: string;

  @IsOptional()
  @IsUrl()
  preview_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];

  @IsOptional()
  @IsDateString()
  release_date?: string;
}