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
import { UserLibraryService } from "@/users/library/userLibrary.service"
import { CreateUserLibraryDto } from "@/users/library/dto/create-user-library.dto"
import { UpdateUserLibraryDto } from "@/users/library/dto/update-user-library.dto"
import type { UserLibrary } from "@prisma/client"

@Controller('user-library') 
export class UserLibraryController {
  constructor(private readonly userLibraryService: UserLibraryService) {};

  @Post() // POST /user-library
  @HttpCode(HttpStatus.CREATED)
  async createUserLibrary (
    @Body(ValidationPipe) createUserLibraryDto: CreateUserLibraryDto
  ): Promise<UserLibrary> {
    return this.userLibraryService.createUserLibrary(createUserLibraryDto);
  }

  @Get(':id') // GET /user-library/:id
  async getUserLibraryById (
    @Param('id') id: string
  ): Promise<UserLibrary | null> {
    return this.userLibraryService.getUserLibraryById(id);
  }

  @Get('user/:userId') // GET /user-library/user/:userId
  async getUserLibraryByUserId (
    @Param('userId') userId: string
  ): Promise<UserLibrary[]> {
    return this.userLibraryService.getUserLibraryByUserId(userId);
  }

  @Get('user/:userId/type/:type') // GET /user-library/user/:userId/type/:type
  async getUserLibraryByType (
    @Param('userId') userId: string,
    @Param('type') type: string
  ): Promise<UserLibrary[]> {
    return this.userLibraryService.getUserLibraryByType(userId, type);
  }

  @Get('user/:userId/item/:type/:itemId') // GET /user-library/user/:userId/item/:type/:itemId
  async getUserLibraryByUserAndItem (
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Param('itemId') itemId: string
  ): Promise<UserLibrary | null> {
    return this.userLibraryService.getUserLibraryByUserAndItem(userId, type, itemId);
  }

  @Patch(':id') // PATCH /user-library/:id
  async updateUserLibrary (
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserLibraryDto: UpdateUserLibraryDto
  ): Promise<UserLibrary> {
    return this.userLibraryService.updateUserLibrary(id, updateUserLibraryDto);
  }

  @Delete(':id') // DELETE /user-library/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserLibrary (
    @Param('id') id: string
  ): Promise<UserLibrary> {
    return this.userLibraryService.deleteUserLibrary(id);
  }

  @Delete('user/:userId/item/:type/:itemId') // DELETE /user-library/user/:userId/item/:type/:itemId
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserLibraryByUserAndItem (
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Param('itemId') itemId: string
  ): Promise<UserLibrary> {
    return this.userLibraryService.deleteUserLibraryByUserAndItem(userId, type, itemId);
  }
}
