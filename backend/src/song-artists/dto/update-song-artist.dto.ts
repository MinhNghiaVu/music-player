// src/song-artists/dto/update-song-artist.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSongArtistDto } from './create-song-artist.dto';

export class UpdateSongArtistDto extends PartialType(CreateSongArtistDto) {}
