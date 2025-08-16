import { Prisma } from '@prisma/client';
import { AbstractBaseRepository } from './BaseRepository';
import { 
  ListeningHistoryModel,
  RepositoryOptions,
} from './types';
import { logger } from '../utils/logger';

export class ListeningHistoryRepository extends AbstractBaseRepository<
  ListeningHistoryModel,
  Prisma.ListeningHistoryCreateInput,
  Prisma.ListeningHistoryUpdateInput,
  Prisma.ListeningHistoryWhereUniqueInput
> {
  constructor() {
    super('listeningHistory');
  }

  // Create operations
  async createListeningHistory(data: Prisma.ListeningHistoryCreateInput): Promise<ListeningHistoryModel> {
    return this.create(data);
  }

  async createManyListeningHistory(data: Prisma.ListeningHistoryCreateInput[]): Promise<Prisma.BatchPayload> {
    return this.createMany(data);
  }

  // Read operations
  async readListeningHistory(id: string, options?: RepositoryOptions): Promise<ListeningHistoryModel | null> {
    return this.findUnique({ id }, options);
  }

  async readListeningHistories(options?: RepositoryOptions): Promise<ListeningHistoryModel[]> {
    return this.findMany(options);
  }

  async readListeningHistoriesPaginated(options?: RepositoryOptions) {
    return this.findManyPaginated(options);
  }

  async readUserListeningHistory(
    userId: string,
    options?: RepositoryOptions
  ): Promise<ListeningHistoryModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
      },
      orderBy: {
        played_at: 'desc',
      },
    });
  }

  async readSongListeningHistory(
    songId: string,
    options?: RepositoryOptions
  ): Promise<ListeningHistoryModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        song_id: songId,
      },
      orderBy: {
        played_at: 'desc',
      },
    });
  }

  async readRecentListeningHistory(
    userId: string,
    limit: number = 50
  ): Promise<ListeningHistoryModel[]> {
    return this.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        played_at: 'desc',
      },
      take: limit,
      include: {
        song: {
          include: {
            song_artists: {
              include: {
                artist: true,
              },
            },
            album: true,
          },
        },
      },
    });
  }

  async readCompletedListeningHistory(
    userId: string,
    options?: RepositoryOptions
  ): Promise<ListeningHistoryModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
        completed: true,
      },
      orderBy: {
        played_at: 'desc',
      },
    });
  }

  async readListeningHistoryByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    options?: RepositoryOptions
  ): Promise<ListeningHistoryModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
        played_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        played_at: 'desc',
      },
    });
  }

  async readListeningHistoryByDevice(
    userId: string,
    deviceType: string,
    options?: RepositoryOptions
  ): Promise<ListeningHistoryModel[]> {
    return this.findMany({
      ...options,
      where: {
        ...options?.where,
        user_id: userId,
        device_type: deviceType,
      },
      orderBy: {
        played_at: 'desc',
      },
    });
  }

  async readListeningHistoryBySource(
    userId: string,
    source: string,
    sourceId?: string,
    options?: RepositoryOptions
  ): Promise<ListeningHistoryModel[]> {
    const whereClause: any = {
      ...options?.where,
      user_id: userId,
      source,
    };

    if (sourceId) {
      whereClause.source_id = sourceId;
    }

    return this.findMany({
      ...options,
      where: whereClause,
      orderBy: {
        played_at: 'desc',
      },
    });
  }

  // Update operations
  async updateListeningHistory(id: string, data: Prisma.ListeningHistoryUpdateInput): Promise<ListeningHistoryModel> {
    return this.update({ id }, data);
  }

  async updateManyListeningHistory(
    where: Prisma.ListeningHistoryWhereInput,
    data: Prisma.ListeningHistoryUpdateInput
  ): Promise<Prisma.BatchPayload> {
    return this.updateMany(where, data);
  }

  // Delete operations
  async deleteListeningHistory(id: string): Promise<ListeningHistoryModel> {
    return this.delete({ id });
  }

  async deleteManyListeningHistory(where?: Prisma.ListeningHistoryWhereInput): Promise<Prisma.BatchPayload> {
    return this.deleteMany(where);
  }

  async deleteOldListeningHistory(olderThanDays: number = 365): Promise<Prisma.BatchPayload> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return this.deleteMany({
      played_at: {
        lt: cutoffDate,
      },
    });
  }

  async deleteUserListeningHistory(userId: string): Promise<Prisma.BatchPayload> {
    return this.deleteMany({
      user_id: userId,
    });
  }

  // Utility operations
  async listeningHistoryExists(id: string): Promise<boolean> {
    return this.exists({ id });
  }

  async countListeningHistory(options?: { where?: Prisma.ListeningHistoryWhereInput }): Promise<number> {
    return this.count(options);
  }

  async countUserListeningHistory(userId: string): Promise<number> {
    return this.count({
      where: {
        user_id: userId,
      },
    });
  }

  async countSongPlays(songId: string): Promise<number> {
    return this.count({
      where: {
        song_id: songId,
      },
    });
  }

  async countCompletedPlays(songId: string): Promise<number> {
    return this.count({
      where: {
        song_id: songId,
        completed: true,
      },
    });
  }

  // Complex business logic operations
  async getUserTopSongs(
    userId: string,
    limit: number = 20,
    daysSince?: number
  ): Promise<any[]> {
    try {
      const whereClause: any = {
        user_id: userId,
        completed: true,
      };

      if (daysSince) {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - daysSince);
        whereClause.played_at = { gte: sinceDate };
      }

      const result = await this.prisma.listeningHistory.groupBy({
        by: ['song_id'],
        where: whereClause,
        _count: {
          song_id: true,
        },
        orderBy: {
          _count: {
            song_id: 'desc',
          },
        },
        take: limit,
      });

      // Get song details
      const songIds = result.map(r => r.song_id);
      const songs = await this.prisma.song.findMany({
        where: {
          id: { in: songIds },
        },
        include: {
          song_artists: {
            include: {
              artist: true,
            },
          },
          album: true,
        },
      });

      // Combine results
      return result.map(r => ({
        song: songs.find(t => t.id === r.song_id),
        playCount: r._count.song_id,
      }));
    } catch (error) {
      logger.error('Error getting user top songs', { userId, error });
      throw error;
    }
  }

  async getUserTopArtists(
    userId: string,
    limit: number = 20,
    daysSince?: number
  ): Promise<any[]> {
    try {
      const whereClause: any = {
        user_id: userId,
        completed: true,
      };

      if (daysSince) {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - daysSince);
        whereClause.played_at = { gte: sinceDate };
      }

      // This is a complex query that requires joining through songs to artists
      const result = await this.prisma.$queryRaw`
        SELECT 
          ta.artist_id,
          COUNT(*) as play_count
        FROM listening_history lh
        JOIN songs t ON lh.song_id = t.id
        JOIN song_artists ta ON t.id = ta.song_id AND ta.role = 'primary'
        WHERE lh.user_id = ${userId}
          AND lh.completed = true
          ${daysSince ? Prisma.sql`AND lh.played_at >= ${new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000)}` : Prisma.empty}
        GROUP BY ta.artist_id
        ORDER BY play_count DESC
        LIMIT ${limit}
      `;

      // Get artist details
      const artistIds = (result as any[]).map(r => r.artist_id);
      const artists = await this.prisma.artist.findMany({
        where: {
          id: { in: artistIds },
        },
      });

      // Combine results
      return (result as any[]).map(r => ({
        artist: artists.find(a => a.id === r.artist_id),
        playCount: Number(r.play_count),
      }));
    } catch (error) {
      logger.error('Error getting user top artists', { userId, error });
      throw error;
    }
  }

  async getUserListeningStats(
    userId: string,
    daysSince?: number
  ): Promise<{
    totalPlays: number;
    totalPlayTime: number;
    averagePlayTime: number;
    completionRate: number;
    uniqueSongs: number;
    uniqueArtists: number;
  }> {
    try {
      const whereClause: any = {
        user_id: userId,
      };

      if (daysSince) {
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - daysSince);
        whereClause.played_at = { gte: sinceDate };
      }

      const [stats, uniqueSongs, uniqueArtists] = await Promise.all([
        this.prisma.listeningHistory.aggregate({
          where: whereClause,
          _count: {
            id: true,
          },
          _sum: {
            play_duration_seconds: true,
          },
          _avg: {
            play_duration_seconds: true,
          },
        }),
        this.prisma.listeningHistory.findMany({
          where: whereClause,
          distinct: ['song_id'],
          select: { song_id: true },
        }),
        this.prisma.$queryRaw`
          SELECT COUNT(DISTINCT ta.artist_id) as count
          FROM listening_history lh
          JOIN songs t ON lh.song_id = t.id
          JOIN song_artists ta ON t.id = ta.song_id AND ta.role = 'primary'
          WHERE lh.user_id = ${userId}
            ${daysSince ? Prisma.sql`AND lh.played_at >= ${new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000)}` : Prisma.empty}
        `,
      ]);

      const completedCount = await this.count({
        where: {
          ...whereClause,
          completed: true,
        },
      });

      return {
        totalPlays: stats._count.id,
        totalPlayTime: stats._sum.play_duration_seconds || 0,
        averagePlayTime: stats._avg.play_duration_seconds || 0,
        completionRate: stats._count.id > 0 ? (completedCount / stats._count.id) * 100 : 0,
        uniqueSongs: uniqueSongs.length,
        uniqueArtists: Number((uniqueArtists as any[])[0]?.count || 0),
      };
    } catch (error) {
      logger.error('Error getting user listening stats', { userId, error });
      throw error;
    }
  }

  async recordPlay(
    userId: string,
    songId: string,
    playData: {
      play_duration_seconds?: number;
      completed?: boolean;
      device_type?: string;
      source?: string;
      source_id?: string;
    }
  ): Promise<ListeningHistoryModel> {
    try {
      return await this.create({
        user: { connect: { id: userId } },
        song: { connect: { id: songId } },
        ...playData,
      });
    } catch (error) {
      logger.error('Error recording play', { userId, songId, error });
      throw error;
    }
  }

  async getPlayStreaks(userId: string): Promise<{
    currentStreak: number;
    longestStreak: number;
    lastPlayDate: Date | null;
  }> {
    try {
      const plays = await this.findMany({
        where: {
          user_id: userId,
          completed: true,
        },
        select: {
          played_at: true,
        },
        orderBy: {
          played_at: 'desc',
        },
      });

      if (plays.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastPlayDate: null,
        };
      }

      const lastPlayDate = plays[0].played_at;
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Group plays by date
      const playDates = new Set(
        plays.map(p => p.played_at.toISOString().split('T')[0])
      );

      const sortedDates = Array.from(playDates).sort().reverse();

      // Calculate current streak
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        const checkDate = new Date();
        let streak = 0;

        for (let i = 0; i < sortedDates.length; i++) {
          const dateStr = checkDate.toISOString().split('T')[0];
          if (sortedDates.includes(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        currentStreak = streak;
      }

      // Calculate longest streak
      tempStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      return {
        currentStreak,
        longestStreak,
        lastPlayDate,
      };
    } catch (error) {
      logger.error('Error getting play streaks', { userId, error });
      throw error;
    }
  }
}

export const listeningHistoryRepository = new ListeningHistoryRepository();