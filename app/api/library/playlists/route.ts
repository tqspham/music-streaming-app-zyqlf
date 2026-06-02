import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode session token: Base64-encoded 'id:timestamp'
    let decodedToken: string;
    try {
      decodedToken = Buffer.from(sessionToken, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const [userId] = decodedToken.split(':');
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session token format' }, { status: 401 });
    }

    // Import supabase dynamically at request time
    const { supabase } = await import('@/lib/supabase');

    // Query user library playlists from database
    const { data: playlists, error } = await supabase
      .from('music_streaming_app_zyqlf_user_library_playlists')
      .select('id, user_id, playlist_id, name, description, cover_image_url, songs_json, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/library/playlists] Supabase query error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
    }

    // Map database rows to response format
    const formattedPlaylists = playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      coverImageUrl: playlist.cover_image_url,
      songs: playlist.songs_json || [],
      isFromLibrary: true,
      playlistId: playlist.playlist_id,
    }));

    return NextResponse.json(formattedPlaylists, { status: 200 });
  } catch (error) {
    console.error('[GET /api/library/playlists] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode session token: Base64-encoded 'id:timestamp'
    let decodedToken: string;
    try {
      decodedToken = Buffer.from(sessionToken, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const [userId] = decodedToken.split(':');
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session token format' }, { status: 401 });
    }

    const body = await request.json();
    const { playlistId, name, description, coverImageUrl, songs } = body;

    if (!playlistId || !name || !songs) {
      return NextResponse.json(
        { error: 'playlistId, name, and songs are required' },
        { status: 400 }
      );
    }

    // Import supabase dynamically at request time
    const { supabase } = await import('@/lib/supabase');

    // Check if playlist already exists in user library
    const { data: existing, error: checkError } = await supabase
      .from('music_streaming_app_zyqlf_user_library_playlists')
      .select('id')
      .eq('user_id', userId)
      .eq('playlist_id', playlistId)
      .maybeSingle();

    if (checkError) {
      console.error('[POST /api/library/playlists] Supabase check query error:', {
        code: checkError.code,
        message: checkError.message,
        details: checkError.details,
        hint: checkError.hint,
      });
      return NextResponse.json({ error: 'Failed to check playlist' }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Playlist already in your library' },
        { status: 409 }
      );
    }

    // Insert new library playlist
    const { data: newPlaylist, error: insertError } = await supabase
      .from('music_streaming_app_zyqlf_user_library_playlists')
      .insert([
        {
          user_id: userId,
          playlist_id: playlistId,
          name,
          description: description || null,
          cover_image_url: coverImageUrl || null,
          songs_json: songs,
        },
      ])
      .select('id, user_id, playlist_id, name, description, cover_image_url, songs_json, created_at')
      .single();

    if (insertError) {
      console.error('[POST /api/library/playlists] Supabase insert query error:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });
      return NextResponse.json({ error: 'Failed to add playlist' }, { status: 500 });
    }

    if (!newPlaylist) {
      console.error('[POST /api/library/playlists] Insert returned no data');
      return NextResponse.json({ error: 'Failed to add playlist' }, { status: 500 });
    }

    // Format response
    const formattedPlaylist = {
      id: newPlaylist.id,
      name: newPlaylist.name,
      description: newPlaylist.description,
      coverImageUrl: newPlaylist.cover_image_url,
      songs: newPlaylist.songs_json || [],
      isFromLibrary: true,
      playlistId: newPlaylist.playlist_id,
    };

    return NextResponse.json(formattedPlaylist, { status: 201 });
  } catch (error) {
    console.error('[POST /api/library/playlists] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode session token: Base64-encoded 'id:timestamp'
    let decodedToken: string;
    try {
      decodedToken = Buffer.from(sessionToken, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const [userId] = decodedToken.split(':');
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session token format' }, { status: 401 });
    }

    const body = await request.json();
    const { playlistId } = body;

    if (!playlistId) {
      return NextResponse.json({ error: 'playlistId is required' }, { status: 400 });
    }

    // Import supabase dynamically at request time
    const { supabase } = await import('@/lib/supabase');

    // Delete playlist from user library
    const { error } = await supabase
      .from('music_streaming_app_zyqlf_user_library_playlists')
      .delete()
      .eq('user_id', userId)
      .eq('id', playlistId);

    if (error) {
      console.error('[DELETE /api/library/playlists] Supabase delete query error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json({ error: 'Failed to remove playlist' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Playlist removed' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/library/playlists] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
