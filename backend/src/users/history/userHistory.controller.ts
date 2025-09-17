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
  Query,
} from '@nestjs/common';
import { UserHistoryService } from "@/users/history/userHistory.service"
import { CreateListeningHistoryDto } from "@/users/history/dto/create-listening-history.dto"
import { UpdateListeningHistoryDto } from "@/users/history/dto/update-listening-history.dto"
import type { ListeningHistory } from "@prisma/client"

@Controller('listening-history') 
export class UserHistoryController {
  constructor(private readonly userHistoryService: UserHistoryService) {};

  @Post() // POST /listening-history
  @HttpCode(HttpStatus.CREATED)
  async createListeningHistory (
    @Body(ValidationPipe) createListeningHistoryDto: CreateListeningHistoryDto
  ): Promise<ListeningHistory> {
    return this.userHistoryService.createListeningHistory(createListeningHistoryDto);
  }

  @Get(':id') // GET /listening-history/:id
  async getListeningHistoryById (
    @Param('id') id: string
  ): Promise<ListeningHistory | null> {
    return this.userHistoryService.getListeningHistoryById(id);
  }

  @Get('user/:userId') // GET /listening-history/user/:userId
  async getListeningHistoryByUserId (
    @Param('userId') userId: string
  ): Promise<ListeningHistory[]> {
    return this.userHistoryService.getListeningHistoryByUserId(userId);
  }

  @Get('user/:userId/recent') // GET /listening-history/user/:userId/recent?limit=50
  async getRecentListeningHistory (
    @Param('userId') userId: string,
    @Query('limit') limit?: string
  ): Promise<ListeningHistory[]> {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.userHistoryService.getRecentListeningHistory(userId, limitNum);
  }

  @Get('song/:songId') // GET /listening-history/song/:songId
  async getListeningHistoryBySongId (
    @Param('songId') songId: string
  ): Promise<ListeningHistory[]> {
    return this.userHistoryService.getListeningHistoryBySongId(songId);
  }

  @Patch(':id') // PATCH /listening-history/:id
  async updateListeningHistory (
    @Param('id') id: string,
    @Body(ValidationPipe) updateListeningHistoryDto: UpdateListeningHistoryDto
  ): Promise<ListeningHistory> {
    return this.userHistoryService.updateListeningHistory(id, updateListeningHistoryDto);
  }

  @Delete(':id') // DELETE /listening-history/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteListeningHistory (
    @Param('id') id: string
  ): Promise<ListeningHistory> {
    return this.userHistoryService.deleteListeningHistory(id);
  }

  @Delete('user/:userId') // DELETE /listening-history/user/:userId
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteListeningHistoryByUserId (
    @Param('userId') userId: string
  ): Promise<{ count: number }> {
    return this.userHistoryService.deleteListeningHistoryByUserId(userId);
  }
}
