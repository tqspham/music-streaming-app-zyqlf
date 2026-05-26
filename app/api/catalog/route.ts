import { NextRequest, NextResponse } from 'next/server';

const MOCK_SONGS = [
  {
    id: 'song-1',
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    album: 'Night Tales',
    duration: 240,
    imageUrl: 'https://picsum.photos/300/300?random=1',
  },
  {
    id: 'song-2',
    title: 'Electric Horizon',
    artist: 'Neon Pulse',
    album: 'Synthetic Waves',
    duration: 198,
    imageUrl: 'https://picsum.photos/300/300?random=2',
  },
  {
    id: 'song-3',
    title: 'Celestial Journey',
    artist: 'Star Gaze',
    album: 'Cosmic Explorations',
    duration: 275,
    imageUrl: 'https://picsum.photos/300/300?random=3',
  },
  {
    id: 'song-4',
    title: 'Urban Symphony',
    artist: 'City Sounds',
    album: 'Metropolitan',
    duration: 210,
    imageUrl: 'https://picsum.photos/300/300?random=4',
  },
  {
    id: 'song-5',
    title: 'Ocean Waves',
    artist: 'Coastal Harmony',
    album: 'Seaside Dreams',
    duration: 265,
    imageUrl: 'https://picsum.photos/300/300?random=5',
  },
  {
    id: 'song-6',
    title: 'Forest Whispers',
    artist: 'Nature Sounds',
    album: 'Earthly Melodies',
    duration: 220,
    imageUrl: 'https://picsum.photos/300/300?random=6',
  },
  {
    id: 'song-7',
    title: 'Desert Fire',
    artist: 'Sand Storm',
    album: 'Arid Beats',
    duration: 185,
    imageUrl: 'https://picsum.photos/300/300?random=7',
  },
  {
    id: 'song-8',
    title: 'Mountain Peak',
    artist: 'Alpine Echo',
    album: 'High Altitudes',
    duration: 245,
    imageUrl: 'https://picsum.photos/300/300?random=8',
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(MOCK_SONGS);
  }

  const lowerQuery = query.toLowerCase();
  const filtered = MOCK_SONGS.filter(
    (song) =>
      song.title.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album.toLowerCase().includes(lowerQuery)
  );

  return NextResponse.json(filtered);
}
