// src/playlists/dto/create-playlist.dto.ts
import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  cover_image_url?: string;

  @IsString()
  user_id!: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @IsOptional()
  @IsBoolean()
  is_collaborative?: boolean;
}
