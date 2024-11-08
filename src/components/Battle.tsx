import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Song {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { id: string; name: string }[]; // Add artists to display their names
}

const Battle: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentBattle, setCurrentBattle] = useState<[Song, Song] | null>(null);
  const [winner, setWinner] = useState<Song | null>(null); // Tracks the winning song

  // Fetches 8 random songs from the specified playlist when the component mounts.
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem('spotifyAccessToken');
        if (!token) {
          console.warn("No Spotify token found in localStorage");
          return;
        }

        // Fetch playlist data to get the total number of tracks
        const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const totalTracks = playlistResponse.data.tracks.total;

        // Generate 8 random indices within the range of total tracks
        const randomIndices = Array.from({ length: 8 }, () => Math.floor(Math.random() * totalTracks));

        const selectedSongs: Song[] = [];
        for (const index of randomIndices) {
          const offset = Math.floor(index / 100) * 100; // Determine the page offset
          const trackResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              offset,
              limit: 100,
            },
          });

          const trackWithinPage = index % 100;
          const track = trackResponse.data.items[trackWithinPage].track;

          // Avoid duplicates in the selected songs
          if (!selectedSongs.find((song) => song.id === track.id)) {
            selectedSongs.push(track);
          }
        }

        setSongs(selectedSongs);
        setCurrentBattle([selectedSongs[0], selectedSongs[1]]); // Start the battle with the first two songs
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, [playlistId]);

  // Handles the logic when a song is chosen in the battle.
  const handleSongChoice = (chosenSong: Song) => {
    if (!currentBattle) return;

    // Identify which side the chosen song is on (left or right)
    const [leftSong, rightSong] = currentBattle;
    const chosenSide = chosenSong === leftSong ? 'left' : 'right';

    // Filter out the song that wasn't chosen
    const otherSong = chosenSide === 'left' ? rightSong : leftSong;
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== otherSong.id));

    // Update the current battle or set the winner
    setSongs((prevSongs) => {
      // Remove the next song if it matches the chosen song (to prevent duplicates)
      const filteredSongs = prevSongs.filter((song) => song.id !== chosenSong.id);

      if (filteredSongs.length > 0) {
        const nextSong = filteredSongs[0]; // The next song to introduce into the battle

        // Determine new battle based on chosen side
        const newBattle: [Song, Song] = chosenSide === 'left'
          ? [chosenSong, nextSong] // Keep chosen song on left, replace right
          : [nextSong, chosenSong]; // Keep chosen song on right, replace left

        setCurrentBattle(newBattle);
        return filteredSongs.slice(1); // Remove the next song from the pool
      } else {
        setWinner(chosenSong); // Set the chosen song as the winner
        setCurrentBattle(null); // Clear the current battle
        return filteredSongs;
      }
    });
  };

  if (winner) {
    // Render the winner screen
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
        <h1 className="text-4xl font-bold mb-6">Winner!</h1>
        <img
          src={winner.album.images[0]?.url || ''}
          alt={winner.name}
          className="w-64 h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold">{winner.name}</h2>
        <p className="text-lg">{winner.album.name}</p>
        <p className="text-md text-gray-400">
          {winner.artists.map((artist) => artist.name).join(', ')} {/* Display artists */}
        </p>
      </div>
    );
  }

  if (!currentBattle) {
    // Render the loading screen
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
        <h1 className="text-4xl font-bold text-center font-montserrat text-white">Loading...</h1>
        <svg className="animate-spin h-12 w-12 text-white mb-4 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      </div>
    );
  }

  // Render the current battle
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white">
      {currentBattle && currentBattle.length === 2 ? (
        <div className="flex w-full max-w-4xl justify-around">
          {currentBattle.map((song, index) => (
            <div key={song.id} className="flex flex-col items-center">
              <img
                src={song.album.images[0]?.url || ''}
                alt={song.name}
                className="w-48 h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-bold text-center">{song.name}</h2>
              <p className="text-center">{song.album.name}</p>
              <p className="text-sm text-gray-400">
                {song.artists.map((artist) => artist.name).join(', ')}
              </p>
              <button
                onClick={() => handleSongChoice(song)}
                className="bg-blue-500 text-white mt-4 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Battle;
