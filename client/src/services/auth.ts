import { useSelector } from 'react-redux';
import { store, type RootState } from '../store';
import { logoutUser } from '../store/authSlice';
import { myFetch } from '../comm/fetchOrAxios';

export const isAuthentificated = (state: RootState): boolean => {
  return state.auth.isAuthenticated;
};

export const whoIsAuthentificated = (state: RootState): string => {
  return state.auth.user?.nomComplet || 'Mon Compte';
};

export const loginApi = async (login: string, password: string) => {
  try {
    const data = await myFetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Échec de la connexion.');
    }
    throw new Error('Échec de la connexion.');
  }
};
export const handleLogout = async () => {
  store.dispatch(logoutUser());
};
