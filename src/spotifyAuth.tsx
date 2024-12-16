// src/spotifyAuth.ts

const clientID: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
const redirectURI: string = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/callback';
const authEndpoint: string = 'https://accounts.spotify.com/authorize';

// Spotify scopes required for accessing playlists and user library
const scopes: string[] = [
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
];

// Construct the Spotify login URL
export const loginURL: string = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join(
  '%20'
)}&response_type=token&show_dialog=true`;

// Function to retrieve Spotify Access Token from the URL or localStorage
export const getSpotifyToken = (): string | null => {
  const hash = window.location.hash;

  // Extract the access token from the URL hash
  const token = hash
    .substring(1)
    .split('&')
    .find((elem) => elem.startsWith('access_token'))
    ?.split('=')[1];

  if (token) {
    // Save the token in localStorage for reuse
    localStorage.setItem('spotifyAccessToken', token);
    console.log('Token extracted and saved to localStorage:', token);
  }

  // Clean up the URL hash for a cleaner look
  window.location.hash = '';
  return token || localStorage.getItem('spotifyAccessToken') || null;
};