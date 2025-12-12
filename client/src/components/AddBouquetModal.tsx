import React, { useState, useEffect } from 'react';

interface Flower {
  id: number;
  nom: string;
}

interface FlowerData {
  fleurId: number;
  quantite: number;
}

interface FormDataState {
  nom: string;
  description: string;
  prix: string;
  imageFile: File | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBouquetAdded: () => void;
}

const API_BASE_URL = 'http://localhost:5000/api/bouquets';
const FLEURS_API_URL = 'http://localhost:5000/api/fleurs';

const AddBouquetModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onBouquetAdded,
}) => {
  // --- New State for Dynamic Flowers ---
  const [availableFlowers, setAvailableFlowers] = useState<Flower[]>([]);

  const [formData, setFormData] = useState<FormDataState>({
    nom: '',
    description: '',
    prix: '',
    imageFile: null,
  });
  const [flowersData, setFlowersData] = useState<FlowerData[]>([]);
  const [serverImagePath, setServerImagePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // 1. Fetch Flowers & Load Draft on Open
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch Flowers list
          const fleursRes = await fetch(FLEURS_API_URL);
          if (fleursRes.ok) {
            const fleursJson = await fleursRes.json();
            setAvailableFlowers(fleursJson);
          }

          // Fetch Draft from Cookie
          const draftRes = await fetch(`${API_BASE_URL}/draft`);
          if (draftRes.ok && draftRes.status !== 204) {
            const draft = await draftRes.json();
            setFormData({
              nom: draft.nom || '',
              description: draft.description || '',
              prix: draft.prix?.toString() || '',
              imageFile: null,
            });
            setFlowersData(draft.flowers || []);
            setServerImagePath(draft.image || null);
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setError('Failed to load initial data.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setFormData({ nom: '', description: '', prix: '', imageFile: null });
    setFlowersData([]);
    setServerImagePath(null);
    setError(null);
    setShowConfirmExit(false);
  };

  if (!isOpen) return null;

  const handleRequestClose = () => {
    const isDirty =
      formData.nom ||
      formData.prix ||
      formData.imageFile ||
      flowersData.length > 0;
    if (isDirty) {
      setShowConfirmExit(true);
    } else {
      onClose();
    }
  };

  const preparePayload = () => {
    const data = new FormData();
    data.append('nom', formData.nom);
    data.append('description', formData.description);
    data.append('prix', formData.prix);
    data.append('flowers', JSON.stringify(flowersData));

    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    } else if (serverImagePath) {
      data.append('image', serverImagePath);
    }
    return data;
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = preparePayload();
      const res = await fetch(`${API_BASE_URL}/draft`, {
        method: 'POST',
        body: payload,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Draft failed');
      setServerImagePath(result.data.image);
      alert('Draft saved to cookies!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (
      !formData.nom ||
      !formData.prix ||
      (!formData.imageFile && !serverImagePath) ||
      flowersData.length === 0
    ) {
      setError(
        'Please complete the form: Name, Price, Image, and flowers are required.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = preparePayload();
      const res = await fetch(`${API_BASE_URL}/final`, {
        method: 'POST',
        body: payload,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Finalization failed');
      alert('Bouquet added to Database!');
      onBouquetAdded();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {showConfirmExit && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm text-center">
            <h4 className="text-xl font-bold mb-2">Discard Changes?</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to quit without saving?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Stay
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold">Add New Bouquet</h3>
          <button
            onClick={handleRequestClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (DA)
              </label>
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={formData.prix}
                onChange={(e) =>
                  setFormData({ ...formData, prix: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            {serverImagePath && !formData.imageFile && (
              <p className="text-xs text-green-600 mb-1">
                Current: {serverImagePath.split('/').pop()}
              </p>
            )}
            <input
              type="file"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  imageFile: e.target.files ? e.target.files[0] : null,
                })
              }
              className="text-sm"
            />
          </div>

          <div className="border rounded-lg p-4 bg-pink-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-pink-800">Composition</h4>
              <button
                type="button"
                onClick={() => {
                  const firstId = availableFlowers[0]?.id || 0;
                  setFlowersData([
                    ...flowersData,
                    { fleurId: firstId, quantite: 1 },
                  ]);
                }}
                className="text-xs bg-pink-600 text-white px-2 py-1 rounded"
              >
                + Add Flower
              </button>
            </div>
            {flowersData.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select
                  className="flex-1 border rounded p-1 text-sm"
                  value={f.fleurId}
                  onChange={(e) => {
                    const updated = [...flowersData];
                    updated[i].fleurId = parseInt(e.target.value);
                    setFlowersData(updated);
                  }}
                >
                  <option value={0} disabled>
                    Select a flower
                  </option>
                  {availableFlowers.map((af) => (
                    <option key={af.id} value={af.id}>
                      {af.nom}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="w-20 border rounded p-1 text-sm"
                  min="1"
                  value={f.quantite}
                  onChange={(e) => {
                    const updated = [...flowersData];
                    updated[i].quantite = parseInt(e.target.value);
                    setFlowersData(updated);
                  }}
                />
              </div>
            ))}
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleRequestClose}
            className="px-4 py-2 text-gray-600 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold hover:bg-indigo-200 transition"
          >
            {isLoading ? 'Saving...' : 'Save Draft (Cookie)'}
          </button>
          <button
            onClick={handleFinalize}
            disabled={isLoading}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 shadow-md transition"
          >
            {isLoading ? 'Processing...' : 'Add Bouquet (DB)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBouquetModal;
