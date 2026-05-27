'use client';

import { useState, useEffect } from 'react';
import { Music, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NowPlaying from './NowPlaying';
import SearchView from './SearchView';
import LibraryView from './LibraryView';
import ProfileView from './ProfileView';

type ViewType = 'now-playing' | 'search' | 'library' | 'profile';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export default function PlayerLayout() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewType>('now-playing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if session cookie is present
    // Note: Document.cookie is accessible on client, but we rely on proxy.ts
    // to protect /player route. If we reach this component, we are authenticated.
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--color-background) flex items-center justify-center">
        <Music className="w-12 h-12 text-(--color-primary) animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-(--color-background) flex flex-col">
      {/* Header */}
      <header className="bg-(--color-surface) border-b border-(--color-border) px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-6 h-6 text-(--color-primary)" />
          <h1 className="text-2xl font-bold text-(--color-text)">SoundFlow</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-(--color-text) hover:bg-(--color-border) rounded transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentView === 'now-playing' && <NowPlaying />}
        {currentView === 'search' && <SearchView />}
        {currentView === 'library' && <LibraryView />}
        {currentView === 'profile' && <ProfileView userProfile={userProfile} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-(--color-surface) border-t border-(--color-border) flex items-center justify-around">
        <button
          onClick={() => setCurrentView('now-playing')}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            currentView === 'now-playing'
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
              : 'text-(--color-muted-text) hover:text-(--color-text)'
          }`}
        >
          Now Playing
        </button>
        <button
          onClick={() => setCurrentView('search')}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            currentView === 'search'
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
              : 'text-(--color-muted-text) hover:text-(--color-text)'
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setCurrentView('library')}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            currentView === 'library'
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
              : 'text-(--color-muted-text) hover:text-(--color-text)'
          }`}
        >
          Library
        </button>
        <button
          onClick={() => setCurrentView('profile')}
          className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
            currentView === 'profile'
              ? 'text-(--color-primary) border-b-2 border-(--color-primary)'
              : 'text-(--color-muted-text) hover:text-(--color-text)'
          }`}
        >
          Profile
        </button>
      </nav>
    </div>
  );
}
