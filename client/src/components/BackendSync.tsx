import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBouquets } from '../store/bouquetsSlice';
import type { RootState } from '../store';

const BackendSync: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    dispatch(fetchBouquets() as any);
  }, [dispatch, isAuthenticated]);

  return null;
};

export default BackendSync;
