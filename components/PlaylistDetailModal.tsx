'use client';

import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

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
  onPlaylistAdded?: () => void;
}

export default function PlaylistDetailModal({
  playlist,
  onClose,
  onPlaylistAdded,
}: PlaylistDetailModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<'idle' | 'success' | 'duplicate' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddToLibrary = async () => {
    setIsAdding(true);
    setAddStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/library/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistId: playlist.id,
          name: playlist.name,
          description: playlist.description,
          coverImageUrl: playlist.coverImageUrl,
          songs: playlist.songs,
        }),
        credentials: 'include',
      });

      if (response.status === 409) {
        setAddStatus('duplicate');
        setIsAdding(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setAddStatus('error');
        setErrorMessage(data.error || 'Failed to add playlist');
        setIsAdding(false);
        return;
      }

      setAddStatus('success');
      setIsAdding(false);
      if (onPlaylistAdded) {
        onPlaylistAdded();
      }
      // Close modal after brief delay to show success state
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setAddStatus('error');
      setErrorMessage('An error occurred. Please try again.');
      setIsAdding(false);
    }
  };

  const handleSongClick = (song: Song) => {
    // Queue song for playback (future enhancement: sync with global player context)
  };

  const isButtonDisabled = isAdding || addStatus === 'success' || addStatus === 'duplicate';
  const buttonText =
    addStatus === 'success'
      ? 'Added to Library'
      : addStatus === 'duplicate'
        ? 'Already in Your Library'
        : isAdding
          ? 'Adding...'
          : 'Add to Library';

  const buttonIcon =
    addStatus === 'success'
      ? 'check'
      : addStatus === 'duplicate'
        ? 'check'
        : 'plus';

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
              <p className="text-(--color-muted-text) mb-4">{playlist.songs.length} songs</p>
              
              {/* Add to Library Button and Status Messages */}
              <div className="space-y-2">
                <button
                  onClick={handleAddToLibrary}
                  disabled={isButtonDisabled}
                  className={`w-full py-2 px-4 rounded font-medium flex items-center justify-center gap-2 transition-colors ${
                    addStatus === 'duplicate'
                      ? 'bg-(--color-border) text-(--color-muted-text) cursor-not-allowed'
                      : addStatus === 'success'
                        ? 'bg-(--color-success) text-(--color-background)'
                        : isAdding
                          ? 'bg-(--color-primary) text-(--color-background) opacity-75'
                          : 'bg-(--color-primary) text-(--color-background) hover:bg-(--color-secondary)'
                  }`}
                >
                  {buttonIcon === 'check' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{buttonText}</span>
                </button>
                {addStatus === 'error' && (
                  <div className="bg-opacity-20 bg-(--color-danger) border border-(--color-danger) text-(--color-text) px-3 py-2 rounded text-sm">
                    {errorMessage}
                  </div>
                )}
              </div>
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
