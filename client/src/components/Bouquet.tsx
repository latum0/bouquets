import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { BouquetT } from '../types/bouquet.dto';

// Assurez-vous d'importer RootState pour le typage si nécessaire
import { type RootState } from '../store';
// Importez le sélecteur d'authentification.
import { isAuthentificated } from '../services/auth';

// Importez le composant Modale créé précédemment
import AddBouquetModal from './AddBouquetModal';
// NOTE: Ajustez le chemin d'importation de AddBouquetModal si nécessaire

function Bouquet({ bouquet }: { bouquet: BouquetT }) {
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Utilisation de useSelector pour l'authentification
  const isAuth = useSelector(
    isAuthentificated as (state: RootState) => boolean,
  );

  // Fonction appelée après l'ajout réussi du bouquet
  const handleBouquetAdded = () => {
    console.log(
      'Nouveau bouquet créé. Vous devriez rafraîchir la liste principale ici.',
    );
  };

  return (
    // Conteneur enveloppant la carte et le bouton pour l'alignement
    <div className="flex flex-col w-72 max-w-sm h-full mx-auto">
      <div // La carte principale, avec flex-grow pour l'étirer
        className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden p-4 space-y-3 flex-grow"
        // Le style fixe 'width: 18rem' a été retiré.
        key={bouquet.id}
      >
        <img
          src={`http://localhost:5000/public${bouquet.image}`}
          className="w-full h-48 object-cover rounded-md"
          alt={`Image du bouquet ${bouquet.nom}`}
        />

        <div className="space-y-1">
          <h5 className="text-xl font-bold text-gray-900">{bouquet.nom}</h5>
          <p className="text-gray-600 text-sm line-clamp-2">
            {bouquet.description}.
          </p>
          <p className="text-2xl font-extrabold text-pink-700">
            {bouquet.prix} DA.
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          {/* Bouton Like/Unlike */}
          <button
            className={`
              px-4 py-2 text-sm font-semibold rounded-full shadow-md transition duration-150 ease-in-out
              ${
                isAuth
                  ? 'bg-pink-600 text-white hover:bg-pink-700 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-700 cursor-not-allowed'
              }
            `}
            disabled={!isAuth}
            onClick={() => {
              if (isAuth) {
                setLiked(!liked);
                console.log(
                  `User ${liked ? 'unliked' : 'liked'} bouquet ${bouquet.id}`,
                );
              }
            }}
          >
            {liked ? ' Unlike' : ' Like'}
          </button>

          {/* Affichage des Likes (Bouton Statut) */}
          <span
            className="px-3 py-1 text-sm font-medium rounded-full bg-green-500 text-white shadow-sm"
            role="status"
          >
            {bouquet.likes} Likes
          </span>
        </div>
      </div>

      {/* Bouton d'ajout de Bouquet (extérieur à la carte principale) */}
      {isAuth && (
        <div className="pt-3 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-3 text-md font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-[1.01]"
          >
            + Ajouter un Nouveau Bouquet
          </button>
        </div>
      )}

      {/* Inclusion de la Modale */}
      <AddBouquetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBouquetAdded={handleBouquetAdded}
      />
    </div>
  );
}

export default Bouquet;
