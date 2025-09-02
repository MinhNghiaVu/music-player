import * as songRepo from '../../repo/song/SongRepository';
import * as albumRepo from '../../repo/album/AlbumRepository';
import type { Song, Prisma } from '@prisma/client';
import type { CreateSongInput, UpdateSongInput } from '../../interface/song/SongInterface';

export const createSong = async (input: CreateSongInput): Promise<Song> => {
  // Validation
  if (!input.title?.trim()) {
    throw new Error('Song title is required');
  }

  if (!input.album_id?.trim()) {
    throw new Error('Album ID is required');
  }

  if (!input.duration_seconds || input.duration_seconds <= 0) {
    throw new Error('Valid duration is required');
  }

  // Check if album exists
  const albumExists = await albumRepo.albumExists(input.album_id);
  if (!albumExists) {
    throw new Error('Album not found');
  }

  const songData: Prisma.SongCreateInput = {
    title: input.title.trim(),
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

export const getSongWithDetails = async (id: string) => {
  if (!id?.trim()) {
    throw new Error('Song ID is required');
  }

  const song = await songRepo.getSongWithDetails(id);
  if (!song) {
    throw new Error('Song not found');
  }

  return song;
};

export const getSongsByAlbum = async (albumId: string): Promise<Song[]> => {
  if (!albumId?.trim()) {
    throw new Error('Album ID is required');
  }

  return songRepo.getSongsByAlbum(albumId);
};

export const searchSongs = async (query: string): Promise<Song[]> => {
  if (!query?.trim()) {
    return [];
  }

  return songRepo.searchSongs(query.trim());
};

export const getPopularSongs = async (limit: number = 20): Promise<Song[]> => {
  const validLimit = Math.min(Math.max(limit, 1), 100); // Between 1-100
  return songRepo.getPopularSongs(validLimit);
};

export const getSongsByGenre = async (genre: string): Promise<Song[]> => {
  if (!genre?.trim()) {
    throw new Error('Genre is required');
  }

  return songRepo.getSongsByGenre(genre);
};

export const updateSong = async (id: string, input: UpdateSongInput): Promise<Song> => {
  if (!id?.trim()) {
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
  if (!id?.trim()) {
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
