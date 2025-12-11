const API_BASE_URL = 'http://localhost:5000/api/fleurs'; // Adaptez l'URL

export interface FleurData {
  id: number;
  nom: string;
  description: string;
  prixUnitaire: number;
}

// Récupère toutes les fleurs
export const fetchAllFleurs = async (): Promise<FleurData[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Échec de la récupération des fleurs.');
  }
  return response.json();
};

// Ajoute une nouvelle fleur
export const createFleur = async (
  fleur: Omit<FleurData, 'id'>,
): Promise<FleurData> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fleur),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Échec de l'ajout de la fleur.");
  }
  return data.fleur; // Votre contrôleur retourne { message, fleur }
};
