import React, { useState } from 'react';
import { createFleur, type FleurData } from '../services/fleur';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFleurAdded: (newFleur: FleurData) => void;
}

const AddFleurModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onFleurAdded,
}) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nom || prixUnitaire <= 0) {
      setError('Le nom et un prix positif sont requis.');
      return;
    }

    setIsLoading(true);
    try {
      const newFleur = await createFleur({ nom, description, prixUnitaire });

      // Succès
      onFleurAdded(newFleur);
      setNom('');
      setDescription('');
      setPrixUnitaire(0);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-bold leading-6 text-gray-900 mb-4">
          Ajouter une Nouvelle Fleur
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-gray-700"
            >
              Nom
            </label>
            <input
              type="text"
              id="nom"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Prix Unitaire */}
          <div>
            <label
              htmlFor="prixUnitaire"
              className="block text-sm font-medium text-gray-700"
            >
              Prix Unitaire (DA)
            </label>
            <input
              type="number"
              id="prixUnitaire"
              required
              min="0.01"
              step="0.01"
              value={prixUnitaire}
              onChange={(e) => setPrixUnitaire(parseFloat(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Affichage des Erreurs */}
          {error && (
            <div className="p-3 text-sm text-blue-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Boutons d'Action */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition duration-150 ease-in-out ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Ajout en cours...' : 'Ajouter la Fleur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFleurModal;
