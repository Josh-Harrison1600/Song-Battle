import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { getSpotifyToken, loginURL } from '../spotifyAuth';

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
      const token = getSpotifyToken();

      if (!token) {
        console.warn("No Spotify token found. Redirecting to login...");
        window.location.href = loginURL;
        return;
      }

      try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Playlists Response:", response.data); // Debugging
        setPlaylists(response.data.items || []);
      } catch (err) {
        const error = err as AxiosError; // Type assertion for AxiosError
        console.error("Spotify API Error:", error.response?.data || error.message);
        alert("Failed to fetch playlists. Please log in again.");
        localStorage.removeItem("spotifyAccessToken");
        window.location.href = loginURL;
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
