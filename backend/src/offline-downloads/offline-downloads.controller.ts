import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { OfflineDownloadsService } from "@/offline-downloads/offline-downloads.service"
import { CreateOfflineDownloadDto } from "@/offline-downloads/dto/create-offline-download.dto"
import { UpdateOfflineDownloadDto } from "@/offline-downloads/dto/update-offline-download.dto"
import type { OfflineDownload } from "@prisma/client"

@Controller('offline-downloads') 
export class OfflineDownloadsController {
  constructor(private readonly offlineDownloadsService: OfflineDownloadsService) {};

  @Post() // POST /offline-downloads
  @HttpCode(HttpStatus.CREATED)
  async createOfflineDownload (
    @Body(ValidationPipe) createOfflineDownloadDto: CreateOfflineDownloadDto
  ): Promise<OfflineDownload> {
    return this.offlineDownloadsService.createOfflineDownload(createOfflineDownloadDto);
  }

  @Get(':id') // GET /offline-downloads/:id
  async getOfflineDownloadById (
    @Param('id') id: string
  ): Promise<OfflineDownload | null> {
    return this.offlineDownloadsService.getOfflineDownloadById(id);
  }

  @Get() // GET /offline-downloads
  async getAllOfflineDownloads(): Promise<OfflineDownload[]> {
    return this.offlineDownloadsService.getAllOfflineDownloads();
  }

  @Patch(':id') // PATCH /offline-downloads/:id
  async updateOfflineDownload (
    @Param('id') id: string,
    @Body(ValidationPipe) updateOfflineDownloadDto: UpdateOfflineDownloadDto
  ): Promise<OfflineDownload> {
    return this.offlineDownloadsService.updateOfflineDownload(id, updateOfflineDownloadDto);
  }

  @Delete(':id') // DELETE /offline-downloads/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOfflineDownload (
    @Param('id') id: string
  ): Promise<OfflineDownload> {
    return this.offlineDownloadsService.deleteOfflineDownload(id);
  }
}