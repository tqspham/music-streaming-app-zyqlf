'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

const INITIAL_LIKED_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    album: 'Night Tales',
    duration: 240,
    imageUrl: 'https://picsum.photos/400/400?random=1',
  },
  {
    id: 'song-3',
    title: 'Celestial Journey',
    artist: 'Star Gaze',
    album: 'Cosmic Explorations',
    duration: 275,
    imageUrl: 'https://picsum.photos/400/400?random=3',
  },
];

const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'Chill Vibes',
    songs: [
      {
        id: 'song-5',
        title: 'Ocean Waves',
        artist: 'Coastal Harmony',
        album: 'Seaside Dreams',
        duration: 265,
        imageUrl: 'https://picsum.photos/400/400?random=5',
      },
      {
        id: 'song-6',
        title: 'Forest Whispers',
        artist: 'Nature Sounds',
        album: 'Earthly Melodies',
        duration: 220,
        imageUrl: 'https://picsum.photos/400/400?random=6',
      },
    ],
  },
  {
    id: 'playlist-2',
    name: 'Energetic Beats',
    songs: [
      {
        id: 'song-2',
        title: 'Electric Horizon',
        artist: 'Neon Pulse',
        album: 'Synthetic Waves',
        duration: 198,
        imageUrl: 'https://picsum.photos/400/400?random=2',
      },
      {
        id: 'song-4',
        title: 'Urban Symphony',
        artist: 'City Sounds',
        album: 'Metropolitan',
        duration: 210,
        imageUrl: 'https://picsum.photos/400/400?random=4',
      },
    ],
  },
];

type LibraryTab = 'all' | 'liked' | 'playlists';

export default function LibraryView() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('all');
  const [likedSongs, setLikedSongs] = useState<Song[]>(INITIAL_LIKED_SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: `playlist-${Date.now()}`,
        name: newPlaylistName,
        songs: [],
      };
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setShowNewPlaylistInput(false);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  const handleRemoveSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId
          ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
          : p
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-(--color-background) pb-20">
      {/* Tabs */}
      <div className="bg-(--color-surface) border-b border-(--color-border) flex">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
              : 'text-(--color-muted-text) hover:text-(--color-text)'
          }`}
        >
          All Songs
        </button>
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            activeTab === 'liked'
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
              : 'text-(--color-muted-text) hover:text-(--color-text)'
          }`}
        >
          Liked
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            activeTab === 'playlists'
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
              : 'text-(--color-muted-text) hover:text-(--color-text)'
          }`}
        >
          Playlists
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'all' && (
          <div className="text-center py-12 text-(--color-muted-text)">
            <p>Your library is empty. Add songs from search!</p>
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            {likedSongs.length === 0 ? (
              <div className="text-center py-12 text-(--color-muted-text)">
                <p>No liked songs yet</p>
              </div>
            ) : (
              <div className="divide-y divide-(--color-border)">
                {likedSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex gap-4 p-4 hover:bg-(--color-surface) transition-colors"
                  >
                    <img
                      src={song.imageUrl}
                      alt={song.album}
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-(--color-text) truncate">{song.title}</h3>
                      <p className="text-sm text-(--color-muted-text) truncate">{song.artist}</p>
                      <p className="text-xs text-(--color-muted-text) truncate">{song.album}</p>
                    </div>
                    <div className="flex items-center text-(--color-muted-text) flex-shrink-0">
                      <span className="text-sm font-mono">{formatTime(song.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            {/* Create Playlist */}
            {showNewPlaylistInput ? (
              <div className="p-4 border-b border-(--color-border) bg-(--color-surface)">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Playlist name..."
                    autoFocus
                    className="flex-1 px-3 py-2 bg-(--color-background) border border-(--color-border) rounded text-(--color-text) placeholder-(--color-muted-text) focus:outline-none focus:border-(--color-primary)"
                  />
                  <button
                    onClick={handleCreatePlaylist}
                    className="px-4 py-2 bg-(--color-primary) text-(--color-background) rounded font-medium hover:bg-(--color-secondary) transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-(--color-border)">
                <button
                  onClick={() => setShowNewPlaylistInput(true)}
                  className="w-full py-2 border-2 border-dashed border-(--color-border) rounded text-(--color-primary) hover:border-(--color-primary) transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Playlist</span>
                </button>
              </div>
            )}

            {/* Playlists List */}
            {playlists.length === 0 ? (
              <div className="text-center py-12 text-(--color-muted-text)">
                <p>No playlists yet. Create one!</p>
              </div>
            ) : (
              <div className="divide-y divide-(--color-border)">
                {playlists.map((playlist) => (
                  <div key={playlist.id}>
                    <button
                      onClick={() =>
                        setExpandedPlaylist(
                          expandedPlaylist === playlist.id ? null : playlist.id
                        )
                      }
                      className="w-full flex gap-4 p-4 hover:bg-(--color-surface) transition-colors text-left"
                    >
                      <div className="w-16 h-16 bg-(--color-border) rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-(--color-muted-text) text-xs text-center px-2">
                          {playlist.songs.length} songs
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-(--color-text) truncate">
                          {playlist.name}
                        </h3>
                        <p className="text-sm text-(--color-muted-text)">
                          {playlist.songs.length}{' '}
                          {playlist.songs.length === 1 ? 'song' : 'songs'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlaylist(playlist.id);
                        }}
                        className="p-2 text-(--color-muted-text) hover:text-(--color-danger) transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </button>

                    {/* Expanded Playlist Songs */}
                    {expandedPlaylist === playlist.id && (
                      <div className="bg-(--color-surface) divide-y divide-(--color-border)">
                        {playlist.songs.length === 0 ? (
                          <div className="p-4 text-center text-(--color-muted-text) text-sm">
                            No songs in this playlist
                          </div>
                        ) : (
                          playlist.songs.map((song) => (
                            <div
                              key={song.id}
                              className="flex gap-3 p-3 hover:bg-(--color-border) transition-colors"
                            >
                              <img
                                src={song.imageUrl}
                                alt={song.album}
                                className="w-12 h-12 rounded object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-(--color-text) text-sm truncate">
                                  {song.title}
                                </h4>
                                <p className="text-xs text-(--color-muted-text) truncate">
                                  {song.artist}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveSongFromPlaylist(playlist.id, song.id)
                                }
                                className="p-1 text-(--color-muted-text) hover:text-(--color-danger) transition-colors flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
