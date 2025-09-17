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

  @Get('user/:userId') // GET /user-preferences/user/:userId
  async getUserPreferencesByUserId (
    @Param('userId') userId: string
  ): Promise<UserPreferences | null> {
    return this.userPreferencesService.getUserPreferencesByUserId(userId);
  }

  @Patch(':id') // PATCH /user-preferences/:id
  async updateUserPreferences (
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserPreferencesDto: UpdateUserPreferencesDto
  ): Promise<UserPreferences> {
    return this.userPreferencesService.updateUserPreferences(id, updateUserPreferencesDto);
  }

  @Patch('user/:userId') // PATCH /user-preferences/user/:userId
  async updateUserPreferencesByUserId (
    @Param('userId') userId: string,
    @Body(ValidationPipe) updateUserPreferencesDto: UpdateUserPreferencesDto
  ): Promise<UserPreferences> {
    return this.userPreferencesService.updateUserPreferencesByUserId(userId, updateUserPreferencesDto);
  }

  @Delete(':id') // DELETE /user-preferences/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserPreferences (
    @Param('id') id: string
  ): Promise<UserPreferences> {
    return this.userPreferencesService.deleteUserPreferences(id);
  }

  @Delete('user/:userId') // DELETE /user-preferences/user/:userId
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserPreferencesByUserId (
    @Param('userId') userId: string
  ): Promise<UserPreferences> {
    return this.userPreferencesService.deleteUserPreferencesByUserId(userId);
  }
}
