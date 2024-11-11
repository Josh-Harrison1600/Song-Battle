import React from "react";
import { useNavigate } from "react-router-dom";
import Playlists from "./Playlists";

interface NavbarProps {
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignOut }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section - Home and About */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/playlists")}
            className="font-roboto text-xl hover:text-gray-300"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/about")}
            className="font-roboto text-xl hover:text-gray-300"
          >
            About
          </button>
        </div>

        {/* Center Section - Title */}
        <div className="text-4xl font-bold hover:text-gray-300 cursor-pointer">
          <h1 onClick={() => navigate("/playlists")}>Song Battle</h1>
        </div>

        {/* Right Section - Sign Out Button */}
        <div>
          <button
            onClick={onSignOut}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
