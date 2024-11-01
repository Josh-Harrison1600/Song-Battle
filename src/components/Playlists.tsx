// src/components/Playlists.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
          console.warn("No Spotify token found in localStorage");
          return;
        }
  
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(response.data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };
  
    fetchPlaylists();
  }, []);
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            {/* Check if the playlist has an image before rendering it */}
            {playlist.images && playlist.images.length > 0 && (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <h2 className="text-lg font-semibold text-white">{playlist.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
