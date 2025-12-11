import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { isAuthentificated } from '../services/auth';
import AddFleurModal from '../components/AddFleurModal';
import FleurCard from '../components/FleurCard';
import { fetchAllFleurs, type FleurData } from '../services/fleur';

const Fleurs = () => {
  const [fleurs, setFleurs] = useState<FleurData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Vérification de l'authentification pour le bouton d'ajout
  const isAuth = useSelector(
    isAuthentificated as (state: RootState) => boolean,
  );

  const loadFleurs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllFleurs();
      setFleurs(data);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les données des fleurs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFleurs();
  }, [loadFleurs]);

  const handleFleurAdded = (newFleur: FleurData) => {
    // Ajoute la nouvelle fleur à la liste existante sans recharger toute la page
    setFleurs((prev) => [...prev, newFleur]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Toutes les Fleurs
        </h1>

        {/* Bouton d'ajout visible si authentifié */}
        {isAuth && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 text-md font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
          >
            + Ajouter une Fleur
          </button>
        )}
      </div>

      {/* Affichage des états de chargement/erreur */}
      {isLoading && (
        <div className="text-center text-lg text-gray-500">
          Chargement des fleurs...
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 text-blue-700 rounded-lg">{error}</div>
      )}

      {/* Grille d'affichage des fleurs */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fleurs.length > 0 ? (
            fleurs.map((fleur) => <FleurCard key={fleur.id} fleur={fleur} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Aucune fleur disponible pour le moment.
            </p>
          )}
        </div>
      )}

      {/* La Modale d'ajout */}
      <AddFleurModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFleurAdded={handleFleurAdded}
      />
    </div>
  );
};

export default Fleurs;
