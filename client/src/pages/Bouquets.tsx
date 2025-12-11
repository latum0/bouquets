import React from 'react';
import Bouquet from '../components/Bouquet';
import type { BouquetT } from '../types/bouquet.dto';

const Bouquets = ({ bouquets }: { bouquets: BouquetT[] }) => {
  return (
    // Remplacement des classes Bootstrap par Tailwind pour la disposition
    <div className="flex flex-wrap justify-center gap-6 p-4 md:p-8">
      {bouquets.map((b: BouquetT) => (
        <Bouquet key={b.id} bouquet={b} />
      ))}
    </div>
  );
};

export default Bouquets;
