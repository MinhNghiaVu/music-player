import * as albumRepo from '../../repo/album/AlbumRepository';
import type { Album, Prisma } from '@prisma/client';
import type { CreateAlbumInput, UpdateAlbumInput } from '../../repo/album/AlbumInterface';

export const createAlbum = async (input: CreateAlbumInput): Promise<Album> => {
  // Basic validation
  if (!input.title?.trim()) {
    throw new Error('Album title is required');
  }

  const albumData: Prisma.AlbumCreateInput = {
    title: input.title.trim(),
    description: input.description?.trim(),
    release_date: input.release_date,
    album_type: input.album_type || 'album',
    genres: input.genres || [],
    cover_image_url: input.cover_image_url,
    record_label: input.record_label,
    copyright_info: input.copyright_info
  };

  return albumRepo.createAlbum(albumData);
};

export const getAlbumById = async (id: string): Promise<Album | null> => {
  if (!id?.trim()) {
    throw new Error('Album ID is required');
  }

  return albumRepo.getAlbumById(id);
};

export const getAllAlbums = async (): Promise<Album[]> => {
  return albumRepo.getAllAlbums();
};

export const getAlbumWithSongs = async (id: string) => {
  if (!id?.trim()) {
    throw new Error('Album ID is required');
  }

  const album = await albumRepo.getAlbumWithSongs(id);
  if (!album) {
    throw new Error('Album not found');
  }

  return album;
};

export const searchAlbums = async (query: string): Promise<Album[]> => {
  if (!query?.trim()) {
    return [];
  }

  return albumRepo.searchAlbums(query.trim());
};

export const getAlbumsByGenre = async (genre: string): Promise<Album[]> => {
  if (!genre?.trim()) {
    throw new Error('Genre is required');
  }

  return albumRepo.getAlbumsByGenre(genre);
};

export const getRecentAlbums = async (limit: number = 10): Promise<Album[]> => {
  const validLimit = Math.min(Math.max(limit, 1), 50); // Between 1-50
  return albumRepo.getRecentAlbums(validLimit);
};

export const updateAlbum = async (id: string, input: UpdateAlbumInput): Promise<Album> => {
  if (!id?.trim()) {
    throw new Error('Album ID is required');
  }

  // Check if album exists
  const exists = await albumRepo.albumExists(id);
  if (!exists) {
    throw new Error('Album not found');
  }

  // Validate title if provided
  if (input.title !== undefined && !input.title?.trim()) {
    throw new Error('Album title cannot be empty');
  }

  const updateData: Prisma.AlbumUpdateInput = {
    ...(input.title && { title: input.title.trim() }),
    ...(input.description !== undefined && { description: input.description?.trim() }),
    ...(input.release_date && { release_date: input.release_date }),
    ...(input.album_type && { album_type: input.album_type }),
    ...(input.genres && { genres: input.genres }),
    ...(input.cover_image_url !== undefined && { cover_image_url: input.cover_image_url }),
    ...(input.record_label !== undefined && { record_label: input.record_label }),
    ...(input.copyright_info !== undefined && { copyright_info: input.copyright_info }),
    updated_at: new Date()
  };

  return albumRepo.updateAlbum(id, updateData);
};

export const deleteAlbum = async (id: string): Promise<Album> => {
  if (!id?.trim()) {
    throw new Error('Album ID is required');
  }

  const exists = await albumRepo.albumExists(id);
  if (!exists) {
    throw new Error('Album not found');
  }

  return albumRepo.deleteAlbum(id);
};

export const getAlbumStats = async () => {
  const totalAlbums = await albumRepo.countAlbums();
  const recentAlbums = await albumRepo.getRecentAlbums(5);

  return {
    total: totalAlbums,
    recent: recentAlbums
  };
};
