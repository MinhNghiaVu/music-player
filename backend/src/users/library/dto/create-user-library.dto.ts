// src/users/library/dto/create-user-library.dto.ts
import { IsString, IsIn } from 'class-validator';

export class CreateUserLibraryDto {
  @IsString()
  user_id!: string;

  @IsString()
  @IsIn(['song', 'album', 'artist', 'playlist'])
  item_type!: string;

  @IsString()
  item_id!: string;
}
