// src/genres/dto/create-genre.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parent_genre_id?: string;
}
