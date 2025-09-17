import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { AlbumArtist, Prisma } from '@prisma/client';

@Injectable()
export class AlbumArtistsRepo {
  // ========== CREATE ==========
  async createAlbumArtist (
    data: Prisma.AlbumArtistCreateInput
  ): Promise<AlbumArtist> {
    return prisma.albumArtist.create({ data });
  }

  // ========== READ ==========
  async getAlbumArtistById (
    id: string
  ): Promise<AlbumArtist | null> {
    return prisma.albumArtist.findUnique({ 
      where: { id },
      include: {
        album: true,
        artist: true
      }
    });
  }

  async getAlbumArtistsByAlbumId (
    albumId: string
  ): Promise<AlbumArtist[]> {
    return prisma.albumArtist.findMany({
      where: { album_id: albumId },
      include: {
        artist: true
      },
      orderBy: { created_at: 'asc' }
    });
  }

  async getAlbumArtistsByArtistId (
    artistId: string
  ): Promise<AlbumArtist[]> {
    return prisma.albumArtist.findMany({
      where: { artist_id: artistId },
      include: {
        album: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getAlbumArtistByAlbumAndArtist (
    albumId: string,
    artistId: string,
    role: string = 'primary'
  ): Promise<AlbumArtist | null> {
    return prisma.albumArtist.findUnique({
      where: {
        album_id_artist_id_role: {
          album_id: albumId,
          artist_id: artistId,
          role: role
        }
      }
    });
  }

  // ========== UPDATE ==========
  async updateAlbumArtist (
    id: string, 
    data: Prisma.AlbumArtistUpdateInput
  ): Promise<AlbumArtist> {
    return prisma.albumArtist.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteAlbumArtist (
    id: string
  ): Promise<AlbumArtist> {
    return prisma.albumArtist.delete({ where: { id } });
  };

  async deleteAlbumArtistByAlbumAndArtist (
    albumId: string,
    artistId: string,
    role: string = 'primary'
  ): Promise<AlbumArtist> {
    return prisma.albumArtist.delete({
      where: {
        album_id_artist_id_role: {
          album_id: albumId,
          artist_id: artistId,
          role: role
        }
      }
    });
  };

  // ========== UTILITY ==========
  async albumArtistExists (
    id: string
  ): Promise<boolean> {
    const albumArtist = await prisma.albumArtist.findUnique({ where: { id } });
    return albumArtist !== null;
  };

  async albumArtistExistsByAlbumAndArtist (
    albumId: string,
    artistId: string,
    role: string = 'primary'
  ): Promise<boolean> {
    const albumArtist = await this.getAlbumArtistByAlbumAndArtist(albumId, artistId, role);
    return albumArtist !== null;
  };

  async countAlbumArtists (): Promise<number> {
    return prisma.albumArtist.count();
  };
}
