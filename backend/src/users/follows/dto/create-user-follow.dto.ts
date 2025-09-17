// src/users/follows/dto/create-user-follow.dto.ts
import { IsString, IsIn } from 'class-validator';

export class CreateUserFollowDto {
  @IsString()
  follower_id!: string;

  @IsString()
  @IsIn(['artist'])
  followable_type!: string;

  @IsString()
  followable_id!: string;
}
