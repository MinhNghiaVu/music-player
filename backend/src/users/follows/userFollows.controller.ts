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
import { UserFollowsService } from "@/users/follows/userFollows.service"
import { CreateUserFollowDto } from "@/users/follows/dto/create-user-follow.dto"
import { UpdateUserFollowDto } from "@/users/follows/dto/update-user-follow.dto"
import type { UserFollow } from "@prisma/client"

@Controller('user-follows') 
export class UserFollowsController {
  constructor(private readonly userFollowsService: UserFollowsService) {};

  @Post() // POST /user-follows
  @HttpCode(HttpStatus.CREATED)
  async createUserFollow (
    @Body(ValidationPipe) createUserFollowDto: CreateUserFollowDto
  ): Promise<UserFollow> {
    return this.userFollowsService.createUserFollow(createUserFollowDto);
  }

  @Get(':id') // GET /user-follows/:id
  async getUserFollowById (
    @Param('id') id: string
  ): Promise<UserFollow | null> {
    return this.userFollowsService.getUserFollowById(id);
  }

  @Get('follower/:followerId') // GET /user-follows/follower/:followerId
  async getUserFollowsByFollowerId (
    @Param('followerId') followerId: string
  ): Promise<UserFollow[]> {
    return this.userFollowsService.getUserFollowsByFollowerId(followerId);
  }

  @Get('followable/:type/:followableId') // GET /user-follows/followable/:type/:followableId
  async getUserFollowsByFollowableId (
    @Param('type') type: string,
    @Param('followableId') followableId: string
  ): Promise<UserFollow[]> {
    return this.userFollowsService.getUserFollowsByFollowableId(type, followableId);
  }

  @Get('follower/:followerId/followable/:type/:followableId') // GET /user-follows/follower/:followerId/followable/:type/:followableId
  async getUserFollowByFollowerAndFollowable (
    @Param('followerId') followerId: string,
    @Param('type') type: string,
    @Param('followableId') followableId: string
  ): Promise<UserFollow | null> {
    return this.userFollowsService.getUserFollowByFollowerAndFollowable(followerId, type, followableId);
  }

  @Patch(':id') // PATCH /user-follows/:id
  async updateUserFollow (
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserFollowDto: UpdateUserFollowDto
  ): Promise<UserFollow> {
    return this.userFollowsService.updateUserFollow(id, updateUserFollowDto);
  }

  @Delete(':id') // DELETE /user-follows/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserFollow (
    @Param('id') id: string
  ): Promise<UserFollow> {
    return this.userFollowsService.deleteUserFollow(id);
  }

  @Delete('follower/:followerId/followable/:type/:followableId') // DELETE /user-follows/follower/:followerId/followable/:type/:followableId
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserFollowByFollowerAndFollowable (
    @Param('followerId') followerId: string,
    @Param('type') type: string,
    @Param('followableId') followableId: string
  ): Promise<UserFollow> {
    return this.userFollowsService.deleteUserFollowByFollowerAndFollowable(followerId, type, followableId);
  }
}
