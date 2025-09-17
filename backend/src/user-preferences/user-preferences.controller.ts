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
import { UserPreferencesService } from "@/user-preferences/user-preferences.service"
import { CreateUserPreferencesDto } from "@/user-preferences/dto/create-user-preferences.dto"
import { UpdateUserPreferencesDto } from "@/user-preferences/dto/update-user-preferences.dto"
import type { UserPreferences } from "@prisma/client"

@Controller('user-preferences') 
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {};

  @Post() // POST /user-preferences
  @HttpCode(HttpStatus.CREATED)
  async createUserPreferences (
    @Body(ValidationPipe) createUserPreferencesDto: CreateUserPreferencesDto
  ): Promise<UserPreferences> {
    return this.userPreferencesService.createUserPreferences(createUserPreferencesDto);
  }

  @Get(':id') // GET /user-preferences/:id
  async getUserPreferencesById (
    @Param('id') id: string
  ): Promise<UserPreferences | null> {
    return this.userPreferencesService.getUserPreferencesById(id);
  }

  @Get() // GET /user-preferences
  async getAllUserPreferences(): Promise<UserPreferences[]> {
    return this.userPreferencesService.getAllUserPreferences();
  }

  @Patch(':id') // PATCH /user-preferences/:id
  async updateUserPreferences (
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserPreferencesDto: UpdateUserPreferencesDto
  ): Promise<UserPreferences> {
    return this.userPreferencesService.updateUserPreferences(id, updateUserPreferencesDto);
  }

  @Delete(':id') // DELETE /user-preferences/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserPreferences (
    @Param('id') id: string
  ): Promise<UserPreferences> {
    return this.userPreferencesService.deleteUserPreferences(id);
  }
}