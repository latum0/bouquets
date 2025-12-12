import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { BouquetT } from '../types/bouquet.dto';
import { type RootState } from '../store';
import { isAuthentificated } from '../services/auth';

function Bouquet({ bouquet }: { bouquet: BouquetT }) {
  const [liked, setLiked] = useState(false);
  const isAuth = useSelector((state: RootState) => isAuthentificated(state));

  return (
    /* h-full ensures the card fills the grid cell height; flex-col allows internal distribution */
    <div className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 overflow-hidden flex flex-col h-full w-full">
      {/* 1. Fixed Image Container (Ensures uniform top half) */}
      <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
        <img
          src={`http://localhost:5000/public${bouquet.image}`}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          alt={bouquet.nom}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
            {bouquet.likes + (liked ? 1 : 0)} Likes
          </span>
        </div>
      </div>

      {/* 2. Content Area (flex-grow fills the remaining space) */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {bouquet.nom}
          </h3>
          <p className="text-lg font-black text-pink-600 whitespace-nowrap ml-2">
            {bouquet.prix} <span className="text-xs font-bold">DA</span>
          </p>
        </div>

        {/* Description (flex-grow pushes the button to the bottom) */}
        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
          {bouquet.description ||
            'Aucune description disponible pour ce magnifique bouquet.'}
        </p>

        {/* 3. Action Button (Always stays at the bottom) */}
        <div className="mt-auto">
          <button
            disabled={!isAuth}
            onClick={() => setLiked(!liked)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md
              ${
                isAuth
                  ? liked
                    ? 'bg-blue-600 text-white shadow-blue-200' // Blue when liked
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${
                liked ? 'fill-current scale-110' : 'none'
              }`}
              fill={liked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {liked ? 'Aimé' : "J'aime"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bouquet;
