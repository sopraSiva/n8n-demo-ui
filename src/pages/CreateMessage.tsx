import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { supabase } from '../lib/supabase';
import { Store } from '../types/database';
import { Store as StoreIcon, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type SelectionMode = 'none' | 'manual' | 'list' | 'all';

export function CreateMessage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('none');
  const [manualInput, setManualInput] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [availableStores, setAvailableStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('status', 'Active')
        .order('name');

      if (error) throw error;
      setAvailableStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleManualEntry = () => {
    setSelectionMode('manual');
    setSelectedStores([]);
  };

  const handleChooseFromList = () => {
    setSelectionMode('list');
    setShowStoreModal(true);
  };

  const handleSendToAll = () => {
    setSelectionMode('all');
    const allStoreCodes = availableStores.map((store) => store.code);
    setSelectedStores(allStoreCodes);
  };

  const handleCancelAction = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/messages');
    }
  };

  const handleManualInputSubmit = () => {
    const codes = manualInput
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code.length > 0);
    setSelectedStores(codes);
    setManualInput('');
  };

  const handleStoreSelection = (storeCode: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeCode)
        ? prev.filter((code) => code !== storeCode)
        : [...prev, storeCode]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      alert('Please fill in both subject and message');
      return;
    }

    if (selectedStores.length === 0) {
      alert('Please select at least one store');
      return;
    }

    if (!user) {
      alert('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('messages').insert({
        title: formData.subject,
        body: formData.message,
        list_of_stores: selectedStores,
        user_id: user.id,
      });

      if (error) throw error;

      navigate('/messages');
    } catch (error) {
      console.error('Error creating message:', error);
      alert('Failed to create message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Message</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Store Selection</h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleManualEntry}
                className="flex flex-col items-center justify-center p-6 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <StoreIcon className="w-8 h-8 mb-2" />
                <span className="font-medium">Enter list of stores</span>
              </button>

              <button
                type="button"
                onClick={handleChooseFromList}
                className="flex flex-col items-center justify-center p-6 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <StoreIcon className="w-8 h-8 mb-2" />
                <span className="font-medium">Choose stores from list</span>
              </button>

              <button
                type="button"
                onClick={handleSendToAll}
                className="flex flex-col items-center justify-center p-6 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <StoreIcon className="w-8 h-8 mb-2" />
                <span className="font-medium">Send to all stores</span>
              </button>

              <button
                type="button"
                onClick={handleCancelAction}
                className="flex flex-col items-center justify-center p-6 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <X className="w-8 h-8 mb-2" />
                <span className="font-medium">Cancel action</span>
              </button>
            </div>

            {selectionMode === 'manual' && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Enter store codes (comma-separated)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="e.g., ST001, ST002, ST003"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleManualInputSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {selectedStores.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Stores ({selectedStores.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStores.map((code) => (
                    <span
                      key={code}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                    >
                      {code}
                      <button
                        type="button"
                        onClick={() => setSelectedStores((prev) => prev.filter((c) => c !== code))}
                        className="ml-2 hover:text-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Creating...' : 'Create Message'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showStoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Select Stores</h2>
              <button
                onClick={() => setShowStoreModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2">
              {availableStores.map((store) => (
                <label
                  key={store.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStores.includes(store.code)}
                    onChange={() => handleStoreSelection(store.code)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">{store.code}</span> - {store.name} ({store.area})
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStoreModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
