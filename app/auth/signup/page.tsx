'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Signup failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('session_token', data.sessionToken);
      localStorage.setItem('user_id', data.userId);
      await router.push('/player');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-background) flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-(--color-surface) rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-(--color-primary)" />
          </div>
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">SoundFlow</h1>
          <p className="text-(--color-muted-text)">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-opacity-20 bg-(--color-danger) border border-(--color-danger) text-(--color-text) px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-(--color-text) mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 bg-(--color-surface) border border-(--color-border) rounded text-(--color-text) placeholder-(--color-muted-text) focus:outline-none focus:border-(--color-primary)"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-(--color-text) mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 bg-(--color-surface) border border-(--color-border) rounded text-(--color-text) placeholder-(--color-muted-text) focus:outline-none focus:border-(--color-primary)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-(--color-text) mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 bg-(--color-surface) border border-(--color-border) rounded text-(--color-text) placeholder-(--color-muted-text) focus:outline-none focus:border-(--color-primary)"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-(--color-primary) text-(--color-background) font-semibold rounded hover:bg-(--color-secondary) disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-(--color-muted-text) mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-(--color-primary) hover:text-(--color-secondary) font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
