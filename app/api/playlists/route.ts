import { NextRequest, NextResponse } from 'next/server';

const MOCK_PLAYLISTS = [
  {
    id: 'playlist-featured-1',
    name: 'Midnight Vibes',
    description: 'Perfect for late-night listening',
    coverImageUrl: 'https://picsum.photos/500/500?random=101',
    songs: [
      {
        id: 'song-1',
        title: 'Midnight Dreams',
        artist: 'Luna Echo',
        album: 'Night Tales',
        duration: 240,
        imageUrl: 'https://picsum.photos/300/300?random=1',
      },
      {
        id: 'song-29',
        title: 'Silent Night',
        artist: 'Quiet Moments',
        album: 'Peaceful',
        duration: 188,
        imageUrl: 'https://picsum.photos/300/300?random=29',
      },
      {
        id: 'song-48',
        title: 'Moonlight Serenade',
        artist: 'Night Owl',
        album: 'Nocturnal',
        duration: 259,
        imageUrl: 'https://picsum.photos/300/300?random=48',
      },
    ],
  },
  {
    id: 'playlist-featured-2',
    name: 'Energy Boost',
    description: 'Get pumped with high-energy beats',
    coverImageUrl: 'https://picsum.photos/500/500?random=102',
    songs: [
      {
        id: 'song-2',
        title: 'Electric Horizon',
        artist: 'Neon Pulse',
        album: 'Synthetic Waves',
        duration: 198,
        imageUrl: 'https://picsum.photos/300/300?random=2',
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
        id: 'song-82',
        title: 'Dance Fever',
        artist: 'Club Vibes',
        album: 'Night Out',
        duration: 230,
        imageUrl: 'https://picsum.photos/300/300?random=82',
      },
      {
        id: 'song-42',
        title: 'Sonic Boom',
        artist: 'Thunderous Sound',
        album: 'Explosions',
        duration: 208,
        imageUrl: 'https://picsum.photos/300/300?random=42',
      },
    ],
  },
  {
    id: 'playlist-featured-3',
    name: 'Chill & Relax',
    description: 'Mellow tunes for unwinding',
    coverImageUrl: 'https://picsum.photos/500/500?random=103',
    songs: [
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
        id: 'song-66',
        title: 'Jazz Nights',
        artist: 'Blue Notes',
        album: 'Late Night Sessions',
        duration: 262,
        imageUrl: 'https://picsum.photos/300/300?random=66',
      },
    ],
  },
  {
    id: 'playlist-featured-4',
    name: 'Cosmic Journey',
    description: 'Explore the universe of sound',
    coverImageUrl: 'https://picsum.photos/500/500?random=104',
    songs: [
      {
        id: 'song-3',
        title: 'Celestial Journey',
        artist: 'Star Gaze',
        album: 'Cosmic Explorations',
        duration: 275,
        imageUrl: 'https://picsum.photos/300/300?random=3',
      },
      {
        id: 'song-14',
        title: 'Aurora Borealis',
        artist: 'Northern Lights',
        album: 'Arctic Dreams',
        duration: 289,
        imageUrl: 'https://picsum.photos/300/300?random=14',
      },
      {
        id: 'song-81',
        title: 'Ambient Space',
        artist: 'Cosmic Soundscapes',
        album: 'Ethereal Waves',
        duration: 301,
        imageUrl: 'https://picsum.photos/300/300?random=81',
      },
    ],
  },
  {
    id: 'playlist-featured-5',
    name: 'Rock Essentials',
    description: 'The greatest rock anthems',
    coverImageUrl: 'https://picsum.photos/500/500?random=105',
    songs: [
      {
        id: 'song-68',
        title: 'Rock Anthem',
        artist: 'Stone Hearts',
        album: 'Power Chords',
        duration: 268,
        imageUrl: 'https://picsum.photos/300/300?random=68',
      },
      {
        id: 'song-97',
        title: 'Grunge Anthem',
        artist: 'Seattle Legends',
        album: 'Sad Tomorrow',
        duration: 279,
        imageUrl: 'https://picsum.photos/300/300?random=97',
      },
      {
        id: 'song-78',
        title: 'Metal Fury',
        artist: 'Heavy Distortion',
        album: 'Amplified Chaos',
        duration: 277,
        imageUrl: 'https://picsum.photos/300/300?random=78',
      },
    ],
  },
  {
    id: 'playlist-featured-6',
    name: 'Global Beats',
    description: 'Music from around the world',
    coverImageUrl: 'https://picsum.photos/500/500?random=106',
    songs: [
      {
        id: 'song-85',
        title: 'K-Pop Dream',
        artist: 'Seoul Voices',
        album: 'Asiatic Beats',
        duration: 225,
        imageUrl: 'https://picsum.photos/300/300?random=85',
      },
      {
        id: 'song-87',
        title: 'Bollywood Magic',
        artist: 'Mumbai Hearts',
        album: 'Spice Dreams',
        duration: 274,
        imageUrl: 'https://picsum.photos/300/300?random=87',
      },
      {
        id: 'song-88',
        title: 'Afro Beat',
        artist: 'Lagos Rhythm',
        album: 'African Pride',
        duration: 266,
        imageUrl: 'https://picsum.photos/300/300?random=88',
      },
      {
        id: 'song-77',
        title: 'Latin Fire',
        artist: 'Salsa Kings',
        album: 'Tropical Heat',
        duration: 263,
        imageUrl: 'https://picsum.photos/300/300?random=77',
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    // Return all featured playlists
    return NextResponse.json(MOCK_PLAYLISTS, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}
