// src/users/dto/create-user.dto.ts
import { IsString, IsOptional, IsEmail, IsBoolean, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password_hash!: string;

  @IsOptional()
  @IsString()
  display_name?: string;

  @IsOptional()
  @IsString()
  profile_image_url?: string;

  @IsOptional()
  @IsIn(['free', 'premium', 'family'])
  subscription_tier?: string;

  @IsOptional()
  @IsString()
  country_code?: string;

  @IsOptional()
  @IsString()
  language_preference?: string;
}
