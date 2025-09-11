export interface CreateUserInput {
  username: string;
  email: string;
  password_hash: string;
  display_name?: string;
  profile_image_url?: string;
  subscription_tier?: string;
  country_code?: string;
  language_preference?: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password_hash?: string;
  display_name?: string;
  profile_image_url?: string;
  subscription_tier?: string;
  country_code?: string;
  language_preference?: string;
  last_active_at?: Date;
  is_active?: boolean;
}