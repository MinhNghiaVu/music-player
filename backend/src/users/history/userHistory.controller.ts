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

  @Get() // GET /listening-history
  async getAllListeningHistory(): Promise<ListeningHistory[]> {
    return this.userHistoryService.getAllListeningHistory();
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
}