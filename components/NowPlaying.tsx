'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import Image from 'next/image';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
}

const MOCK_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    album: 'Night Tales',
    duration: 240,
    imageUrl: 'https://picsum.photos/400/400?random=1',
  },
  {
    id: 'song-2',
    title: 'Electric Horizon',
    artist: 'Neon Pulse',
    album: 'Synthetic Waves',
    duration: 198,
    imageUrl: 'https://picsum.photos/400/400?random=2',
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

export default function NowPlaying() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);

  const currentSong = MOCK_SONGS[currentSongIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong.duration, currentSongIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % MOCK_SONGS.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prev) => (prev - 1 + MOCK_SONGS.length) % MOCK_SONGS.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const progress = (currentTime / currentSong.duration) * 100;

  return (
    <div className="flex flex-col h-full bg-(--color-background) pb-20">
      {/* Album Artwork - Full Bleed */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden shadow-2xl">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.album}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Metadata and Controls */}
      <div className="bg-(--color-surface) px-6 py-8 space-y-6">
        {/* Song Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-(--color-text) mb-2">{currentSong.title}</h2>
          <p className="text-(--color-muted-text) mb-1">{currentSong.artist}</p>
          <p className="text-xs text-(--color-muted-text) uppercase tracking-wide">{currentSong.album}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={currentSong.duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-(--color-border) rounded-lg appearance-none cursor-pointer accent-(--color-primary)"
          />
          <div className="flex justify-between text-xs text-(--color-muted-text)">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full hover:bg-(--color-border) text-(--color-text) transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-(--color-primary) text-(--color-background) hover:bg-(--color-secondary) transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-full hover:bg-(--color-border) text-(--color-text) transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 pt-4">
          <Volume2 className="w-5 h-5 text-(--color-muted-text) flex-shrink-0" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-(--color-border) rounded-lg appearance-none cursor-pointer accent-(--color-primary)"
          />
          <span className="text-xs text-(--color-muted-text) w-8 text-right">{volume}</span>
        </div>
      </div>
    </div>
  );
}
