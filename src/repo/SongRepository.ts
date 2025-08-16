import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  SongModel, 
  SongWithRelations,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class SongRepository extends AbstractBaseRepository<
  SongModel,
  Prisma.SongCreateInput,
  Prisma.SongUpdateInput,
  Prisma.SongWhereUniqueInput
> {
  constructor() {
    super('song');
  }

  // Create operations
  async createSong(data: Prisma.SongCreateInput): Promise<SongModel> {
    return this.create(data);
  }

  async createManySongs(data: Prisma.SongCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readSong(id: string, options?: RepositoryOptions): Promise<SongModel | null> {
    return this.findUnique({ id }, options);
  }

  async readSongWithRelations(id: string): Promise<SongWithRelations | null> {
    return this.findUnique(
      { id },
      {
        include: {
          album: true,
          song_artists: {
            include: {
              artist: true,
            },
          },
        },
      }
    ) as Promise<SongWithRelations | null>;
  }

  async readSongs(options?: RepositoryOptions): Promise<SongModel[]> {
    return this.findMany(options);
  }

  async readSongsPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readSongsByTitle(
    title: string,
    options?: RepositoryOptions
  ): Promise<SongModel[]> {
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

  async readSongsByAlbum(
    albumId: string,
    options?: RepositoryOptions
  ): Promise<SongModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        album_id: albumId,
      },
      orderBy: [
        { disc_number: 'asc' },
        { song_number: 'asc' },
      ] as any,
    });
  }

  async readSongsByGenres(
    genres: string[],
    options?: RepositoryOptions
  ): Promise<SongModel[]> {
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

  async readSongsByDuration(
    minDuration?: number,
    maxDuration?: number,
    options?: RepositoryOptions
  ): Promise<SongModel[]> {
    const durationFilter: any = {};
    if (minDuration !== undefined) durationFilter.gte = minDuration;
    if (maxDuration !== undefined) durationFilter.lte = maxDuration;

    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        duration_seconds: durationFilter,
      },
    });
  }

  async readPopularSongs(
    limit: number = 50,
    options?: RepositoryOptions
  ): Promise<SongModel[]> {
    return this.findMany({
      ...options,
      orderBy: {
        play_count: 'desc',
      },
      take: limit,
    });
  }

  async readRecentSongs(
    daysSince: number = 30,
    limit: number = 50
  ): Promise<SongModel[]> {
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

  async readExplicitSongs(options?: RepositoryOptions): Promise<SongModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        explicit_content: true,
      },
    });
  }

  async readSongsByReleaseYear(
    year: number,
    options?: RepositoryOptions
  ): Promise<SongModel[]> {
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

  // Update operations
  async updateSong(id: string, data: Prisma.SongUpdateInput): Promise<SongModel> {
    return this.update({ id }, data);
  }

  async updateSongDetails(
    id: string,
    songData: {
      title?: string;
      duration_seconds?: number;
      song_number?: number;
      disc_number?: number;
      preview_url?: string;
      lyrics?: string;
      explicit_content?: boolean;
      isrc?: string;
      genres?: string[];
    }
  ): Promise<SongModel> {
    const song = await this.readSong(id);
    if (!song) {
      throw new NotFoundError('Song', id);
    }

    if (songData.duration_seconds !== undefined && songData.duration_seconds <= 0) {
      throw new ValidationError('Duration must be positive', 'duration_seconds');
    }

    return this.update({ id }, songData);
  }

  async updateSongPlayCount(id: string, increment: number = 1): Promise<SongModel> {
    if (increment < 0) {
      throw new ValidationError('Play count increment cannot be negative', 'increment');
    }

    return this.update(
      { id },
      {
        play_count: {
          increment: BigInt(increment),
        },
        updated_at: new Date(),
      }
    );
  }

  async updateSongLikeCount(id: string, increment: number): Promise<SongModel> {
    return this.update(
      { id },
      {
        like_count: {
          increment,
        },
        updated_at: new Date(),
      }
    );
  }

  async updateSongPosition(
    id: string,
    songNumber: number,
    discNumber: number = 1
  ): Promise<SongModel> {
    if (songNumber <= 0) {
      throw new ValidationError('Song number must be positive', 'song_number');
    }

    if (discNumber <= 0) {
      throw new ValidationError('Disc number must be positive', 'disc_number');
    }

    return this.update(
      { id },
      {
        song_number: songNumber,
        disc_number: discNumber,
        updated_at: new Date(),
      }
    );
  }

  async updateManySongs(
    where: Prisma.SongWhereInput,
    data: Prisma.SongUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteSong(id: string): Promise<SongModel> {
    return this.delete({ id });
  }

  async deleteManySongs(where?: Prisma.SongWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteSongsWithZeroPlays(
    olderThanDays: number = 365
  ): Promise<Prisma.BatchPayload> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return this.deleteMany({
      play_count: 0,
      created_at: {
        lt: cutoffDate,
      },
    });
  }

  // Utility operations
  async songExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countSongs(options?: { where?: Prisma.SongWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countSongsByGenre(genre: string): Promise<number> {
    return this.count({
      where: {
        genres: {
          has: genre,
        },
      },
    });
  }

  async countExplicitSongs(): Promise<number> {
    return this.count({
      where: {
        explicit_content: true,
      },
    });
  }

  async getTotalPlayCount(): Promise<bigint> {
    try {
      const result = await this.prisma.song.aggregate({
        _sum: {
          play_count: true,
        },
      });

      return result._sum.play_count || BigInt(0);
    } catch (error) {
      logger.error('Error getting total play count', { error });
      throw error;
    }
  }

  async getAverageDuration(): Promise<number> {
    try {
      const result = await this.prisma.song.aggregate({
        _avg: {
          duration_seconds: true,
        },
      });

      return result._avg.duration_seconds || 0;
    } catch (error) {
      logger.error('Error getting average duration', { error });
      throw error;
    }
  }

  // Complex business logic operations
  async readSongWithFullDetails(id: string): Promise<SongWithRelations | null> {
    try {
      const song = await this.findUnique(
        { id },
        {
          include: {
            album: {
              include: {
                album_artists: {
                  include: {
                    artist: true,
                  },
                },
              },
            },
            song_artists: {
              include: {
                artist: true,
              },
            },
            playlist_songs: {
              include: {
                playlist: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        }
      );

      return song as SongWithRelations | null;
    } catch (error) {
      logger.error('Error fetching song with full details', { songId: id, error });
      throw error;
    }
  }

  async searchSongs(query: string, options?: RepositoryOptions): Promise<SongModel[]> {
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
            lyrics: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            genres: {
              hasSome: [query],
            },
          },
          {
            isrc: {
              contains: query,
            },
          },
        ],
      },
    });
  }

  async readSongsByArtist(
    artistId: string,
    options?: RepositoryOptions
  ): Promise<SongModel[]> {
    try {
      const result = await this.prisma.songArtist.findMany({
        where: {
          artist_id: artistId,
        },
        include: {
          song: true,
        },
        orderBy: {
          song: {
            play_count: 'desc',
          },
        },
        ...this.buildQueryOptions(options),
      });

      return result.map((ta: any) => ta.song);
    } catch (error) {
      logger.error('Error fetching songs by artist', { artistId, error });
      throw error;
    }
  }

  async readSimilarSongs(
    songId: string,
    limit: number = 10
  ): Promise<SongModel[]> {
    const song = await this.readSong(songId);
    if (!song) {
      throw new NotFoundError('Song', songId);
    }

    // Find songs with similar genres, duration, and from same album
    const similarDurationMin = song.duration_seconds * 0.8;
    const similarDurationMax = song.duration_seconds * 1.2;

    return this.findMany({
      where: {
        id: {
          not: songId,
        },
        OR: [
          {
            genres: {
              hasSome: song.genres || [],
            },
          },
          {
            album_id: song.album_id,
          },
          {
            duration_seconds: {
              gte: Math.floor(similarDurationMin),
              lte: Math.ceil(similarDurationMax),
            },
          },
        ],
      },
      orderBy: {
        play_count: 'desc',
      },
      take: limit,
    });
  }

  async readSongHistory(
    songId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      return await this.prisma.listeningHistory.findMany({
        where: {
          song_id: songId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              display_name: true,
            },
          },
        },
        orderBy: {
          played_at: 'desc',
        },
        ...this.buildQueryOptions(options),
      });
    } catch (error) {
      logger.error('Error fetching song history', { songId, error });
      throw error;
    }
  }

  async readSongPlaylistInclusions(songId: string): Promise<any[]> {
    try {
      return await this.prisma.playlistSong.findMany({
        where: {
          song_id: songId,
        },
        include: {
          playlist: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  display_name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      logger.error('Error fetching song playlist inclusions', { songId, error });
      throw error;
    }
  }

  async updateSongGenres(
    id: string,
    genres: string[]
  ): Promise<SongModel> {
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

  async addGenreToSong(
    id: string,
    genre: string
  ): Promise<SongModel> {
    const song = await this.readSong(id);
    if (!song) {
      throw new NotFoundError('Song', id);
    }

    const currentGenres = song.genres || [];
    if (currentGenres.includes(genre)) {
      return song; // Genre already exists
    }

    return this.update(
      { id },
      {
        genres: [...currentGenres, genre],
        updated_at: new Date(),
      }
    );
  }

  async removeGenreFromSong(
    id: string,
    genre: string
  ): Promise<SongModel> {
    const song = await this.readSong(id);
    if (!song) {
      throw new NotFoundError('Song', id);
    }

    const currentGenres = song.genres || [];
    const updatedGenres = currentGenres.filter(g => g !== genre);

    if (updatedGenres.length === 0) {
      throw new ValidationError('Cannot remove last genre from song', 'genres');
    }

    return this.update(
      { id },
      {
        genres: updatedGenres,
        updated_at: new Date(),
      }
    );
  }

  async readTopSongsByGenre(
    genre: string,
    limit: number = 20
  ): Promise<SongModel[]> {
    return this.findMany({
      where: {
        genres: {
          has: genre,
        },
      },
      orderBy: {
        play_count: 'desc',
      },
      take: limit,
    });
  }

  async readTrendingSongs(
    daysSince: number = 7,
    limit: number = 50
  ): Promise<SongModel[]> {
    // This is a simplified trending algorithm
    // In a real system, you'd want to calculate trend based on play count growth
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - daysSince);

    return this.findMany({
      where: {
        updated_at: {
          gte: sinceDate,
        },
      },
      orderBy: [
        { play_count: 'desc' },
        { like_count: 'desc' },
      ] as any,
      take: limit,
    });
  }

  async readRandomSongs(
    limit: number = 10,
    filters?: Prisma.SongWhereInput
  ): Promise<SongModel[]> {
    // PostgreSQL specific random selection
    try {
      const totalCount = await this.count({ where: filters });
      if (totalCount === 0) return [];

      const skip = Math.floor(Math.random() * Math.max(0, totalCount - limit));

      return this.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc', // Fallback ordering
        },
      });
    } catch (error) {
      logger.error('Error fetching random songs', { error });
      throw error;
    }
  }

  async incrementSongPlayCount(id: string): Promise<void> {
    try {
      await this.updateSongPlayCount(id, 1);
    } catch (error) {
      logger.error('Error incrementing song play count', { songId: id, error });
      // Don't throw - play count updates shouldn't break playback
    }
  }

  async getSongStats(id: string): Promise<{
    playCount: bigint;
    likeCount: number;
    playlistInclusions: number;
    lastPlayed?: Date;
  }> {
    try {
      const song = await this.readSong(id);
      if (!song) {
        throw new NotFoundError('Song', id);
      }

      const [playlistCount, lastPlayRecord] = await Promise.all([
        this.prisma.playlistSong.count({
          where: { song_id: id },
        }),
        this.prisma.listeningHistory.findFirst({
          where: { song_id: id },
          orderBy: { played_at: 'desc' },
          select: { played_at: true },
        }),
      ]);

      return {
        playCount: song.play_count,
        likeCount: song.like_count,
        playlistInclusions: playlistCount,
        lastPlayed: lastPlayRecord?.played_at,
      };
    } catch (error) {
      logger.error('Error getting song stats', { songId: id, error });
      throw error;
    }
  }
}

export const songRepository = new SongRepository();