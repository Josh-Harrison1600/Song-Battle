import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
          console.warn('No Spotify token found in localStorage');
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

  const handlePlayListClick = (playlistId: string) => {
    navigate(`/battle/${playlistId}`);
  };

  return (
    <div className="p-4 bg-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-center font-montserrat text-white mt-6">
        Your Playlists
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handlePlayListClick(playlist.id)}
            className="bg-gray-900 p-4 rounded-lg shadow-lg border-2 border-white 
                       transition-colors duration-500 ease-in-out hover:border-green-500 hover:bg-black"
          >
            {playlist.images && playlist.images.length > 0 && (
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                className="w-full h-48 object-contain rounded-lg mb-2"
              />
            )}
            <h2 className="text-lg font-semibold text-white text-center">
              {playlist.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
