import { BaseRepository } from './baseRepo';
import { supabase } from '@/database/client';
import type { IResponse } from '@/database/interfaces/IResponse';
import type { ISong } from '@/database/interfaces/ISong';

class SongRepository extends BaseRepository<'song'> {
  constructor() {
    super('song');
  }

  async findById(id: string): Promise<IResponse<ISong | null>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName as string)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          message: `Failed to fetch song by id ${id}: ${error.message}`
        };
      }

      return {
        success: true,
        message: 'Song fetched successfully',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: `Unexpected error fetching song: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  async list(): Promise<IResponse<ISong[]>> {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName as string)
        .select('*');

      if (error) {
        return {
          success: false,
          message: `Failed to fetch all songs: ${error.message}`
        };
      }

      return {
        success: true,
        message: 'Songs fetched successfully',
        data: result || []
      };
    } catch (error) {
      return {
        success: false,
        message: `Unexpected error fetching songs: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
}

const songRepo = new SongRepository();
export default songRepo;