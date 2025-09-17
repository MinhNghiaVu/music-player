// src/search-queries/dto/update-search-query.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchQueryDto } from './create-search-query.dto';

export class UpdateSearchQueryDto extends PartialType(CreateSearchQueryDto) {}
