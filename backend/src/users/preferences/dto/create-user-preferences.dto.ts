// src/user-preferences/dto/create-user-preferences.dto.ts
import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateUserPreferencesDto {
  @IsString()
  user_id!: string;

  @IsOptional()
  @IsString()
  audio_quality?: string;

  @IsOptional()
  @IsBoolean()
  autoplay_enabled?: boolean;

  @IsOptional()
  @IsInt()
  crossfade_duration?: number;

  @IsOptional()
  @IsBoolean()
  explicit_content_filter?: boolean;

  @IsOptional()
  @IsBoolean()
  social_features_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  offline_downloads_enabled?: boolean;
}
