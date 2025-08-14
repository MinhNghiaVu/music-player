import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  TrackModel, 
  TrackWithRelations,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class TrackRepository extends AbstractBaseRepository<
  TrackModel,
  Prisma.TrackCreateInput,
  Prisma.TrackUpdateInput,
  Prisma.TrackWhereUniqueInput
> {
  constructor() {
    super('track');
  }

  // Create operations
  async createTrack(data: Prisma.TrackCreateInput): Promise<TrackModel> {
    return this.create(data);
  }

  async createManyTracks(data: Prisma.TrackCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readTrack(id: string, options?: RepositoryOptions): Promise<TrackModel | null> {
    return this.findUnique({ id }, options);
  }

  async readTrackWithRelations(id: string): Promise<TrackWithRelations | null> {
    return this.findUnique(
      { id },
      {
        include: {
          album: true,
          track_artists: {
            include: {
              artist: true,
            },
          },
        },
      }
    ) as Promise<TrackWithRelations | null>;
  }

  async readTracks(options?: RepositoryOptions): Promise<TrackModel[]> {
    return this.findMany(options);
  }

  async readTracksPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readTracksByTitle(
    title: string,
    options?: RepositoryOptions
  ): Promise<TrackModel[]> {
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

  async readTracksByAlbum(
    albumId: string,
    options?: RepositoryOptions
  ): Promise<TrackModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        album_id: albumId,
      },
      orderBy: [
        { disc_number: 'asc' },
        { track_number: 'asc' },
      ] as any,
    });
  }

  async readTracksByGenres(
    genres: string[],
    options?: RepositoryOptions
  ): Promise<TrackModel[]> {
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

  async readTracksByDuration(
    minDuration?: number,
    maxDuration?: number,
    options?: RepositoryOptions
  ): Promise<TrackModel[]> {
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

  async readPopularTracks(
    limit: number = 50,
    options?: RepositoryOptions
  ): Promise<TrackModel[]> {
    return this.findMany({
      ...options,
      orderBy: {
        play_count: 'desc',
      },
      take: limit,
    });
  }

  async readRecentTracks(
    daysSince: number = 30,
    limit: number = 50
  ): Promise<TrackModel[]> {
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

  async readExplicitTracks(options?: RepositoryOptions): Promise<TrackModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        explicit_content: true,
      },
    });
  }

  async readTracksByReleaseYear(
    year: number,
    options?: RepositoryOptions
  ): Promise<TrackModel[]> {
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
  async updateTrack(id: string, data: Prisma.TrackUpdateInput): Promise<TrackModel> {
    return this.update({ id }, data);
  }

  async updateTrackDetails(
    id: string,
    trackData: {
      title?: string;
      duration_seconds?: number;
      track_number?: number;
      disc_number?: number;
      preview_url?: string;
      lyrics?: string;
      explicit_content?: boolean;
      isrc?: string;
      genres?: string[];
    }
  ): Promise<TrackModel> {
    const track = await this.readTrack(id);
    if (!track) {
      throw new NotFoundError('Track', id);
    }

    if (trackData.duration_seconds !== undefined && trackData.duration_seconds <= 0) {
      throw new ValidationError('Duration must be positive', 'duration_seconds');
    }

    return this.update({ id }, trackData);
  }

  async updateTrackPlayCount(id: string, increment: number = 1): Promise<TrackModel> {
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

  async updateTrackLikeCount(id: string, increment: number): Promise<TrackModel> {
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

  async updateTrackPosition(
    id: string,
    trackNumber: number,
    discNumber: number = 1
  ): Promise<TrackModel> {
    if (trackNumber <= 0) {
      throw new ValidationError('Track number must be positive', 'track_number');
    }

    if (discNumber <= 0) {
      throw new ValidationError('Disc number must be positive', 'disc_number');
    }

    return this.update(
      { id },
      {
        track_number: trackNumber,
        disc_number: discNumber,
        updated_at: new Date(),
      }
    );
  }

  async updateManyTracks(
    where: Prisma.TrackWhereInput,
    data: Prisma.TrackUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteTrack(id: string): Promise<TrackModel> {
    return this.delete({ id });
  }

  async deleteManyTracks(where?: Prisma.TrackWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteTracksWithZeroPlays(
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
  async trackExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countTracks(options?: { where?: Prisma.TrackWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countTracksByGenre(genre: string): Promise<number> {
    return this.count({
      where: {
        genres: {
          has: genre,
        },
      },
    });
  }

  async countExplicitTracks(): Promise<number> {
    return this.count({
      where: {
        explicit_content: true,
      },
    });
  }

  async getTotalPlayCount(): Promise<bigint> {
    try {
      const result = await this.prisma.track.aggregate({
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
      const result = await this.prisma.track.aggregate({
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
  async readTrackWithFullDetails(id: string): Promise<TrackWithRelations | null> {
    try {
      const track = await this.findUnique(
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
            track_artists: {
              include: {
                artist: true,
              },
            },
            playlist_tracks: {
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

      return track as TrackWithRelations | null;
    } catch (error) {
      logger.error('Error fetching track with full details', { trackId: id, error });
      throw error;
    }
  }

  async searchTracks(query: string, options?: RepositoryOptions): Promise<TrackModel[]> {
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

  async readTracksByArtist(
    artistId: string,
    options?: RepositoryOptions
  ): Promise<TrackModel[]> {
    try {
      const result = await this.prisma.trackArtist.findMany({
        where: {
          artist_id: artistId,
        },
        include: {
          track: true,
        },
        orderBy: {
          track: {
            play_count: 'desc',
          },
        },
        ...this.buildQueryOptions(options),
      });

      return result.map((ta: any) => ta.track);
    } catch (error) {
      logger.error('Error fetching tracks by artist', { artistId, error });
      throw error;
    }
  }

  async readSimilarTracks(
    trackId: string,
    limit: number = 10
  ): Promise<TrackModel[]> {
    const track = await this.readTrack(trackId);
    if (!track) {
      throw new NotFoundError('Track', trackId);
    }

    // Find tracks with similar genres, duration, and from same album
    const similarDurationMin = track.duration_seconds * 0.8;
    const similarDurationMax = track.duration_seconds * 1.2;

    return this.findMany({
      where: {
        id: {
          not: trackId,
        },
        OR: [
          {
            genres: {
              hasSome: track.genres || [],
            },
          },
          {
            album_id: track.album_id,
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

  async readTrackHistory(
    trackId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      return await this.prisma.listeningHistory.findMany({
        where: {
          track_id: trackId,
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
      logger.error('Error fetching track history', { trackId, error });
      throw error;
    }
  }

  async readTrackPlaylistInclusions(trackId: string): Promise<any[]> {
    try {
      return await this.prisma.playlistTrack.findMany({
        where: {
          track_id: trackId,
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
      logger.error('Error fetching track playlist inclusions', { trackId, error });
      throw error;
    }
  }

  async updateTrackGenres(
    id: string,
    genres: string[]
  ): Promise<TrackModel> {
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

  async addGenreToTrack(
    id: string,
    genre: string
  ): Promise<TrackModel> {
    const track = await this.readTrack(id);
    if (!track) {
      throw new NotFoundError('Track', id);
    }

    const currentGenres = track.genres || [];
    if (currentGenres.includes(genre)) {
      return track; // Genre already exists
    }

    return this.update(
      { id },
      {
        genres: [...currentGenres, genre],
        updated_at: new Date(),
      }
    );
  }

  async removeGenreFromTrack(
    id: string,
    genre: string
  ): Promise<TrackModel> {
    const track = await this.readTrack(id);
    if (!track) {
      throw new NotFoundError('Track', id);
    }

    const currentGenres = track.genres || [];
    const updatedGenres = currentGenres.filter(g => g !== genre);

    if (updatedGenres.length === 0) {
      throw new ValidationError('Cannot remove last genre from track', 'genres');
    }

    return this.update(
      { id },
      {
        genres: updatedGenres,
        updated_at: new Date(),
      }
    );
  }

  async readTopTracksByGenre(
    genre: string,
    limit: number = 20
  ): Promise<TrackModel[]> {
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

  async readTrendingTracks(
    daysSince: number = 7,
    limit: number = 50
  ): Promise<TrackModel[]> {
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

  async readRandomTracks(
    limit: number = 10,
    filters?: Prisma.TrackWhereInput
  ): Promise<TrackModel[]> {
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
      logger.error('Error fetching random tracks', { error });
      throw error;
    }
  }

  async incrementTrackPlayCount(id: string): Promise<void> {
    try {
      await this.updateTrackPlayCount(id, 1);
    } catch (error) {
      logger.error('Error incrementing track play count', { trackId: id, error });
      // Don't throw - play count updates shouldn't break playback
    }
  }

  async getTrackStats(id: string): Promise<{
    playCount: bigint;
    likeCount: number;
    playlistInclusions: number;
    lastPlayed?: Date;
  }> {
    try {
      const track = await this.readTrack(id);
      if (!track) {
        throw new NotFoundError('Track', id);
      }

      const [playlistCount, lastPlayRecord] = await Promise.all([
        this.prisma.playlistTrack.count({
          where: { track_id: id },
        }),
        this.prisma.listeningHistory.findFirst({
          where: { track_id: id },
          orderBy: { played_at: 'desc' },
          select: { played_at: true },
        }),
      ]);

      return {
        playCount: track.play_count,
        likeCount: track.like_count,
        playlistInclusions: playlistCount,
        lastPlayed: lastPlayRecord?.played_at,
      };
    } catch (error) {
      logger.error('Error getting track stats', { trackId: id, error });
      throw error;
    }
  }
}

export const trackRepository = new TrackRepository();