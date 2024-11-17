import React, { useEffect } from 'react';
import { loginURL } from '../spotifyAuth';
import battleIMG from './images/landingIMG.png';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SpotifyLogo from './images/spotify.png';


const Landing: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1200 }); 
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-4 overflow-hidden"
      data-aos="fade-up"
    >
      {/* Title */}
      <h1
        className="text-5xl font-bold mb-16 font-roboto z-10"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Song <a className='text-green-500'>Battle</a>
      </h1>

      {/* Content Sectionn */}
      <div
        className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl mb-8
        bg-gray-900 border border-gray-600 rounded-lg p-8 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl z-10"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div
          className="lg:w-1/2 text-center lg:text-left space-y-4"
          data-aos="fade-right"
          data-aos-delay="700"
        >
          <h2 className="text-3xl font-semibold font-inter text-center">
            Put your songs in the ultimate battle!
          </h2>
          <p className="text-lg text-gray-300 font-inter text-center">
            Connect to your Spotify account, select a playlist, and pit your
            favorite songs against each other in a tournament. 
            Discover which song reigns supreme in your playlist!
          </p>
        </div>

        <div
          className="lg:w-1/2 flex justify-center"
          data-aos="fade-left"
          data-aos-delay="900"
        >
          <img
            src={battleIMG}
            alt="Battle Screen Preview"
            className="rounded-lg shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>

      {/* Login Prompt */}
      <p
        className="text-lg text-center mb-8 max-w-md font-inter mt-16 z-10"
        data-aos="fade-up"
        data-aos-delay="1100"
      >
        Click the button below to sync your Spotify account and start the battle!
      </p>

      <a
        href={loginURL}
        className="bg-green-500 text-black font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-md font-inter z-10 flex items-center justify-center gap-3"
        data-aos="fade-up"
        data-aos-delay="1300"
      >
        <img
          src={SpotifyLogo}
          alt = "Spotify Logo"
          className='w-6 sh-6'
        />
        Login with Spotify
      </a>

      {/* Wave Effect */}
      <div className="absolute bottom-0 w-full -z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
        >
          <path
            fill="#000000"
            fillOpacity="1"
            d="M0,96L60,101.3C120,107,240,117,360,128C480,139,600,149,720,160C840,171,960,181,1080,165.3C1200,149,1320,107,1380,85.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Landing;
