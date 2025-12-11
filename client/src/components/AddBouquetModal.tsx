import React, { useState, useEffect } from 'react';

// NOTE: Vous devrez créer les interfaces pour les données.
interface FlowerData {
  fleurId: number;
  quantite: number;
}
interface FormData {
  nom: string;
  description: string;
  prix: number;
  // L'imageFile est pour l'upload local, l'image (string) viendra du brouillon
  imageFile: File | null;
}
// Interface pour les données du draft, incluant le chemin d'image côté serveur
interface DraftData extends Omit<FormData, 'imageFile'> {
  image: string;
  flowers: FlowerData[];
}

// Props pour la Modale
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBouquetAdded: () => void; // Fonction appelée après succès
}

// URL de base de l'API (à adapter)
const API_BASE_URL = 'http://localhost:5000/api/bouquets';

// Simulation des ID de Fleurs existantes pour le formulaire (à adapter)
const availableFlowers = [
  { id: 1, nom: 'Jasmin' },
  { id: 2, nom: 'Rose Rouge' },
];

const AddBouquetModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onBouquetAdded,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    description: '',
    prix: 0,
    imageFile: null,
  });
  const [flowersData, setFlowersData] = useState<FlowerData[]>([]);
  const [draftImagePath, setDraftImagePath] = useState<string | null>(null); // Chemin de l'image si draft existe
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIQUE DE RÉCUPÉRATION DU BROUILLON (COOKIES) ---
  useEffect(() => {
    if (!isOpen) {
      // Réinitialiser l'état quand la modale est fermée
      setFormData({ nom: '', description: '', prix: 0, imageFile: null });
      setFlowersData([]);
      setDraftImagePath(null);
      setError(null);
      return;
    }

    const loadDraft = async () => {
      try {
        // NOTE: Nous utilisons la nouvelle route GET /api/bouquets/draft
        const response = await fetch(`${API_BASE_URL}/draft`);

        if (response.status === 204) {
          console.log('Aucun brouillon trouvé.');
          return;
        }

        if (!response.ok)
          throw new Error('Échec de la récupération du brouillon.');

        const draftData: DraftData = await response.json();

        // Pré-remplir le formulaire avec les données du brouillon
        setFormData({
          nom: draftData.nom,
          description: draftData.description,
          prix: draftData.prix,
          imageFile: null, // L'imageFile n'est jamais récupéré du draft
        });
        setFlowersData(draftData.flowers);
        setDraftImagePath(draftData.image); // Stocker le chemin d'image du serveur
        setError(null);

        alert('Brouillon trouvé! Veuillez finaliser ou mettre à jour.');
      } catch (err: any) {
        console.error('Erreur de chargement du brouillon:', err);
        setError(err.message || 'Erreur lors du chargement du brouillon.');
      }
    };

    loadDraft();
  }, [isOpen]);
  // --------------------------------------------------------

  if (!isOpen) return null;

  const handleFlowerChange = (
    index: number,
    key: keyof FlowerData,
    value: number,
  ) => {
    const newFlowers = [...flowersData];
    newFlowers[index] = { ...newFlowers[index], [key]: value };
    setFlowersData(newFlowers);
  };

  const addFlowerInput = () => {
    setFlowersData([
      ...flowersData,
      // Assurez-vous d'avoir au moins une fleur par défaut si availableFlowers n'est pas vide
      { fleurId: availableFlowers[0]?.id || 1, quantite: 1 },
    ]);
  };

  const createDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Vérification des champs requis pour un draft (y compris l'imageFile pour le premier draft)
    if (
      !formData.nom ||
      !formData.prix ||
      (!formData.imageFile && !draftImagePath) || // L'image doit être soit nouvelle, soit déjà dans le draft
      flowersData.length === 0
    ) {
      setError(
        "Veuillez remplir le nom, le prix, l'image (si non déjà enregistrée) et ajouter au moins une fleur pour enregistrer le brouillon.",
      );
      return;
    }

    setIsLoading(true);

    // Préparation des données pour l'API Draft
    const draftFormData = new FormData();
    draftFormData.append('nom', formData.nom);
    draftFormData.append('description', formData.description);
    draftFormData.append('prix', formData.prix.toString());
    draftFormData.append('flowers', JSON.stringify(flowersData));

    if (formData.imageFile) {
      draftFormData.append('image', formData.imageFile); // Envoie le fichier s'il est nouveau
    }
    // Si l'image existe déjà, elle est dans le cookie et n'est pas envoyée ici,
    // MAIS le contrôleur bouquetDraft *exige* un req.file, ce qui signifie que
    // le front-end DOIT toujours envoyer une image, même une dummy, ou que le back-end
    // doit être modifié pour ne pas exiger req.file si draftImagePath est présent.

    try {
      // NOTE: Appel de la route Draft
      const response = await fetch(`${API_BASE_URL}/draft`, {
        method: 'POST',
        body: draftFormData,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || "Échec de l'enregistrement du brouillon.",
        );

      alert('Brouillon enregistré avec succès! Vous pouvez fermer la modale.');
      // Mettre à jour l'état de l'image (si un nouveau fichier a été téléchargé)
      if (data.data?.image) {
        setDraftImagePath(data.data.image);
        setFormData((prev) => ({ ...prev, imageFile: null })); // Effacer l'objet File
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement du brouillon:", err);
      setError(
        err.message || "Erreur inconnue lors de l'enregistrement du brouillon.",
      );
      setIsLoading(false);
    }
  };

  const finalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!draftImagePath) {
      setError(
        "Vous devez d'abord enregistrer le brouillon (avec une image) avant de pouvoir finaliser le bouquet.",
      );
      return;
    }

    setIsLoading(true);

    try {
      // NOTE: Appel de la route Finalize. Pas de corps requis, car les données sont dans le cookie.
      const response = await fetch(`${API_BASE_URL}/final`, {
        method: 'POST',
        // Headers et body ne sont pas nécessaires car le back-end utilise le cookie.
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Échec de la finalisation.');

      alert('Bouquet créé avec succès!');
      // Réinitialiser le formulaire après succès
      setFormData({ nom: '', description: '', prix: 0, imageFile: null });
      setFlowersData([]);
      setDraftImagePath(null);

      onBouquetAdded(); // Notifier le parent de l'ajout
      onClose(); // Fermer la modale
    } catch (err: any) {
      console.error('Erreur lors de la création:', err);
      setError(
        err.message || 'Erreur inconnue lors de la finalisation du bouquet.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-4">
          Ajouter un Nouveau Bouquet
        </h3>

        {/* Changement de la gestion du formulaire pour utiliser createDraft pour le brouillon */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Nom du Bouquet */}
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
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
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
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Prix */}
          <div>
            <label
              htmlFor="prix"
              className="block text-sm font-medium text-gray-700"
            >
              Prix (DA)
            </label>
            <input
              type="number"
              id="prix"
              required
              min="0"
              step="0.01"
              value={formData.prix}
              onChange={(e) =>
                setFormData({ ...formData, prix: parseFloat(e.target.value) })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image{' '}
              {draftImagePath
                ? '(Image brouillon actuelle)'
                : '(Requise pour le brouillon initial)'}
            </label>
            {draftImagePath && (
              <p className="text-xs text-green-600 mb-1">
                Image déjà enregistrée: {draftImagePath.split('/').pop()}
                {/* Optionnel: afficher l'image brouillon ici */}
              </p>
            )}
            <input
              type="file"
              id="image"
              // L'attribut 'required' est retiré ici car l'image peut déjà être dans le brouillon
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imageFile: e.target.files ? e.target.files[0] : null,
                })
              }
              className="mt-1 block w-full"
            />
          </div>

          {/* Gestion des Fleurs */}
          <div className="border p-3 rounded-md">
            <h4 className="font-semibold mb-2">Composition du Bouquet</h4>
            {flowersData.map((flower, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <select
                  value={flower.fleurId}
                  onChange={(e) =>
                    handleFlowerChange(
                      index,
                      'fleurId',
                      parseInt(e.target.value),
                    )
                  }
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  {/* Mappez sur vos vraies fleurs ici */}
                  {availableFlowers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Quantité"
                  value={flower.quantite}
                  onChange={(e) =>
                    handleFlowerChange(
                      index,
                      'quantite',
                      parseInt(e.target.value),
                    )
                  }
                  className="block w-1/4 border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addFlowerInput}
              className="mt-2 text-sm text-pink-600 hover:text-pink-800"
            >
              + Ajouter une Fleur
            </button>
          </div>

          {/* Affichage des Erreurs */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Boutons d'Action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="button" // Changé de 'submit' à 'button'
              onClick={createDraft}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition duration-150 ease-in-out ${
                isLoading
                  ? 'bg-indigo-400'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading
                ? 'Enregistrement Brouillon...'
                : 'Enregistrer Brouillon'}
            </button>
            <button
              type="button" // Changé de 'submit' à 'button'
              onClick={finalize}
              disabled={isLoading || !draftImagePath} // Désactivé si pas de chemin d'image (pas de draft)
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition duration-150 ease-in-out ${
                isLoading || !draftImagePath
                  ? 'bg-pink-400'
                  : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              {isLoading ? 'Finalisation...' : 'Créer le Bouquet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBouquetModal;
