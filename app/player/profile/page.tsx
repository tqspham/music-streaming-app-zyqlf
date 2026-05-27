import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import ProfileView from '@/components/ProfileView';

export const metadata = {
  title: 'Profile - SoundFlow',
  description: 'Manage your account and profile settings',
};

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    redirect('/auth/login');
  }

  let userProfile: UserProfile | null = null;
  let error: string | null = null;

  try {
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Cookie': `session_token=${sessionToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      error = 'Failed to load profile';
    } else {
      userProfile = await response.json();
    }
  } catch (err) {
    error = 'An error occurred while loading your profile';
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-(--color-background) flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-(--color-text) mb-4">Profile Unavailable</h1>
          <p className="text-(--color-muted-text)">{error || 'Could not load your profile. Please try again.'}</p>
        </div>
      </div>
    );
  }

  return <ProfileView userProfile={userProfile} />;
}
