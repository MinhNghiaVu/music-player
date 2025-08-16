import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  ArtistModel, 
  ArtistWithRelations,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class ArtistRepository extends AbstractBaseRepository<
  ArtistModel,
  Prisma.ArtistCreateInput,
  Prisma.ArtistUpdateInput,
  Prisma.ArtistWhereUniqueInput
> {
  constructor() {
    super('artist');
  }

  // Create operations
  async createArtist(data: Prisma.ArtistCreateInput): Promise<ArtistModel> {
    return this.create(data);
  }

  async createManyArtists(data: Prisma.ArtistCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readArtist(id: string, options?: RepositoryOptions): Promise<ArtistModel | null> {
    return this.findUnique({ id }, options);
  }

  async readArtistByName(name: string, options?: RepositoryOptions): Promise<ArtistModel | null> {
    return this.findFirst({
      ...options,
      where: {
        ...options?.where,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async readArtistWithRelations(id: string): Promise<ArtistWithRelations | null> {
    return this.findUnique(
      { id },
      {
        include: {
          album_artists: {
            include: {
              album: true,
            },
          },
          song_artists: {
            include: {
              song: true,
            },
          },
        },
      }
    ) as Promise<ArtistWithRelations | null>;
  }

  async readArtists(options?: RepositoryOptions): Promise<ArtistModel[]> {
    return this.findMany(options);
  }

  async readArtistsPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readVerifiedArtists(options?: RepositoryOptions): Promise<ArtistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        verified: true,
      },
    });
  }

  async readArtistsByGenres(
    genres: string[],
    options?: RepositoryOptions
  ): Promise<ArtistModel[]> {
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

  async readArtistsByCountry(
    countryCode: string,
    options?: RepositoryOptions
  ): Promise<ArtistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        country_code: countryCode,
      },
    });
  }

  async readPopularArtists(
    limit: number = 50,
    options?: RepositoryOptions
  ): Promise<ArtistModel[]> {
    return this.findMany({
      ...options,
      orderBy: {
        monthly_listeners: 'desc',
      },
      take: limit,
    });
  }

  async readTrendingArtists(
    daysSince: number = 30,
    limit: number = 50
  ): Promise<ArtistModel[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - daysSince);

    return this.findMany({
      where: {
        updated_at: {
          gte: sinceDate,
        },
      },
      orderBy: {
        monthly_listeners: 'desc',
      },
      take: limit,
    });
  }

  // Update operations
  async updateArtist(id: string, data: Prisma.ArtistUpdateInput): Promise<ArtistModel> {
    return this.update({ id }, data);
  }

  async updateArtistProfile(
    id: string,
    profileData: {
      bio?: string;
      profile_image_url?: string;
      banner_image_url?: string;
      country_code?: string;
      genres?: string[];
    }
  ): Promise<ArtistModel> {
    const artist = await this.readArtist(id);
    if (!artist) {
      throw new NotFoundError('Artist', id);
    }

    return this.update({ id }, profileData);
  }

  async updateArtistVerificationStatus(
    id: string,
    verified: boolean
  ): Promise<ArtistModel> {
    return this.update(
      { id },
      {
        verified,
        updated_at: new Date(),
      }
    );
  }

  async updateArtistMonthlyListeners(
    id: string,
    monthlyListeners: number
  ): Promise<ArtistModel> {
    if (monthlyListeners < 0) {
      throw new ValidationError('Monthly listeners cannot be negative', 'monthly_listeners');
    }

    return this.update(
      { id },
      {
        monthly_listeners: monthlyListeners,
        updated_at: new Date(),
      }
    );
  }

  async incrementArtistMonthlyListeners(
    id: string,
    increment: number = 1
  ): Promise<ArtistModel> {
    if (increment < 0) {
      throw new ValidationError('Increment cannot be negative', 'increment');
    }

    return this.update(
      { id },
      {
        monthly_listeners: {
          increment,
        },
        updated_at: new Date(),
      }
    );
  }

  async updateManyArtists(
    where: Prisma.ArtistWhereInput,
    data: Prisma.ArtistUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteArtist(id: string): Promise<ArtistModel> {
    return this.delete({ id });
  }

  async deleteManyArtists(where?: Prisma.ArtistWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteUnverifiedArtistsOlderThan(days: number = 365): Promise<Prisma.BatchPayload> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.deleteMany({
      verified: false,
      created_at: {
        lt: cutoffDate,
      },
      monthly_listeners: {
        lt: 100, // Low engagement threshold
      },
    });
  }

  // Utility operations
  async artistExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async artistExistsByName(name: string): Promise<boolean> {
    const artist = await this.readArtistByName(name);
    return artist !== null;
  }

  async countArtists(options?: { where?: Prisma.ArtistWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countVerifiedArtists(): Promise<number> {
    return this.count({
      where: {
        verified: true,
      },
    });
  }

  async countArtistsByGenre(genre: string): Promise<number> {
    return this.count({
      where: {
        genres: {
          has: genre,
        },
      },
    });
  }

  // Complex business logic operations
  async readArtistWithFullDiscography(id: string): Promise<ArtistWithRelations | null> {
    try {
      const artist = await this.findUnique(
        { id },
        {
          include: {
            album_artists: {
              include: {
                album: {
                  include: {
                    songs: {
                      include: {
                        song_artists: {
                          include: {
                            artist: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            song_artists: {
              include: {
                song: {
                  include: {
                    album: true,
                  },
                },
              },
            },
          },
        }
      );

      return artist as ArtistWithRelations | null;
    } catch (error) {
      logger.error('Error fetching artist with full discography', { artistId: id, error });
      throw error;
    }
  }

  async searchArtists(query: string, options?: RepositoryOptions): Promise<ArtistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            bio: {
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

  async readSimilarArtists(
    artistId: string,
    limit: number = 10
  ): Promise<ArtistModel[]> {
    const artist = await this.readArtist(artistId);
    if (!artist) {
      throw new NotFoundError('Artist', artistId);
    }

    // Find artists with similar genres
    return this.findMany({
      where: {
        id: {
          not: artistId,
        },
        genres: {
          hasSome: artist.genres || [],
        },
      },
      orderBy: {
        monthly_listeners: 'desc',
      },
      take: limit,
    });
  }

  async readArtistTopSongs(
    artistId: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      // This would need to join with songs and order by play_count
      const result = await this.prisma.songArtist.findMany({
        where: {
          artist_id: artistId,
          role: 'primary',
        },
        include: {
          song: {
            include: {
              album: true,
              song_artists: {
                include: {
                  artist: true,
                },
              },
            },
          },
        },
        orderBy: {
          song: {
            play_count: 'desc',
          },
        },
        take: limit,
      });

      return result.map(ta => ta.song);
    } catch (error) {
      logger.error('Error fetching artist top songs', { artistId, error });
      throw error;
    }
  }

  async readFollowersCount(artistId: string): Promise<number> {
    try {
      return await this.prisma.userFollow.count({
        where: {
          followable_type: 'artist',
          followable_id: artistId,
        },
      });
    } catch (error) {
      logger.error('Error counting artist followers', { artistId, error });
      throw error;
    }
  }

  async readArtistAlbums(
    artistId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      const result = await this.prisma.albumArtist.findMany({
        where: {
          artist_id: artistId,
        },
        include: {
          album: {
            include: {
              songs: true,
            },
          },
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
      logger.error('Error fetching artist albums', { artistId, error });
      throw error;
    }
  }

  async updateArtistGenres(
    id: string,
    genres: string[]
  ): Promise<ArtistModel> {
    // Validate genres (you might want to check against a predefined list)
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

  async addGenreToArtist(
    id: string,
    genre: string
  ): Promise<ArtistModel> {
    const artist = await this.readArtist(id);
    if (!artist) {
      throw new NotFoundError('Artist', id);
    }

    const currentGenres = artist.genres || [];
    if (currentGenres.includes(genre)) {
      return artist; // Genre already exists
    }

    return this.update(
      { id },
      {
        genres: [...currentGenres, genre],
        updated_at: new Date(),
      }
    );
  }

  async removeGenreFromArtist(
    id: string,
    genre: string
  ): Promise<ArtistModel> {
    const artist = await this.readArtist(id);
    if (!artist) {
      throw new NotFoundError('Artist', id);
    }

    const currentGenres = artist.genres || [];
    const updatedGenres = currentGenres.filter(g => g !== genre);

    if (updatedGenres.length === 0) {
      throw new ValidationError('Cannot remove last genre from artist', 'genres');
    }

    return this.update(
      { id },
      {
        genres: updatedGenres,
        updated_at: new Date(),
      }
    );
  }
}

export const artistRepository = new ArtistRepository();