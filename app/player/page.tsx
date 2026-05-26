import { redirect } from 'next/navigation';
import PlayerLayout from '@/components/PlayerLayout';

export const metadata = {
  title: 'Player - SoundFlow',
  description: 'Play your music with SoundFlow',
};

export default function PlayerPage() {
  return <PlayerLayout />;
}
