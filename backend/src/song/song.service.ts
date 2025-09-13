import type { Song, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { songRepo } from './song.repository';
import { albumRepo } from '@/repos';

export const createSong = async (input: Prisma.SongCreateInput): Promise<Song> => {
  // Validation
  if (!input.title) {
    logger.error(`Song title is missing for input ${JSON.stringify(input)}`)
    throw new Error('Song title is required');
  }

  if (!input.duration_seconds || input.duration_seconds <= 0) {
    logger.error(`Song duration is invalid for input ${JSON.stringify(input)}`)
    throw new Error('Valid duration is required');
  }

  // Check if album exists
  const albumExists = await albumRepo.albumExists(input.album_id);
  if (!albumExists) {
    throw new Error('Album not found');
  }

  const songData: Prisma.SongCreateInput = {
    title: input.title,
    album: { connect: { id: input.album_id } },
    duration_seconds: input.duration_seconds,
    song_number: input.song_number ?? 1,
    disc_number: input.disc_number ?? 1,
    genres: input.genres ?? [],
    audio_url: input.audio_url,
    lyrics: input.lyrics,
    explicit: input.explicit ?? false,
    play_count: 0
  };

  return songRepo.createSong(songData);
};

export const getSongById = async (id: string): Promise<Song | null> => {
  if (!id?.trim()) {
    throw new Error('Song ID is required');
  }

  return songRepo.getSongById(id);
};

export const updateSong = async (id: string, input: Prisma.SongUpdateInput): Promise<Song> => {
  if (!id) {
    throw new Error('Song ID is required');
  }

  // Check if song exists
  const exists = await songRepo.songExists(id);
  if (!exists) {
    throw new Error('Song not found');
  }

  // Validate title if provided
  if (input.title !== undefined && !input.title?.trim()) {
    throw new Error('Song title cannot be empty');
  }

  // Validate duration if provided
  if (input.duration_seconds !== undefined && input.duration_seconds <= 0) {
    throw new Error('Duration must be greater than 0');
  }

  const updateData: Prisma.SongUpdateInput = {
    ...(input.title && { title: input.title.trim() }),
    ...(input.duration_seconds && { duration_seconds: input.duration_seconds }),
    ...(input.song_number !== undefined && { song_number: input.song_number }),
    ...(input.disc_number !== undefined && { disc_number: input.disc_number }),
    ...(input.genres && { genres: input.genres }),
    ...(input.audio_url !== undefined && { audio_url: input.audio_url }),
    ...(input.lyrics !== undefined && { lyrics: input.lyrics }),
    ...(input.explicit !== undefined && { explicit: input.explicit }),
    updated_at: new Date()
  };

  return songRepo.updateSong(id, updateData);
};

export const playSong = async (id: string): Promise<Song> => {
  if (!id) {
    throw new Error('Song ID is required');
  }

  const exists = await songRepo.songExists(id);
  if (!exists) {
    throw new Error('Song not found');
  }

  // Increment play count
  return songRepo.incrementPlayCount(id);
};

export const deleteSong = async (id: string): Promise<Song> => {
  if (!id?.trim()) {
    throw new Error('Song ID is required');
  }

  const exists = await songRepo.songExists(id);
  if (!exists) {
    throw new Error('Song not found');
  }

  return songRepo.deleteSong(id);
};

export const getSongStats = async () => {
  const totalSongs = await songRepo.countSongs();
  const popularSongs = await songRepo.getPopularSongs(5);

  return {
    total: totalSongs,
    popular: popularSongs
  };
};
