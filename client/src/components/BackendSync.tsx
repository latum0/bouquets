import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBouquets } from '../store/bouquetsSlice';

const BackendSync: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBouquets() as any);
  }, [dispatch]);

  return null;
};

export default BackendSync;
