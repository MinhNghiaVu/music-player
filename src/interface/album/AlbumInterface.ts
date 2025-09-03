export interface CreateAlbumInput {
  title: string;
  description?: string;
  cover_image_url?: string;
  release_date?: Date;
  album_type?: string;
  genres?: string[];
  record_label?: string;
  copyright_info?: string;
}

export interface UpdateAlbumInput {
  title?: string;
  description?: string;
  cover_image_url?: string;
  release_date?: Date;
  album_type?: string;
  total_songs?: number;
  duration_seconds?: number;
  genres?: string[];
  record_label?: string;
  copyright_info?: string;
}