export interface CreateAlbumInput {
  title: string;
  description?: string;
  release_date: Date;
  album_type?: 'album' | 'single' | 'ep' | 'compilation';
  genres?: string[];
  cover_image_url?: string;
  record_label?: string;
  copyright_info?: string;
}

export interface UpdateAlbumInput {
  title?: string;
  description?: string;
  release_date?: Date;
  album_type?: 'album' | 'single' | 'ep' | 'compilation';
  genres?: string[];
  cover_image_url?: string;
  record_label?: string;
  copyright_info?: string;
}
