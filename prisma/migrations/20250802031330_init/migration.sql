-- Create tables
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    profile_image_url TEXT,
    subscription_type TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE "Artist" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    bio TEXT,
    image_url TEXT,
    verified BOOLEAN DEFAULT false,
    monthly_listeners INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "Album" (
    id UUID PRIMARY极 KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_id UUID NOT NULL REFERENCES "Artist"(id),
    release_date DATE,
    cover_image_url TEXT,
    album_type TEXT DEFAULT 'album',
    total_tracks INTEGER,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "Track" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist_id UUID NOT NULL REFERENCES "Artist"(id),
    album_id UUID REFERENCES "Album"(id),
    duration_ms INTEGER NOT NULL,
    track_number INTEGER,
    audio_file_url TEXT NOT NULL,
    cover_image_url TEXT,
    play_count INTEGER DEFAULT 0,
    explicit BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "Playlist" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id),
    name TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    is_public BOOLEAN DEFAULT false,
    track_count INTEGER DEFAULT 0,
    total_duration_ms INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "PlaylistTrack" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES "Playlist"(id),
    track_id UUID NOT NULL REFERENCES "Track"(id),
    position INTEGER NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "UserLibrary" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id),
    track_id UUID NOT NULL REFERENCES "Track"(id),
    added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "PlayHistory" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id),
    track_id UUID NOT NULL REFERENCES "Track"(id),
    played_at TIMESTAMPTZ DEFAULT NOW(),
    play_duration_ms INTEGER,
    completed BOOLEAN DEFAULT false
);

CREATE TABLE "UserFollows" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id),
    artist_id UUID NOT NULL REFERENCES "Artist"(id),
    followed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON "User"(email);
CREATE INDEX idx_users_username ON "User"(username);
CREATE INDEX idx_tracks_title ON "Track"(title);
CREATE INDEX idx_tracks_artist_id ON "Track"(artist_id);
CREATE INDEX idx_tracks_album_id ON "Track"(album_id);
CREATE INDEX idx_playlist_tracks_playlist_id ON "PlaylistTrack"(playlist_id);
CREATE INDEX idx_playlist_tracks_position ON "PlaylistTrack"(playlist_id, position);
CREATE INDEX idx_play_history_user_id ON "PlayHistory"(user_id);
CREATE INDEX idx_play_history_played_at ON "PlayHistory"(played_at);
CREATE INDEX idx_user_library_user_id ON "UserLibrary"(user_id);
CREATE INDEX idx_albums_artist_id ON "Album"(artist_id);
CREATE INDEX idx_user_follows_user_id ON "UserFollows"(user_id);