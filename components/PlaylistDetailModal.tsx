'use client';

import { X } from 'lucide-react';

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
  description: string;
  coverImageUrl: string;
  songs: Song[];
}

interface PlaylistDetailModalProps {
  playlist: Playlist;
  onClose: () => void;
}

export default function PlaylistDetailModal({
  playlist,
  onClose,
}: PlaylistDetailModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSongClick = (song: Song) => {
    // Queue song for playback (future enhancement: sync with global player context)
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      {/* Modal Container */}
      <div className="w-full sm:w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] bg-(--color-surface) rounded-t-lg sm:rounded-lg border border-(--color-border) overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-(--color-background) border-b border-(--color-border) px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-(--color-text)">{playlist.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-(--color-border) rounded-lg transition-colors text-(--color-muted-text) hover:text-(--color-text)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Playlist Info */}
          <div className="p-6 border-b border-(--color-border) flex gap-4">
            <img
              src={playlist.coverImageUrl}
              alt={playlist.name}
              className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 flex flex-col justify-end">
              <h3 className="text-sm font-medium text-(--color-muted-text) uppercase tracking-wide mb-2">
                Playlist
              </h3>
              <h2 className="text-2xl font-bold text-(--color-text) mb-3">{playlist.name}</h2>
              <p className="text-(--color-muted-text)">{playlist.songs.length} songs</p>
            </div>
          </div>

          {/* Songs List */}
          {playlist.songs.length === 0 ? (
            <div className="text-center py-12 text-(--color-muted-text)">
              <p>No songs in this playlist</p>
            </div>
          ) : (
            <div className="divide-y divide-(--color-border)">
              {playlist.songs.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                  className="w-full flex gap-4 p-4 hover:bg-(--color-background) transition-colors text-left group"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-12 h-12 relative rounded overflow-hidden">
                    <img
                      src={song.imageUrl}
                      alt={song.album}
                      className="w-full h-full object-cover"
                    />
                    {/* Play Button on Hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-(--color-primary) ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-(--color-text) truncate text-sm">
                      {song.title}
                    </h4>
                    <p className="text-xs text-(--color-muted-text) truncate">{song.artist}</p>
                    <p className="text-xs text-(--color-muted-text) truncate">{song.album}</p>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center text-(--color-muted-text) flex-shrink-0">
                    <span className="text-xs font-mono">{formatTime(song.duration)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
