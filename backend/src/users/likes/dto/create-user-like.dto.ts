// src/users/likes/dto/create-user-like.dto.ts
import { IsString, IsIn } from 'class-validator';

export class CreateUserLikeDto {
  @IsString()
  user_id!: string;

  @IsString()
  @IsIn(['song', 'album', 'artist', 'playlist'])
  likeable_type!: string;

  @IsString()
  likeable_id!: string;
}
