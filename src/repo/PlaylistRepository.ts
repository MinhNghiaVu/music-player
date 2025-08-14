import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  PlaylistModel, 
  PlaylistWithRelations,
  RepositoryOptions,
  NotFoundError,
  ValidationError
} from './types';
import { logger } from '../utils/logger';

export class PlaylistRepository extends AbstractBaseRepository<
  PlaylistModel,
  Prisma.PlaylistCreateInput,
  Prisma.PlaylistUpdateInput,
  Prisma.PlaylistWhereUniqueInput
> {
  constructor() {
    super('playlist');
  }

  // Create operations
  async createPlaylist(data: Prisma.PlaylistCreateInput): Promise<PlaylistModel> {
    return this.create(data);
  }

  async createManyPlaylists(data: Prisma.PlaylistCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readPlaylist(id: string, options?: RepositoryOptions): Promise<PlaylistModel | null> {
    return this.findUnique({ id }, options);
  }

  async readPlaylistWithRelations(id: string): Promise<PlaylistWithRelations | null> {
    return this.findUnique(
      { id },
      {
        include: {
          user: true,
          playlist_tracks: {
            include: {
              track: {
                include: {
                  track_artists: {
                    include: {
                      artist: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      }
    ) as Promise<PlaylistWithRelations | null>;
  }

  async readPlaylists(options?: RepositoryOptions): Promise<PlaylistModel[]> {
    return this.findMany(options);
  }

  async readPlaylistsPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readPlaylistsByUser(
    userId: string,
    options?: RepositoryOptions
  ): Promise<PlaylistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async readPublicPlaylists(options?: RepositoryOptions): Promise<PlaylistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        is_public: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async readCollaborativePlaylists(
    userId: string,
    options?: RepositoryOptions
  ): Promise<PlaylistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        OR: [
          { user_id: userId },
          { is_collaborative: true },
        ],
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async readPlaylistsByName(
    name: string,
    options?: RepositoryOptions
  ): Promise<PlaylistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async readRecentPlaylists(
    daysSince: number = 30,
    limit: number = 50
  ): Promise<PlaylistModel[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - daysSince);

    return this.findMany({
      where: {
        created_at: {
          gte: sinceDate,
        },
        is_public: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
    });
  }

  async readPopularPlaylists(
    limit: number = 50,
    options?: RepositoryOptions
  ): Promise<PlaylistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        is_public: true,
      },
      orderBy: {
        total_tracks: 'desc',
      },
      take: limit,
    });
  }

  // Update operations
  async updatePlaylist(id: string, data: Prisma.PlaylistUpdateInput): Promise<PlaylistModel> {
    return this.update({ id }, data);
  }

  async updatePlaylistDetails(
    id: string,
    playlistData: {
      name?: string;
      description?: string;
      cover_image_url?: string;
      is_public?: boolean;
      is_collaborative?: boolean;
    }
  ): Promise<PlaylistModel> {
    const playlist = await this.readPlaylist(id);
    if (!playlist) {
      throw new NotFoundError('Playlist', id);
    }

    return this.update({ id }, playlistData);
  }

  async updatePlaylistVisibility(
    id: string,
    isPublic: boolean
  ): Promise<PlaylistModel> {
    return this.update(
      { id },
      {
        is_public: isPublic,
        updated_at: new Date(),
      }
    );
  }

  async updatePlaylistCollaborativeStatus(
    id: string,
    isCollaborative: boolean
  ): Promise<PlaylistModel> {
    return this.update(
      { id },
      {
        is_collaborative: isCollaborative,
        updated_at: new Date(),
      }
    );
  }

  async updatePlaylistStats(
    id: string,
    stats: {
      total_tracks?: number;
      total_duration_seconds?: number;
    }
  ): Promise<PlaylistModel> {
    if (stats.total_tracks !== undefined && stats.total_tracks < 0) {
      throw new ValidationError('Total tracks cannot be negative', 'total_tracks');
    }

    if (stats.total_duration_seconds !== undefined && stats.total_duration_seconds < 0) {
      throw new ValidationError('Total duration cannot be negative', 'total_duration_seconds');
    }

    return this.update(
      { id },
      {
        ...stats,
        updated_at: new Date(),
      }
    );
  }

  async updateManyPlaylists(
    where: Prisma.PlaylistWhereInput,
    data: Prisma.PlaylistUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deletePlaylist(id: string): Promise<PlaylistModel> {
    return this.delete({ id });
  }

  async deleteManyPlaylists(where?: Prisma.PlaylistWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteEmptyPlaylists(
    olderThanDays: number = 90
  ): Promise<Prisma.BatchPayload> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return this.deleteMany({
      total_tracks: 0,
      created_at: {
        lt: cutoffDate,
      },
    });
  }

  async deleteUserPlaylists(userId: string): Promise<Prisma.BatchPayload> {
    return this.deleteMany({
      user_id: userId,
    });
  }

  // Utility operations
  async playlistExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countPlaylists(options?: { where?: Prisma.PlaylistWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countUserPlaylists(userId: string): Promise<number> {
    return this.count({
      where: {
        user_id: userId,
      },
    });
  }

  async countPublicPlaylists(): Promise<number> {
    return this.count({
      where: {
        is_public: true,
      },
    });
  }

  async countCollaborativePlaylists(): Promise<number> {
    return this.count({
      where: {
        is_collaborative: true,
      },
    });
  }

  // Complex business logic operations
  async readPlaylistWithFullDetails(id: string): Promise<PlaylistWithRelations | null> {
    try {
      const playlist = await this.findUnique(
        { id },
        {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                display_name: true,
                profile_image_url: true,
              },
            },
            playlist_tracks: {
              include: {
                track: {
                  include: {
                    album: {
                      select: {
                        id: true,
                        title: true,
                        cover_image_url: true,
                      },
                    },
                    track_artists: {
                      include: {
                        artist: {
                          select: {
                            id: true,
                            name: true,
                            verified: true,
                          },
                        },
                      },
                    },
                  },
                },
                added_by_user: {
                  select: {
                    id: true,
                    username: true,
                    display_name: true,
                  },
                },
              },
              orderBy: {
                position: 'asc',
              },
            },
          },
        }
      );

      return playlist as PlaylistWithRelations | null;
    } catch (error) {
      logger.error('Error fetching playlist with full details', { playlistId: id, error });
      throw error;
    }
  }

  async searchPlaylists(query: string, options?: RepositoryOptions): Promise<PlaylistModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        is_public: true,
        OR: [
          {
            name: {
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
        ],
      },
    });
  }

  async addTrackToPlaylist(
    playlistId: string,
    trackId: string,
    addedBy?: string
  ): Promise<any> {
    try {
      // Get current track count to determine position
      const currentTrackCount = await this.prisma.playlistTrack.count({
        where: { playlist_id: playlistId },
      });

      // Check if track already exists in playlist
      const existingTrack = await this.prisma.playlistTrack.findFirst({
        where: {
          playlist_id: playlistId,
          track_id: trackId,
        },
      });

      if (existingTrack) {
        throw new ValidationError('Track already exists in playlist', 'track_id');
      }

      // Add track to playlist
      const playlistTrack = await this.prisma.playlistTrack.create({
        data: {
          playlist_id: playlistId,
          track_id: trackId,
          position: currentTrackCount + 1,
          added_by: addedBy,
        },
        include: {
          track: {
            include: {
              track_artists: {
                include: {
                  artist: true,
                },
              },
            },
          },
        },
      });

      // Update playlist stats
      await this.syncPlaylistStats(playlistId);

      return playlistTrack;
    } catch (error) {
      logger.error('Error adding track to playlist', { playlistId, trackId, error });
      throw error;
    }
  }

  async removeTrackFromPlaylist(
    playlistId: string,
    trackId: string
  ): Promise<void> {
    try {
      const playlistTrack = await this.prisma.playlistTrack.findFirst({
        where: {
          playlist_id: playlistId,
          track_id: trackId,
        },
      });

      if (!playlistTrack) {
        throw new NotFoundError('Track in playlist', `${playlistId}:${trackId}`);
      }

      // Remove the track
      await this.prisma.playlistTrack.delete({
        where: { id: playlistTrack.id },
      });

      // Reorder remaining tracks
      await this.prisma.playlistTrack.updateMany({
        where: {
          playlist_id: playlistId,
          position: { gt: playlistTrack.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });

      // Update playlist stats
      await this.syncPlaylistStats(playlistId);
    } catch (error) {
      logger.error('Error removing track from playlist', { playlistId, trackId, error });
      throw error;
    }
  }

  async reorderPlaylistTracks(
    playlistId: string,
    trackPositions: { trackId: string; position: number }[]
  ): Promise<void> {
    try {
      // Validate positions are sequential and start from 1
      const positions = trackPositions.map(tp => tp.position).sort((a, b) => a - b);
      for (let i = 0; i < positions.length; i++) {
        if (positions[i] !== i + 1) {
          throw new ValidationError('Positions must be sequential starting from 1', 'positions');
        }
      }

      // Update positions in a transaction
      await this.prisma.$transaction(
        trackPositions.map(({ trackId, position }) =>
          this.prisma.playlistTrack.updateMany({
            where: {
              playlist_id: playlistId,
              track_id: trackId,
            },
            data: { position },
          })
        )
      );
    } catch (error) {
      logger.error('Error reordering playlist tracks', { playlistId, error });
      throw error;
    }
  }

  async syncPlaylistStats(playlistId: string): Promise<PlaylistModel> {
    try {
      const stats = await this.prisma.playlistTrack.findMany({
        where: { playlist_id: playlistId },
        include: {
          track: {
            select: {
              duration_seconds: true,
            },
          },
        },
      });

      const totalTracks = stats.length;
      const totalDuration = stats.reduce(
        (sum, pt) => sum + pt.track.duration_seconds,
        0
      );

      return this.update(
        { id: playlistId },
        {
          total_tracks: totalTracks,
          total_duration_seconds: totalDuration,
          updated_at: new Date(),
        }
      );
    } catch (error) {
      logger.error('Error syncing playlist stats', { playlistId, error });
      throw error;
    }
  }

  async duplicatePlaylist(
    playlistId: string,
    newName: string,
    newUserId: string
  ): Promise<PlaylistModel> {
    try {
      const originalPlaylist = await this.readPlaylistWithRelations(playlistId);
      if (!originalPlaylist) {
        throw new NotFoundError('Playlist', playlistId);
      }

      // Create new playlist
      const newPlaylist = await this.create({
        name: newName,
        description: originalPlaylist.description,
        user: {
          connect: { id: newUserId },
        },
        is_public: false, // New playlists are private by default
        is_collaborative: false,
      });

      // Copy tracks if original playlist has any
      if (originalPlaylist.playlist_tracks && originalPlaylist.playlist_tracks.length > 0) {
        await this.prisma.playlistTrack.createMany({
          data: originalPlaylist.playlist_tracks.map((pt, index) => ({
            playlist_id: newPlaylist.id,
            track_id: pt.track_id,
            position: index + 1,
            added_by: newUserId,
          })),
        });

        // Update stats
        await this.syncPlaylistStats(newPlaylist.id);
      }

      return newPlaylist;
    } catch (error) {
      logger.error('Error duplicating playlist', { playlistId, error });
      throw error;
    }
  }

  async getPlaylistDuration(playlistId: string): Promise<number> {
    try {
      const result = await this.prisma.playlistTrack.findMany({
        where: { playlist_id: playlistId },
        include: {
          track: {
            select: {
              duration_seconds: true,
            },
          },
        },
      });

      return result.reduce((sum, pt) => sum + pt.track.duration_seconds, 0);
    } catch (error) {
      logger.error('Error calculating playlist duration', { playlistId, error });
      throw error;
    }
  }

  async getPlaylistTracks(
    playlistId: string,
    options?: RepositoryOptions
  ): Promise<any[]> {
    try {
      return await this.prisma.playlistTrack.findMany({
        where: { playlist_id: playlistId },
        include: {
          track: {
            include: {
              album: {
                select: {
                  id: true,
                  title: true,
                  cover_image_url: true,
                },
              },
              track_artists: {
                include: {
                  artist: {
                    select: {
                      id: true,
                      name: true,
                      verified: true,
                    },
                  },
                },
              },
            },
          },
          added_by_user: {
            select: {
              id: true,
              username: true,
              display_name: true,
            },
          },
        },
        orderBy: { position: 'asc' },
        ...this.buildQueryOptions(options),
      });
    } catch (error) {
      logger.error('Error fetching playlist tracks', { playlistId, error });
      throw error;
    }
  }

  async shufflePlaylist(playlistId: string): Promise<void> {
    try {
      const tracks = await this.prisma.playlistTrack.findMany({
        where: { playlist_id: playlistId },
        select: { id: true },
      });

      // Shuffle the track IDs
      const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);

      // Update positions in transaction
      await this.prisma.$transaction(
        shuffledTracks.map((track, index) =>
          this.prisma.playlistTrack.update({
            where: { id: track.id },
            data: { position: index + 1 },
          })
        )
      );
    } catch (error) {
      logger.error('Error shuffling playlist', { playlistId, error });
      throw error;
    }
  }

  async getPlaylistsByTrack(trackId: string): Promise<PlaylistModel[]> {
    try {
      const result = await this.prisma.playlistTrack.findMany({
        where: { track_id: trackId },
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

      return result.map((pt: any) => pt.playlist);
    } catch (error) {
      logger.error('Error fetching playlists by track', { trackId, error });
      throw error;
    }
  }

  async clearPlaylist(playlistId: string): Promise<PlaylistModel> {
    try {
      // Remove all tracks
      await this.prisma.playlistTrack.deleteMany({
        where: { playlist_id: playlistId },
      });

      // Update stats
      return this.update(
        { id: playlistId },
        {
          total_tracks: 0,
          total_duration_seconds: 0,
          updated_at: new Date(),
        }
      );
    } catch (error) {
      logger.error('Error clearing playlist', { playlistId, error });
      throw error;
    }
  }
}

export const playlistRepository = new PlaylistRepository();