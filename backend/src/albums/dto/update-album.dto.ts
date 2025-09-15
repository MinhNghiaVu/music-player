// src/albums/dto/update-album.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';

// TODO: Add custom validations
export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}