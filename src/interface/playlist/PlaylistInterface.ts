export interface CreatePlaylistInput {
  name: string;
  description?: string;
  cover_image_url?: string;
  user_id: string;
  is_public?: boolean;
  is_collaborative?: boolean;
}

export interface UpdatePlaylistInput {
  name?: string;
  description?: string;
  cover_image_url?: string;
  is_public?: boolean;
  is_collaborative?: boolean;
  total_songs?: number;
  total_duration_seconds?: number;
}