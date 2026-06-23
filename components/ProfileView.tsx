'use client';

import { LogOut, Lock, Trash2, Mail, Calendar, Music } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

interface ProfileViewProps {
  userProfile: UserProfile | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ProfileView({
  userProfile,
  isLoading = false,
  error,
}: ProfileViewProps) {
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-(--color-background) pb-20">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Music className="w-12 h-12 text-(--color-primary) animate-pulse mx-auto mb-4" />
            <p className="text-(--color-muted-text)">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-(--color-background) pb-20">
        <div className="flex items-center justify-center h-full px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-(--color-surface) rounded-full mb-4">
              <Mail className="w-8 h-8 text-(--color-danger)" />
            </div>
            <h1 className="text-2xl font-bold text-(--color-text) mb-4">Profile Unavailable</h1>
            <p className="text-(--color-muted-text) mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-(--color-primary) text-(--color-background) rounded font-medium hover:bg-(--color-secondary) transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col h-full bg-(--color-background) pb-20">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-(--color-muted-text)">No profile data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-(--color-background) pb-20">
      {/* Header */}
      <div className="bg-(--color-surface) border-b border-(--color-border) px-6 py-8">
        <h1 className="text-3xl font-bold text-(--color-text) mb-2">Account</h1>
        <p className="text-(--color-muted-text)">Manage your profile and account settings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
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

          {/* Logout Button as form */}
          <form method="POST" action="/api/auth/logout">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-(--color-danger) text-(--color-text) rounded font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
