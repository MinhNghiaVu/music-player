// src/offline-downloads/dto/update-offline-download.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOfflineDownloadDto } from './create-offline-download.dto';

export class UpdateOfflineDownloadDto extends PartialType(CreateOfflineDownloadDto) {}
