// src/songs/dto/create-song.dto.ts
import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsDateString, 
  IsInt, 
  IsUrl,
  Min,
  MaxLength 
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsInt()
  @Min(1)
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