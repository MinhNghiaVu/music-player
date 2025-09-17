// src/users/history/dto/create-listening-history.dto.ts
import { IsString, IsOptional, IsInt, IsBoolean, IsDateString } from 'class-validator';

export class CreateListeningHistoryDto {
  @IsString()
  user_id!: string;

  @IsString()
  song_id!: string;

  @IsOptional()
  @IsInt()
  play_duration_seconds?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  device_type?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  source_id?: string;
}
