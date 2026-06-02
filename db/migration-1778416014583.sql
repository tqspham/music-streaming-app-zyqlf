CREATE TABLE IF NOT EXISTS music_streaming_app_zyqlf_user_library_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES music_streaming_app_zyqlf_users(id) ON DELETE CASCADE,
  playlist_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  songs_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, playlist_id)
);

CREATE INDEX IF NOT EXISTS idx_user_library_playlists_user_id ON music_streaming_app_zyqlf_user_library_playlists(user_id);
