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
import { UserLikesService } from "@/users/likes/userLikes.service"
import { CreateUserLikeDto } from "@/users/likes/dto/create-user-like.dto"
import { UpdateUserLikeDto } from "@/users/likes/dto/update-user-like.dto"
import type { UserLike } from "@prisma/client"

@Controller('user-likes') 
export class UserLikesController {
  constructor(private readonly userLikesService: UserLikesService) {};

  @Post() // POST /user-likes
  @HttpCode(HttpStatus.CREATED)
  async createUserLike (
    @Body(ValidationPipe) createUserLikeDto: CreateUserLikeDto
  ): Promise<UserLike> {
    return this.userLikesService.createUserLike(createUserLikeDto);
  }

  @Get(':id') // GET /user-likes/:id
  async getUserLikeById (
    @Param('id') id: string
  ): Promise<UserLike | null> {
    return this.userLikesService.getUserLikeById(id);
  }

  @Get('user/:userId') // GET /user-likes/user/:userId
  async getUserLikesByUserId (
    @Param('userId') userId: string
  ): Promise<UserLike[]> {
    return this.userLikesService.getUserLikesByUserId(userId);
  }

  @Get('user/:userId/type/:type') // GET /user-likes/user/:userId/type/:type
  async getUserLikesByType (
    @Param('userId') userId: string,
    @Param('type') type: string
  ): Promise<UserLike[]> {
    return this.userLikesService.getUserLikesByType(userId, type);
  }

  @Get('user/:userId/item/:type/:itemId') // GET /user-likes/user/:userId/item/:type/:itemId
  async getUserLikeByUserAndItem (
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Param('itemId') itemId: string
  ): Promise<UserLike | null> {
    return this.userLikesService.getUserLikeByUserAndItem(userId, type, itemId);
  }

  @Patch(':id') // PATCH /user-likes/:id
  async updateUserLike (
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserLikeDto: UpdateUserLikeDto
  ): Promise<UserLike> {
    return this.userLikesService.updateUserLike(id, updateUserLikeDto);
  }

  @Delete(':id') // DELETE /user-likes/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserLike (
    @Param('id') id: string
  ): Promise<UserLike> {
    return this.userLikesService.deleteUserLike(id);
  }

  @Delete('user/:userId/item/:type/:itemId') // DELETE /user-likes/user/:userId/item/:type/:itemId
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserLikeByUserAndItem (
    @Param('userId') userId: string,
    @Param('type') type: string,
    @Param('itemId') itemId: string
  ): Promise<UserLike> {
    return this.userLikesService.deleteUserLikeByUserAndItem(userId, type, itemId);
  }
}
