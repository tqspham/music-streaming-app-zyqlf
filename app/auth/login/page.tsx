'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Step 1: POST credentials to /api/auth/login
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      const loginData = await loginResponse.json();
      const { sessionToken } = loginData;

      // Step 2: POST sessionToken to /api/auth/callback to set secure cookie
      const callbackResponse = await fetch('/api/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      });

      // Step 3: Await router.push() to complete navigation
      if (callbackResponse.ok) {
        await router.push('/player');
      } else {
        setError('Failed to establish session');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-background) flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-(--color-surface) rounded-full mb-4">
            <LogIn className="w-8 h-8 text-(--color-primary)" />
          </div>
          <h1 className="text-3xl font-bold text-(--color-text) mb-2">SoundFlow</h1>
          <p className="text-(--color-muted-text)">Sign in to your account</p>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-(--color-primary) text-(--color-background) font-semibold rounded hover:bg-(--color-secondary) disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-(--color-muted-text) mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-(--color-primary) hover:text-(--color-secondary) font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
