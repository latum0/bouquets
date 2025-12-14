import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { BouquetT } from '../types/bouquet.dto';
import { type RootState } from '../store';
import { isAuthentificated } from '../services/auth';

function Bouquet({ bouquet }: { bouquet: BouquetT }) {
  const [liked, setLiked] = useState(false);
  const isAuth = useSelector((state: RootState) => isAuthentificated(state));

  const displayLikes = () => {
    if (typeof bouquet.likes === 'undefined') return null; // Hide if not provided
    return (
      <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
        {bouquet.likes + (liked ? 1 : 0)} Likes
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 overflow-hidden flex flex-col h-full w-full">
      {/* 1. Image Area */}
      <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
        <img
          src={`http://localhost:5000/public${bouquet.image}`}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          alt={bouquet.nom}
        />
        {/* Only show likes badge if data is available */}
        <div className="absolute top-4 right-4">{displayLikes()}</div>
      </div>

      {/* 2. Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {bouquet.nom}
          </h3>

          {/* 🌟 Conditional Price Rendering */}
          {isAuth ? (
            <p className="text-lg font-black text-pink-600 whitespace-nowrap ml-2">
              {bouquet.prix} <span className="text-xs font-bold">DA</span>
            </p>
          ) : (
            // Optional: Placeholder for guests
            <span className="text-xs text-gray-400 italic mt-1">
              Prix sur connexion
            </span>
          )}
        </div>

        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
          {bouquet.description || 'Aucune description disponible.'}
        </p>

        {/* 3. Action Button */}
        <div className="mt-auto">
          <button
            disabled={!isAuth}
            onClick={() => setLiked(!liked)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md
              ${
                isAuth
                  ? liked
                    ? 'bg-blue-600 text-white shadow-blue-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }
            `}
          >
            {/* SVG Icon ommitted for brevity, same as before */}
            {liked ? 'Aimé' : isAuth ? "J'aime" : 'Connectez-vous'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bouquet;
