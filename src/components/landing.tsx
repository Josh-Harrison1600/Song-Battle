import React from 'react';
import { loginURL } from '../spotifyAuth'; 

const Landing: React.FC = () => {
    return(
        <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-800 to-black text-white p-4'>
            
            <h1 className='text-4xl font-bold mb-4'>
                Song Battle
            </h1>

            <p className='text-lg text-center mb-8 max-w-md'>
                description description description description description description description description description description description
                description description description description description description description description description description description  
            </p>
            <a
                href={loginURL} // Set the link to the Spotify login URL from your auth file
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
                Login with Spotify
            </a>
        </div>
    )

}

export default Landing;