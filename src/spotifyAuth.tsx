// src/spotifyAuth.ts

const clientID: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
const redirectURI: string = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000';
const authEndpoint: string = 'https://accounts.spotify.com/authorize';

const scopes: string[] = [
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
];


export const loginURL: string = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join(
  '%20'
)}&response_type=token&show_dialog=true`;

export const getSpotifyToken = (): string | null => {
  const hash = window.location.hash;
  const token = hash
    .substring(1)
    .split("&")
    .find((elem) => elem.startsWith("access_token"))
    ?.split("=")[1];
  
  window.location.hash = ""; // Clear the hash for a cleaner look
  return token || null;
};
