// src/artists/dto/update-artist.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  // All fields from CreateArtistDto are now optional
  // Additional update-specific validations can be added here if needed
}
