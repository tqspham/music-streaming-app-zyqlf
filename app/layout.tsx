import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoundFlow - Music Streaming',
  description: 'A modern music streaming platform with playlists, search, and personalized library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-(--color-background) text-(--color-text)">{children}</body>
    </html>
  );
}
