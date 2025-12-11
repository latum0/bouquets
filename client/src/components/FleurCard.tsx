import React from 'react';
import type { FleurData } from '../services/fleur';

const FleurCard: React.FC<{ fleur: FleurData }> = ({ fleur }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between h-full">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{fleur.nom}</h3>
        <p className="text-sm text-gray-600">
          {fleur.description || 'Aucune description fournie.'}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-lg font-semibold text-blue-600">
          {fleur.prixUnitaire.toFixed(2)} DA / unité
        </p>
      </div>
    </div>
  );
};

export default FleurCard;
