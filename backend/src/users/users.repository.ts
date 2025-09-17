import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersRepo {
  // ========== CREATE ==========
  async createUser (
    data: Prisma.UserCreateInput
  ): Promise<User> {
    return prisma.user.create({ data });
  }

  // ========== READ ==========
  async getUserById (
    id: string
  ): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers (): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { created_at: 'desc' }
    });
  }

  // ========== UPDATE ==========
  async updateUser (
    id: string, 
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteUser (
    id: string
  ): Promise<User> {
    return prisma.user.delete({ where: { id } });
  };

  // ========== UTILITY ==========
  async userExists (
    id: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user !== null;
  };
}