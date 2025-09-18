// src/artists/dto/create-artist.dto.ts
import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsUrl, 
  MaxLength, 
  MinLength,
  IsNotEmpty,
  IsBoolean,
  IsCountryCode
} from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsUrl({ 
    protocols: ['http', 'https'],
    require_protocol: true 
  })
  profile_image_url?: string;

  @IsOptional()
  @IsUrl({ 
    protocols: ['http', 'https'],
    require_protocol: true 
  })
  banner_image_url?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean = false;

  @IsOptional()
  @IsCountryCode('alpha-2')
  country_code?: string;

  @IsArray()
  @IsString({ each: true })
  genres!: string[];
}
