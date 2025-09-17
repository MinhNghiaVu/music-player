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

  @Get() // GET /user-likes
  async getAllUserLikes(): Promise<UserLike[]> {
    return this.userLikesService.getAllUserLikes();
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
}
