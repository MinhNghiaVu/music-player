// src/users/follows/dto/update-user-follow.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFollowDto } from './create-user-follow.dto';

export class UpdateUserFollowDto extends PartialType(CreateUserFollowDto) {}
