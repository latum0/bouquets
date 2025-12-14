import { myFetch } from '../comm/fetchOrAxios';

const API_BASE_URL = 'http://localhost:5000/api/fleurs';

export interface FleurData {
  id: number;
  nom: string;
  description: string;
  prixUnitaire?: number;
}

export const fetchAllFleurs = async (): Promise<FleurData[]> => {
  return await myFetch(API_BASE_URL);
};

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
  return data.fleur;
};
