export interface CreateArtistInput {
  name: string;
  bio?: string;
  profile_image_url?: string;
  banner_image_url?: string;
  verified?: boolean;
  country_code?: string;
  genres?: string[];
}

export interface UpdateArtistInput {
  name?: string;
  bio?: string;
  profile_image_url?: string;
  banner_image_url?: string;
  verified?: boolean;
  monthly_listeners?: number;
  country_code?: string;
  genres?: string[];
}