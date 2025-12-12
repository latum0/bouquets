import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { BouquetT } from '../types/bouquet.dto';
import { type RootState } from '../store';
import { isAuthentificated } from '../services/auth';
import Bouquet from '../components/Bouquet';
import AddBouquetModal from '../components/AddBouquetModal';

const Bouquets = ({ bouquets }: { bouquets: BouquetT[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuth = useSelector((state: RootState) => isAuthentificated(state));

  const handleBouquetAdded = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Nos <span className="text-blue-600">Bouquets</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Découvrez nos créations florales uniques.
          </p>
        </div>

        {isAuth && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter un nouveau bouquet
          </button>
        )}
      </div>

      {/* --- Responsive Sleek Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
        {bouquets.map((b) => (
          <Bouquet key={b.id} bouquet={b} />
        ))}
      </div>

      {/* --- Global Modal --- */}
      <AddBouquetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBouquetAdded={handleBouquetAdded}
      />
    </div>
  );
};

export default Bouquets;
