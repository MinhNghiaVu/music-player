// src/playlist-songs/dto/create-playlist-song.dto.ts
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreatePlaylistSongDto {
  @IsString()
  playlist_id!: string;

  @IsString()
  song_id!: string;

  @IsInt()
  position!: number;

  @IsOptional()
  @IsString()
  added_by?: string;
}
