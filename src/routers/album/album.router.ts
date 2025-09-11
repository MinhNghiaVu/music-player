import { albumController } from '@/controllers/album/album.controller';

// TODO: add zod validation for request and response

export const albumRouter = {
  createAlbum: albumController.createAlbum,
  getAlbumById: albumController.getAlbumById,
  getAllAlbums: albumController.getAllAlbums,
  updateAlbum: albumController.updateAlbum,
  deleteAlbum: albumController.deleteAlbum,
};