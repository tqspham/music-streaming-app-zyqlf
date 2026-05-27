'use client';

import { useState, useEffect } from 'react';
import ProfileView from '@/components/ProfileView';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export default function ProfilePageClient() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Your session has expired. Please sign in again.');
          } else {
            setError('This page couldn\'t load. Reload to try again, or go back.');
          }
          setIsLoading(false);
          return;
        }

        const profile: UserProfile = await response.json();
        setUserProfile(profile);
        setIsLoading(false);
      } catch (err) {
        setError('This page couldn\'t load. Reload to try again, or go back.');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ProfileView
      userProfile={userProfile}
      isLoading={isLoading}
      error={error}
    />
  );
}
