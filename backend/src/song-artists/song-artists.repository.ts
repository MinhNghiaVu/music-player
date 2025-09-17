import {
  Injectable
} from '@nestjs/common'

import { prisma } from '../database/client';
import type { SongArtist, Prisma } from '@prisma/client';

@Injectable()
export class SongArtistsRepo {
  // ========== CREATE ==========
  async createSongArtist (
    data: Prisma.SongArtistCreateInput
  ): Promise<SongArtist> {
    return prisma.songArtist.create({ data });
  }

  // ========== READ ==========
  async getSongArtistById (
    id: string
  ): Promise<SongArtist | null> {
    return prisma.songArtist.findUnique({ 
      where: { id },
      include: {
        song: true,
        artist: true
      }
    });
  }

  async getSongArtistsBySongId (
    songId: string
  ): Promise<SongArtist[]> {
    return prisma.songArtist.findMany({
      where: { song_id: songId },
      include: {
        artist: true
      },
      orderBy: { created_at: 'asc' }
    });
  }

  async getSongArtistsByArtistId (
    artistId: string
  ): Promise<SongArtist[]> {
    return prisma.songArtist.findMany({
      where: { artist_id: artistId },
      include: {
        song: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getSongArtistBySongAndArtist (
    songId: string,
    artistId: string,
    role: string = 'main'
  ): Promise<SongArtist | null> {
    return prisma.songArtist.findUnique({
      where: {
        song_id_artist_id_role: {
          song_id: songId,
          artist_id: artistId,
          role: role
        }
      }
    });
  }

  // ========== UPDATE ==========
  async updateSongArtist (
    id: string, 
    data: Prisma.SongArtistUpdateInput
  ): Promise<SongArtist> {
    return prisma.songArtist.update({
      where: { id },
      data
    });
  };

  // ========== DELETE ==========
  async deleteSongArtist (
    id: string
  ): Promise<SongArtist> {
    return prisma.songArtist.delete({ where: { id } });
  };

  async deleteSongArtistBySongAndArtist (
    songId: string,
    artistId: string,
    role: string = 'main'
  ): Promise<SongArtist> {
    return prisma.songArtist.delete({
      where: {
        song_id_artist_id_role: {
          song_id: songId,
          artist_id: artistId,
          role: role
        }
      }
    });
  };

  // ========== UTILITY ==========
  async songArtistExists (
    id: string
  ): Promise<boolean> {
    const songArtist = await prisma.songArtist.findUnique({ where: { id } });
    return songArtist !== null;
  };

  async songArtistExistsBySongAndArtist (
    songId: string,
    artistId: string,
    role: string = 'main'
  ): Promise<boolean> {
    const songArtist = await this.getSongArtistBySongAndArtist(songId, artistId, role);
    return songArtist !== null;
  };

  async countSongArtists (): Promise<number> {
    return prisma.songArtist.count();
  };
}
