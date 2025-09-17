// src/album-artists/dto/update-album-artist.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumArtistDto } from './create-album-artist.dto';

export class UpdateAlbumArtistDto extends PartialType(CreateAlbumArtistDto) {}
