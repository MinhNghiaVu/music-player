import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const songRepo = {
  // Create a new song
  create: async (songData: any) => {
    return await prisma.song.create({
      data: songData,
    });
  },

  // Find a song by ID
  findById: async (id: string) => {
    return await prisma.song.findUnique({
      where: { id },
    });
  },

  // Update a song
  update: async (id: string, updateData: any) => {
    return await prisma.song.update({
      where: { id },
      data: updateData,
    });
  },

  // Delete a song
  delete: async (id: string) => {
    return await prisma.song.delete({
      where: { id },
    });
  },

  // List all songs
  list: async () => {
    return await prisma.song.findMany();
  },

  // Disconnect Prisma client
  disconnect: async () => {
    await prisma.$disconnect();
  },
};

export default songRepo;