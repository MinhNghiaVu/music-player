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
import { UsersService } from "@/users/users.service"
import { CreateUserDto } from "@/users/dto/create-user.dto"
import { UpdateUserDto } from "@/users/dto/update-user.dto"
import type { User } from "@prisma/client"

@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {};

  @Post() // POST /users
  @HttpCode(HttpStatus.CREATED)
  async createUser (
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id') // GET /users/:id
  async getUserById (
    @Param('id') id: string
  ): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Get() // GET /users
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Patch(':id') // PATCH /users/:id
  async updateUser (
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser (
    @Param('id') id: string
  ): Promise<User> {
    return this.usersService.deleteUser(id);
  }
}
