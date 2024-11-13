import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import Playlists from "./Playlists";

interface NavbarProps {
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignOut }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  // Attach and clean up the event listener for clicking outside the dropdown
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-black text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section - Home and About */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/playlists")}
            className="font-bold font-roboto text-xl hover:text-red-500 transition duration-300"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/about")}
            className="font-bold font-roboto text-xl hover:text-red-500 transition duration-300"
          >
            About
          </button>
        </div>

        {/* Center Section - Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold hover:text-red-500 transition duration-300 cursor-pointer">
          <h1 onClick={() => navigate("/playlists")}>Song Battle</h1>
        </div>

        {/* Right Section - Account Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 hover:text-red-500 transition duration-300"
          >
            <FaUserCircle size={24} />
            <span className="font-bold">Account</span>
            <FaChevronDown size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
              <button
                onClick={onSignOut}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-100 transition duration-300"
              >
                <span>Sign Out</span>
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
