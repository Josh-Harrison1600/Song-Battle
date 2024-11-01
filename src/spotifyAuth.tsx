const clientID: string = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '';
const redirectURI: string = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/callback';
const authEndpoint: string = 'https://accounts.spotify.com/authorize';

// Permissions requested from the user for the app
const scopes: string[] = [
    'user-read-private',        // Access to read user's private info
    'playlist-read-private',     // Access to read user's private playlists
    'user-library-read',         // Access to user's library
  ];

  // Construct the Spotify authorization URL
export const loginURL: string = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join(
    '%20'
  )}&response_type=token&show_dialog=true`;

  /**
 * Extracts the access token from the URL hash.
 * This function parses the URL hash after redirection to retrieve the access token.
 * @returns {string | null} Access token if available, otherwise null.
 */
export const getSpotifyToken = (): string | null => {
    // Access the URL hash, e.g., #access_token=XYZ&token_type=Bearer&expires_in=3600
    const hash: string = window.location.hash;
  
    // Extract token from hash if it exists
    const token = hash
      .substring(1) // Remove the leading #
      .split('&')   // Split at each parameter
      .reduce((acc: Record<string, string>, current: string) => {
        const [key, value] = current.split('='); // Split at =
        acc[key] = decodeURIComponent(value);    // Decode URI and add to accumulator
        return acc;
      }, {}).access_token; // Look for "access_token"
  
    // Clear the URL hash
    window.location.hash = '';
  
    // Return the access token if found, otherwise return null
    return token || null;
  };

