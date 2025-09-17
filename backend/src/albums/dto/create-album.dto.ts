// src/albums/dto/create-album.dto.ts
import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsDateString, 
  IsUrl, 
  MaxLength, 
  MinLength,
  IsNotEmpty,
  ArrayMinSize
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUrl({ 
    protocols: ['http', 'https'],
    require_protocol: true 
  })
  cover_image_url?: string;

  @IsOptional()
  @IsDateString()
  release_date?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  genres!: string[];
}