// src/offline-downloads/dto/create-offline-download.dto.ts
import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateOfflineDownloadDto {
  @IsString()
  user_id!: string;

  @IsString()
  song_id!: string;

  @IsOptional()
  @IsString()
  download_quality?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @IsOptional()
  @IsInt()
  file_size_bytes?: number;
}
