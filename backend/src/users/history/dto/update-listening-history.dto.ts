// src/users/history/dto/update-listening-history.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateListeningHistoryDto } from './create-listening-history.dto';

export class UpdateListeningHistoryDto extends PartialType(CreateListeningHistoryDto) {}
