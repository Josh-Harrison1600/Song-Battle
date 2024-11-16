import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Song {
  id: string;
  name: string;
  preview_url: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { id: string; name: string }[];
}

interface BattleProps {
  setGlobalLoading: (isLoading: boolean) => void;
}

const Battle: React.FC<BattleProps> = ({ setGlobalLoading }) => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentBattle, setCurrentBattle] = useState<[Song, Song] | null>(null);
  const [winner, setWinner] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  const [playingSong, setPlayingSong] = useState<string | null>(null); 
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null); 

  // Refs for managing audio elements
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  // Fetch and select songs
  const fetchAndSelectSongs = async () => {
    try {
      setLoading(true);
      setGlobalLoading(true); // Synchronize global loading

      const token = localStorage.getItem("spotifyAccessToken");
      if (!token) {
        console.warn("No Spotify token found in localStorage");
        setLoading(false);
        setGlobalLoading(false);
        return;
      }

      const playlistResponse = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const totalTracks = playlistResponse.data.tracks.total;

      const randomIndices = Array.from(
        { length: 8 },
        () => Math.floor(Math.random() * totalTracks)
      );

      const selectedSongs: Song[] = [];
      for (const index of randomIndices) {
        const offset = Math.floor(index / 100) * 100;
        const trackResponse = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              offset,
              limit: 100,
            },
          }
        );

        const trackWithinPage = index % 100;
        const track = trackResponse.data.items[trackWithinPage].track;

        if (track.preview_url && !selectedSongs.find((song) => song.id === track.id)) {
          selectedSongs.push({
            id: track.id,
            name: track.name,
            preview_url: track.preview_url,
            album: track.album,
            artists: track.artists,
          });
        }
      }

      setSongs(selectedSongs);
      setCurrentBattle([selectedSongs[0], selectedSongs[1]]);
      setWinner(null);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
      setGlobalLoading(false); 
    }
  };

  useEffect(() => {
    fetchAndSelectSongs();
  }, [playlistId]);


  //this prevents scrolling
  useEffect(() => {
    if (loading || winner || currentBattle) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "auto"; 
    }
  
    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, [loading, winner, currentBattle]);

  // Handles the logic when a song is chosen in the battle.
  const handleSongChoice = (chosenSong: Song) => {
    if (!currentBattle) return;

    const [leftSong, rightSong] = currentBattle;
    const chosenSide = chosenSong === leftSong ? "left" : "right";

    const otherSong = chosenSide === "left" ? rightSong : leftSong;
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== otherSong.id));

    setSongs((prevSongs) => {
      const filteredSongs = prevSongs.filter((song) => song.id !== chosenSong.id);

      if (filteredSongs.length > 0) {
        const nextSong = filteredSongs[0];
        const newBattle: [Song, Song] = chosenSide === "left" ? [chosenSong, nextSong] : [nextSong, chosenSong];
        setCurrentBattle(newBattle);
        return filteredSongs.slice(1);
      } else {
        setWinner(chosenSong);
        setCurrentBattle(null);
        return filteredSongs;
      }
    });
  };

  // Manage audio playback to prevent overlap
  const handlePlay = (index: number) => {
    // Pause all other audio elements
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
        audio.currentTime = 0; 
      }
    });

    // Play the selected audio
    if (audioRefs.current[index]) {
      audioRefs.current[index].play();
    }
  };

  // Logic for the "Play Again" button
  const handlePlayAgain = () => {
    fetchAndSelectSongs();
  };

  // Logic for the "Home" button
  const handleHome = () => {
    navigate("/playlists");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
        <h1 className="text-4xl font-bold text-center font-montserrat text-white">Loading...</h1>
        <svg
          className="animate-spin h-12 w-12 text-white mb-4 mt-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </div>
    );
  }

if (winner) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white overflow-hidden">
      <h1
        className="text-4xl font-bold mb-6"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Winner!
      </h1>
      <img
        src={winner.album.images[0]?.url || ""}
        alt={winner.name}
        className="w-64 h-64 object-cover rounded-lg mb-4"
        data-aos="fade-up"
        data-aos-delay="200"
      />
      <h2
        className="text-2xl font-bold"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        {winner.name}
      </h2>
      <p
        className="text-lg"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        {winner.album.name}
      </p>
      <p
        className="text-md text-gray-400"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        {winner.artists.map((artist) => artist.name).join(", ")}
      </p>
      <button
        onClick={handlePlayAgain}
        className="bg-gray-600 text-white font-semibold mt-4 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors duration-300"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        Play Again
      </button>
      <button
        onClick={handleHome}
        className="bg-blue-500 text-white font-semibold mt-4 py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-300"
        data-aos="fade-up"
        data-aos-delay="700"
      >
        Home
      </button>
      <Footer />
    </div>
  );
}

  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800 text-white overflow-hidden">
      {currentBattle && currentBattle.length === 2 ? (
        <div className="flex w-full max-w-4xl justify-around">
          {currentBattle.map((song, index) => (
            <div key={song.id} className="flex flex-col items-center">
              <img
                src={song.album.images[0]?.url || ""}
                alt={song.name}
                className="w-48 h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-bold text-center">{song.name}</h2>
              <p className="text-center">{song.album.name}</p>
              <p className="text-sm text-gray-400">{song.artists.map((artist) => artist.name).join(", ")}</p>
              <audio
                ref={(el) => (audioRefs.current[index] = el!)}
                controls
                src={song.preview_url}
                className="mt-2 w-48"
                onPlay={() => handlePlay(index)}
              />
              <button
                onClick={() => handleSongChoice(song)}
                className="bg-blue-500 text-white mt-4 px-4 py-2 rounded-lg hover:bg-blue-300 transition duration-300"
              >
                Choose
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <Footer />
    </div>
  );
};

export default Battle;
