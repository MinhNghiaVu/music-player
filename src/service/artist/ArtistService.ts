import * as artistRepo from '../../repo/artist/ArtistRepository';
import type { Artist, Prisma } from '@prisma/client';
import type { CreateArtistInput, UpdateArtistInput } from '@/interface/artist/ArtistInterface';


export const createArtist = async (input: CreateArtistInput): Promise<Artist> => {
  // Validation
  if (!input.name?.trim()) {
    throw new Error('Artist name is required');
  }

  const artistData: Prisma.ArtistCreateInput = {
    name: input.name.trim(),
    bio: input.bio?.trim(),
    profile_image_url: input.profile_image_url,
    banner_image_url: input.banner_image_url,
    verified: input.verified || false,
    genres: input.genres || [],
    country_code: input.country_code,
    website: input.website,
    monthly_listeners: 0
  };

  return artistRepo.createArtist(artistData);
};

export const getArtistById = async (id: string): Promise<Artist | null> => {
  if (!id?.trim()) {
    throw new Error('Artist ID is required');
  }

  return artistRepo.getArtistById(id);
};

export const getAllArtists = async (): Promise<Artist[]> => {
  return artistRepo.getAllArtists();
};

export const getArtistWithAlbums = async (id: string) => {
  if (!id?.trim()) {
    throw new Error('Artist ID is required');
  }

  const artist = await artistRepo.getArtistWithAlbums(id);
  if (!artist) {
    throw new Error('Artist not found');
  }

  return artist;
};

export const getArtistWithSongs = async (id: string) => {
  if (!id?.trim()) {
    throw new Error('Artist ID is required');
  }

  const artist = await artistRepo.getArtistWithSongs(id);
  if (!artist) {
    throw new Error('Artist not found');
  }

  return artist;
};

export const searchArtists = async (query: string): Promise<Artist[]> => {
  if (!query?.trim()) {
    return [];
  }

  return artistRepo.searchArtists(query.trim());
};

export const getPopularArtists = async (limit: number = 10): Promise<Artist[]> => {
  const validLimit = Math.min(Math.max(limit, 1), 50); // Between 1-50
  return artistRepo.getPopularArtists(validLimit);
};

export const getVerifiedArtists = async (limit: number = 20): Promise<Artist[]> => {
  const validLimit = Math.min(Math.max(limit, 1), 50); // Between 1-50
  return artistRepo.getVerifiedArtists(validLimit);
};

export const updateArtist = async (id: string, input: UpdateArtistInput): Promise<Artist> => {
  if (!id?.trim()) {
    throw new Error('Artist ID is required');
  }

  // Check if artist exists
  const exists = await artistRepo.artistExists(id);
  if (!exists) {
    throw new Error('Artist not found');
  }

  // Validate name if provided
  if (input.name !== undefined && !input.name?.trim()) {
    throw new Error('Artist name cannot be empty');
  }

  const updateData: Prisma.ArtistUpdateInput = {
    ...(input.name && { name: input.name.trim() }),
    ...(input.bio !== undefined && { bio: input.bio?.trim() }),
    ...(input.image_url !== undefined && { image_url: input.image_url }),
    ...(input.verified !== undefined && { verified: input.verified }),
    ...(input.genres && { genres: input.genres }),
    ...(input.country !== undefined && { country: input.country }),
    ...(input.website !== undefined && { website: input.website }),
    updated_at: new Date()
  };

  return artistRepo.updateArtist(id, updateData);
};

export const deleteArtist = async (id: string): Promise<Artist> => {
  if (!id?.trim()) {
    throw new Error('Artist ID is required');
  }

  const exists = await artistRepo.artistExists(id);
  if (!exists) {
    throw new Error('Artist not found');
  }

  return artistRepo.deleteArtist(id);
};

export const getArtistStats = async () => {
  const totalArtists = await artistRepo.countArtists();
  const popularArtists = await artistRepo.getPopularArtists(5);
  const verifiedCount = (await artistRepo.getVerifiedArtists(1000)).length;

  return {
    total: totalArtists,
    verified: verifiedCount,
    popular: popularArtists
  };
};
