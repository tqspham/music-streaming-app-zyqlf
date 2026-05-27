'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Lock, Trash2, Mail, Calendar } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

interface ProfileViewProps {
  userProfile: UserProfile;
}

export default function ProfileView({ userProfile }: ProfileViewProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleLogout = async () => {
    setError('');
    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        setError('Failed to log out. Please try again.');
        setIsLoggingOut(false);
        return;
      }

      router.push('/auth/login');
    } catch (err) {
      setError('An error occurred while logging out.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-(--color-background) pb-20">
      {/* Header */}
      <div className="bg-(--color-surface) border-b border-(--color-border) px-6 py-8">
        <h1 className="text-3xl font-bold text-(--color-text) mb-2">Account</h1>
        <p className="text-(--color-muted-text)">Manage your profile and account settings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {error && (
          <div className="mb-6 bg-opacity-20 bg-(--color-danger) border border-(--color-danger) text-(--color-text) px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* User Email Header Section */}
        <div className="mb-6 p-6 bg-(--color-surface) border border-(--color-border) rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-(--color-border) flex items-center justify-center">
              <Mail className="w-8 h-8 text-(--color-primary)" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-(--color-text) break-all">{userProfile.email}</h2>
              <p className="text-sm text-(--color-muted-text)">Verified account</p>
            </div>
          </div>
        </div>

        {/* Account Details Section */}
        <div className="mb-8 p-6 bg-(--color-surface) border border-(--color-border) rounded-lg">
          <h3 className="text-lg font-semibold text-(--color-text) mb-6">Account Details</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-(--color-muted-text) mb-2">Email Address</label>
              <p className="text-(--color-text) font-mono text-sm">{userProfile.email}</p>
            </div>
            <div>
              <label className="block text-sm text-(--color-muted-text) mb-2">Account Created</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-(--color-primary)" />
                <p className="text-(--color-text)">{formatDate(userProfile.created_at)}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm text-(--color-muted-text) mb-2">Account ID</label>
              <p className="text-(--color-text) font-mono text-xs break-all">{userProfile.id}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-3 mb-8">
          {/* Primary Action */}
          <button
            disabled
            className="w-full py-3 px-4 bg-(--color-surface) border border-(--color-border) rounded text-(--color-muted-text) font-medium opacity-50 cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            title="Coming soon"
          >
            <Lock className="w-5 h-5" />
            <span>Change Password</span>
          </button>

          {/* Danger Zone */}
          <button
            disabled
            className="w-full py-3 px-4 bg-(--color-surface) border border-(--color-border) rounded text-(--color-muted-text) font-medium opacity-50 cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            title="Coming soon"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Account</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-3 px-4 bg-(--color-danger) text-(--color-text) rounded font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
