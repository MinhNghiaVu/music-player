import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  AlbumModel, 
  AlbumWithRelations,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class AlbumRepository extends AbstractBaseRepository<
  AlbumModel,
  Prisma.AlbumCreateInput,
  Prisma.AlbumUpdateInput,
  Prisma.AlbumWhereUniqueInput
> {
  constructor() {
    super('album');
  }

  // Create operations
  async createAlbum(data: Prisma.AlbumCreateInput): Promise<AlbumModel> {
    return this.create(data);
  }

  async createManyAlbums(data: Prisma.AlbumCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readAlbum(id: string, options?: RepositoryOptions): Promise<AlbumModel | null> {
    return this.findUnique({ id }, options);
  }

  async readAlbumWithRelations(id: string): Promise<AlbumWithRelations | null> {
    return this.findUnique(
      { id },
      {
        include: {
          songs: true,
          album_artists: {
            include: {
              artist: true,
            },
          },
        },
      }
    ) as Promise<AlbumWithRelations | null>;
  }

  async readAlbums(options?: RepositoryOptions): Promise<AlbumModel[]> {
    return this.findMany(options);
  }

  async readAlbumsPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readAlbumsByTitle(
    title: string,
    options?: RepositoryOptions
  ): Promise<AlbumModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });
  }

  async readAlbumsByType(
    albumType: string,
    options?: RepositoryOptions
  ): Promise<AlbumModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        album_type: albumType,
      },
    });
  }

  async readAlbumsByGenres(
    genres: string[],
    options?: RepositoryOptions
  ): Promise<AlbumModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        genres: {
          hasSome: genres,
        },
      },
    });
  }

  async readAlbumsByReleaseYear(
    year: number,
    options?: RepositoryOptions
  ): Promise<AlbumModel[]> {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        release_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async readAlbumsByDateRange(
    startDate: Date,
    endDate: Date,
    options?: RepositoryOptions
  ): Promise<AlbumModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        release_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async readRecentAlbums(
    daysSince: number = 30,
    limit: number = 50
  ): Promise<AlbumModel[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - daysSince);

    return this.findMany({
      where: {
        release_date: {
          gte: sinceDate,
        },
      },
      orderBy: {
        release_date: 'desc',
      },
      take: limit,
    });
  }

  async readAlbumsByRecordLabel(
    recordLabel: string,
    options?: RepositoryOptions
  ): Promise<AlbumModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        record_label: {
          contains: recordLabel,
          mode: 'insensitive',
        },
      },
    });
  }

  // Update operations
  async updateAlbum(id: string, data: Prisma.AlbumUpdateInput): Promise<AlbumModel> {
    return this.update({ id }, data);
  }

  async updateAlbumDetails(
    id: string,
    albumData: {
      title?: string;
      description?: string;
      cover_image_url?: string;
      record_label?: string;
      copyright_info?: string;
      genres?: string[];
    }
  ): Promise<AlbumModel> {
    const album = await this.readAlbum(id);
    if (!album) {
      throw new NotFoundError('Album', id);
    }

    return this.update({ id }, albumData);
  }

  async updateAlbumReleaseDate(
    id: string,
    releaseDate: Date
  ): Promise<AlbumModel> {
    return this.update(
      { id },
      {
        release_date: releaseDate,
        updated_at: new Date(),
      }
    );
  }

  async updateAlbumType(
    id: string,
    albumType: string
  ): Promise<AlbumModel> {
    if (!['album', 'single', 'ep', 'compilation'].includes(albumType)) {
      throw new ValidationError('Invalid album type', 'album_type');
    }

    return this.update(
      { id },
      {
        album_type: albumType,
        updated_at: new Date(),
      }
    );
  }

  async updateAlbumStats(
    id: string,
    stats: {
      total_songs?: number;
      duration_seconds?: number;
    }
  ): Promise<AlbumModel> {
    if (stats.total_songs !== undefined && stats.total_songs < 0) {
      throw new ValidationError('Total songs cannot be negative', 'total_songs');
    }

    if (stats.duration_seconds !== undefined && stats.duration_seconds < 0) {
      throw new ValidationError('Duration cannot be negative', 'duration_seconds');
    }

    return this.update(
      { id },
      {
        ...stats,
        updated_at: new Date(),
      }
    );
  }

  async updateManyAlbums(
    where: Prisma.AlbumWhereInput,
    data: Prisma.AlbumUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteAlbum(id: string): Promise<AlbumModel> {
    return this.delete({ id });
  }

  async deleteManyAlbums(where?: Prisma.AlbumWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteAlbumsOlderThan(years: number = 50): Promise<Prisma.BatchPayload> {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - years);

    return this.deleteMany({
      release_date: {
        lt: cutoffDate,
      },
      total_songs: 0, // Only delete empty albums
    });
  }

  // Utility operations
  async albumExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countAlbums(options?: { where?: Prisma.AlbumWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countAlbumsByType(albumType: string): Promise<number> {
    return this.count({
      where: {
        album_type: albumType,
      },
    });
  }

  async countAlbumsByGenre(genre: string): Promise<number> {
    return this.count({
      where: {
        genres: {
          has: genre,
        },
      },
    });
  }

  async countAlbumsByYear(year: number): Promise<number> {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    return this.count({
      where: {
        release_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // Complex business logic operations
  async readAlbumWithFullDetails(id: string): Promise<AlbumWithRelations | null> {
    try {
      const album = await this.findUnique(
        { id },
        {
          include: {
            songs: {
              include: {
                song_artists: {
                  include: {
                    artist: true,
                  },
                },
              },
              orderBy: {
                song_number: 'asc',
              },
            },
            album_artists: {
              include: {
                artist: true,
              },
            },
          },
        }
      );

      return album as AlbumWithRelations | null;
    } catch (error) {
      logger.error('Error fetching album with full details', { albumId: id, error });
      throw error;
    }
  }

  async searchAlbums(query: string, options?: RepositoryOptions): Promise<AlbumModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            record_label: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            genres: {
              hasSome: [query],
            },
          },
        ],
      },
    });
  }

  async readAlbumsByArtist(
    artistId: string,
    options?: RepositoryOptions
  ): Promise<AlbumModel[]> {
    try {
      const result = await this.prisma.albumArtist.findMany({
        where: {
          artist_id: artistId,
        },
        include: {
          album: true,
        },
        orderBy: {
          album: {
            release_date: 'desc',
          },
        },
        ...this.buildQueryOptions(options),
      });

      return result.map((aa: any) => aa.album);
    } catch (error) {
      logger.error('Error fetching albums by artist', { artistId, error });
      throw error;
    }
  }

  async readSimilarAlbums(
    albumId: string,
    limit: number = 10
  ): Promise<AlbumModel[]> {
    const album = await this.readAlbum(albumId);
    if (!album) {
      throw new NotFoundError('Album', albumId);
    }

    // Find albums with similar genres and type
    return this.findMany({
      where: {
        id: {
          not: albumId,
        },
        OR: [
          {
            genres: {
              hasSome: album.genres || [],
            },
          },
          {
            album_type: album.album_type,
          },
        ],
      },
      orderBy: {
        release_date: 'desc',
      },
      take: limit,
    });
  }

  async readAlbumSongs(albumId: string): Promise<any[]> {
    try {
      const songs = await this.prisma.song.findMany({
        where: {
          album_id: albumId,
        },
        include: {
          song_artists: {
            include: {
              artist: true,
            },
          },
        },
        orderBy: [
          { disc_number: 'asc' },
          { song_number: 'asc' },
        ],
      });

      return songs;
    } catch (error) {
      logger.error('Error fetching album songs', { albumId, error });
      throw error;
    }
  }

  async calculateAlbumDuration(albumId: string): Promise<number> {
    try {
      const result = await this.prisma.song.aggregate({
        where: {
          album_id: albumId,
        },
        _sum: {
          duration_seconds: true,
        },
      });

      return result._sum.duration_seconds || 0;
    } catch (error) {
      logger.error('Error calculating album duration', { albumId, error });
      throw error;
    }
  }

  async updateAlbumGenres(
    id: string,
    genres: string[]
  ): Promise<AlbumModel> {
    if (genres.length === 0) {
      throw new ValidationError('At least one genre is required', 'genres');
    }

    return this.update(
      { id },
      {
        genres,
        updated_at: new Date(),
      }
    );
  }

  async addGenreToAlbum(
    id: string,
    genre: string
  ): Promise<AlbumModel> {
    const album = await this.readAlbum(id);
    if (!album) {
      throw new NotFoundError('Album', id);
    }

    const currentGenres = album.genres || [];
    if (currentGenres.includes(genre)) {
      return album; // Genre already exists
    }

    return this.update(
      { id },
      {
        genres: [...currentGenres, genre],
        updated_at: new Date(),
      }
    );
  }

  async removeGenreFromAlbum(
    id: string,
    genre: string
  ): Promise<AlbumModel> {
    const album = await this.readAlbum(id);
    if (!album) {
      throw new NotFoundError('Album', id);
    }

    const currentGenres = album.genres || [];
    const updatedGenres = currentGenres.filter(g => g !== genre);

    if (updatedGenres.length === 0) {
      throw new ValidationError('Cannot remove last genre from album', 'genres');
    }

    return this.update(
      { id },
      {
        genres: updatedGenres,
        updated_at: new Date(),
      }
    );
  }

  async syncAlbumStats(albumId: string): Promise<AlbumModel> {
    try {
      const stats = await this.prisma.song.aggregate({
        where: {
          album_id: albumId,
        },
        _count: {
          id: true,
        },
        _sum: {
          duration_seconds: true,
        },
      });

      return this.update(
        { id: albumId },
        {
          total_songs: stats._count.id,
          duration_seconds: stats._sum.duration_seconds || 0,
          updated_at: new Date(),
        }
      );
    } catch (error) {
      logger.error('Error syncing album stats', { albumId, error });
      throw error;
    }
  }

  async readTopAlbumsByGenre(
    genre: string,
    limit: number = 20
  ): Promise<AlbumModel[]> {
    return this.findMany({
      where: {
        genres: {
          has: genre,
        },
      },
      orderBy: {
        release_date: 'desc',
      },
      take: limit,
    });
  }

  async readAlbumsByDecade(decade: number): Promise<AlbumModel[]> {
    const startYear = Math.floor(decade / 10) * 10;
    const endYear = startYear + 9;
    const startDate = new Date(`${startYear}-01-01`);
    const endDate = new Date(`${endYear}-12-31`);

    return this.findMany({
      where: {
        release_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        release_date: 'desc',
      },
    });
  }
}

export const albumRepository = new AlbumRepository();