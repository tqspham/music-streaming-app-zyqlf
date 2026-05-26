'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
}

export default function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/catalog?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-(--color-background) pb-20">
      {/* Search Input */}
      <div className="bg-(--color-surface) border-b border-(--color-border) p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-(--color-muted-text)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums..."
            className="w-full pl-10 pr-4 py-3 bg-(--color-background) border border-(--color-border) rounded-lg text-(--color-text) placeholder-(--color-muted-text) focus:outline-none focus:border-(--color-primary)"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32 text-(--color-muted-text)">
            Searching...
          </div>
        )}

        {!isLoading && results.length === 0 && query && (
          <div className="flex items-center justify-center h-32 text-(--color-muted-text)">
            No results found
          </div>
        )}

        {!isLoading && results.length === 0 && !query && (
          <div className="flex items-center justify-center h-32 text-(--color-muted-text)">
            Start typing to search
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="divide-y divide-(--color-border)">
            {results.map((song) => (
              <div
                key={song.id}
                className="flex gap-4 p-4 hover:bg-(--color-surface) cursor-pointer transition-colors"
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
                  <span className="text-sm font-mono">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
