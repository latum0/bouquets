// src/components/BackendSync.tsx
import { useEffect } from 'react';

type Bouquet = {
  id: number;
  nom: string;
  prix: number;
  image: string;
};

interface Props {
  onLoad: (bouquets: Bouquet[]) => void;
}

const BackendSync: React.FC<Props> = ({ onLoad }) => {
  useEffect(() => {

    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/bouquets', { method: 'GET' });
        const data = await res.json();

        localStorage.setItem('mesBouquets', JSON.stringify(data));
        onLoad(data)
      } catch (err) {
        console.error(err);
      }
    })();

  }, [onLoad]);

  return null;
};

export default BackendSync;
