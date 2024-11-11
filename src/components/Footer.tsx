import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white py-4 flex items-center justify-center fixed bottom-0">
      <div className="flex flex-col items-center">
      <a
          href="https://github.com/Josh-Harrison1600"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400 transition duration-300"
        >
          <FaGithub size={24} />
        </a>
        <p className="text-sm font-montserrat mt-2">Song Battle © {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;
