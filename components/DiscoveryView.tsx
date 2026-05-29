'use client';

import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import PlaylistDetailModal from './PlaylistDetailModal';

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

export default function DiscoveryView() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/playlists');
        if (response.ok) {
          const data = await response.json();
          setPlaylists(data);
        }
      } catch (error) {
        // Silently fail - show empty state
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-(--color-background) pb-20">
        <div className="flex items-center justify-center h-full">
          <Music className="w-12 h-12 text-(--color-primary) animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-(--color-background) pb-20">
      {/* Header */}
      <div className="bg-(--color-surface) border-b border-(--color-border) px-6 py-6">
        <h1 className="text-3xl font-bold text-(--color-text)">Discover</h1>
        <p className="text-(--color-muted-text) text-sm mt-1">Curated playlists for your mood</p>
      </div>

      {/* Playlist Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {playlists.length === 0 ? (
          <div className="flex items-center justify-center h-full text-(--color-muted-text)">
            <p>No playlists available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist)}
                className="group flex flex-col text-left transition-all duration-200 transform hover:-translate-y-1"
              >
                {/* Playlist Card */}
                <div className="relative mb-3 overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={playlist.coverImageUrl}
                    alt={playlist.name}
                    className="w-full aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylist(playlist);
                      }}
                      className="w-14 h-14 rounded-full bg-(--color-primary) flex items-center justify-center text-(--color-background) hover:bg-(--color-secondary) transition-colors shadow-lg"
                    >
                      <svg
                        className="w-6 h-6 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Playlist Info */}
                <h3 className="font-semibold text-(--color-text) truncate group-hover:text-(--color-primary) transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-xs text-(--color-muted-text) mt-1">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Playlist Detail Modal */}
      {selectedPlaylist && (
        <PlaylistDetailModal
          playlist={selectedPlaylist}
          onClose={() => setSelectedPlaylist(null)}
        />
      )}
    </div>
  );
}
