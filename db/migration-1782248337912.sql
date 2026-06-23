CREATE TABLE IF NOT EXISTS music_streaming_app_zyqlf_user_library_playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES music_streaming_app_zyqlf_users(id) ON DELETE CASCADE,
  playlist_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  songs_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
