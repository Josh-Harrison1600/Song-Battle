import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { getSpotifyToken } from './spotifyAuth';
import Landing from './components/landing';
import Playlists from './components/Playlists';
import Battle from './components/Battle';
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [globalLoading, setGlobalLoading] = useState(false)

  //sign out logic
  const handleSignOut = () => {
    localStorage.removeItem("spotifyAccessToken");
    window.location.href = "/";
  }

  //make sure navbar is only on playlists.tsx & battle.tsx
  const showNavbar =
    !globalLoading &&
    (location.pathname === "/playlists" || location.pathname.startsWith("/battle"));

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
    <>
      {showNavbar && <Navbar onSignOut={handleSignOut} />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/playlists" element={<Playlists />} />
        {/* Pass setGlobalLoading to Battle */}
        <Route
          path="/battle/:playlistId"
          element={<Battle setGlobalLoading={setGlobalLoading} />}
        />
      </Routes>
    </>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;