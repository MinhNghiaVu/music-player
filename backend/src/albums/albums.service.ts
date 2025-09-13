

import { albumRepo } from './albums.repository';
import type { Album, Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';

@Injectable
export const createAlbum = async (
  input: Prisma.AlbumCreateInput
): Promise<Album> => {
  // Basic validation
  if (!input.title) {
    logger.error(`Album title is missing in input ${JSON.stringify(input)}`);
    throw new Error('Album title is required');
  }

  const albumData: Prisma.AlbumCreateInput = {
    title: input.title.trim(),
    description: input.description?.trim(),
    release_date: input.release_date,
    genres: input.genres || [],
    cover_image_url: input.cover_image_url,
  };

  logger.info(`Creating album with data: ${JSON.stringify(albumData)}`);

  return albumRepo.createAlbum(albumData);
};

export const getAlbumById = async (
  id: string
): Promise<Album | null> => {
  if (!id) {
    logger.error('Album ID is missing or empty');
    throw new Error('Album ID is required');
  }

  return albumRepo.getAlbumById(id);
};

export const getAllAlbums = async (): Promise<Album[]> => {
  return albumRepo.getAllAlbums();
};

export const updateAlbum = async (
  id: string,
  input: Prisma.AlbumUpdateInput
): Promise<Album> => {
  if (!id) {
    logger.error('Album ID is missing or empty');
    throw new Error('Album ID is required');
  }

  // Check if album exists
  const exists = await albumRepo.albumExists(id);
  if (!exists) {
    logger.error(`Album with ID ${id} does not exist`);
    throw new Error('Album not found');
  }

  // Validate title if provided
  if (input.title !== undefined && !input.title) {
    logger.error(`Invalid album title for ID ${id}`);
    throw new Error('Album title cannot be empty');
  }

  const updateData: Prisma.AlbumUpdateInput = {
    ...(input.title && { title: input.title }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.release_date && { release_date: input.release_date }),
    ...(input.genres && { genres: input.genres }),
    ...(input.cover_image_url !== undefined && { cover_image_url: input.cover_image_url }),
    updated_at: new Date()
  };

  return albumRepo.updateAlbum(id, updateData);
};

export const deleteAlbum = async (
  id: string
): Promise<Album> => {
  if (!id) {
    logger.error('Album ID is missing or empty');
    throw new Error('Album ID is required');
  }

  const exists = await albumRepo.albumExists(id);
  if (!exists) {
    logger.error(`Album with ID ${id} does not exist`);
    throw new Error('Album not found');
  }

  return albumRepo.deleteAlbum(id);
};

export const albumService = {
  createAlbum,
  getAlbumById,
  getAllAlbums,
  updateAlbum,
  deleteAlbum,
}
