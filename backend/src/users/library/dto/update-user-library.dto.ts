// src/users/library/dto/update-user-library.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserLibraryDto } from './create-user-library.dto';

export class UpdateUserLibraryDto extends PartialType(CreateUserLibraryDto) {}
