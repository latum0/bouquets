import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export const isAuthentificated = (state: RootState): boolean => {
  return state.auth.isAuthenticated;
};

export const whoIsAuthentificated = (state: RootState): string => {
  return state.auth.user?.nomComplet || 'Mon Compte';
};

export const loginApi = async (login: string, password: string) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    // Lance une erreur pour être capturée dans le composant
    const errorData = await response.json();
    throw new Error(errorData.message || 'Échec de la connexion.');
  }

  // Le corps de la réponse contient { token, user }
  return response.json();
};
