import { BaseRepository } from './baseRepo';
import type { IResponse } from '@/database/interfaces/IResponse';
import prisma from '@/database/config';

class TrackRepository extends BaseRepository {
  constructor() {
    super("track");
  }

  async findById(id: string): Promise<IResponse<any>> {
    try {
      const track = await prisma.track.findUnique({
        where: { id }
      });

      if (!track) {
        return {
          success: false,
          message: "Track not found"
        };
      }

      return {
        success: true,
        message: "Track fetched successfully",
        data: track
      };
    } catch (error: any) {
      console.error("Error fetching track:", error);
      return {
        success: false,
        message: `Failed to fetch track: ${error.message}`
      };
    }
  }

  async list(): Promise<IResponse<any[]>> {
    try {
      const tracks = await prisma.track.findMany();

      return {
        success: true,
        message: "Tracks fetched successfully",
        data: tracks
      };
    } catch (error: any) {
      console.error("Error fetching tracks:", error);
      return {
        success: false,
        message: `Failed to fetch tracks: ${error.message}`
      };
    }
  }
}

const trackRepo = new TrackRepository();
export default trackRepo;