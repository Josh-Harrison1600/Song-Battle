import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Landing from './components/landing';
import Playlists from './components/Playlists';
import { getSpotifyToken } from './spotifyAuth';
import Battle from './components/Battle';

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to extract the token from the URL hash
    const token = getSpotifyToken();
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('spotifyAccessToken', token);

      // Clear the hash from the URL
      window.history.replaceState({}, document.title, "/");

      // Redirect to the playlists page
      navigate('/playlists');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/playlists" element={<Playlists />} />
      <Route path="/battle/:playlistId" element={<Battle />} />
    </Routes>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;