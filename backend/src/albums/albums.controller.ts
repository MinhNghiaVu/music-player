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
import { albumService } from "@/albums/albums.service"
import type { Album, Prisma } from "@prisma/client"

@Controller('albums') 
export const albumController = {
  constructor(private readonly albumsService: AlbumsService) {}
  
}
export const createAlbum = async (data: Prisma.AlbumCreateInput): Promise<Album> => {
  return albumService.createAlbum(data);
}

export const getAlbumById = async (id: string): Promise<Album | null> => {
  return albumService.getAlbumById(id);
}

export const getAllAlbums = async (): Promise<Album[]> => {
  return albumService.getAllAlbums();
}

export const updateAlbum = async (id: string, data: Prisma.AlbumUpdateInput): Promise<Album> => {
  return albumService.updateAlbum(id, data);
}

export const deleteAlbum = async (id: string): Promise<Album> => {
  return albumService.deleteAlbum(id);
}
