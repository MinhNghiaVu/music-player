export interface CreateUserPreferencesInput {
  user_id: string;
  audio_quality?: string;
  autoplay_enabled?: boolean;
  crossfade_duration?: number;
  explicit_content_filter?: boolean;
  social_features_enabled?: boolean;
  notifications_enabled?: boolean;
  offline_downloads_enabled?: boolean;
}

export interface UpdateUserPreferencesInput {
  audio_quality?: string;
  autoplay_enabled?: boolean;
  crossfade_duration?: number;
  explicit_content_filter?: boolean;
  social_features_enabled?: boolean;
  notifications_enabled?: boolean;
  offline_downloads_enabled?: boolean;
}