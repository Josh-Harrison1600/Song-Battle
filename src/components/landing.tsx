import React from 'react';
import { loginURL } from '../spotifyAuth';

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-800 to-black text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Song Battle</h1>
      <p className="text-lg text-center mb-8 max-w-md">
        Song Battle is a web app that allows you to connect to your Spotify account and choose one of your playlists to put the songs in the playlist in a tournament!
        Click the button below to sync your Spotify account to start.
      </p>
      <a
        href={loginURL}
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
      >
        Login with Spotify
      </a>
    </div>
  );
};

export default Landing;