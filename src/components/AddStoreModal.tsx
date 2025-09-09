
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { Store, UserInfo } from '../types';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreAdded: () => void;
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({ isOpen, onClose, onStoreAdded }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !currentUser.block) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const ownerInfo: UserInfo = {
        name: currentUser.displayName || 'Unknown',
        block: currentUser.block,
        flatNumber: currentUser.flatNumber || '000',
    };

    const storeData = {
        name: formData.get('storeName') as string,
        category: formData.get('category') as Store['category'],
        owner: ownerInfo,
        rating: 0, // Initial rating
        coverImageUrl: 'https://picsum.photos/seed/' + Math.random() + '/400/200',
        products: [],
        whatsappNumber: formData.get('whatsappNumber') as string,
        phoneNumber: formData.get('phoneNumber') as string,
    };

    try {
        await addDocument('stores', storeData, ownerInfo);
        alert('Store submitted!');
        onStoreAdded();
        onClose();
    } catch (error) {
        console.error("Error adding store:", error);
        alert("Failed to add store.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('form_add_store_title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">{t('form_store_name')}</label>
          <input type="text" name="storeName" id="storeName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t('form_category')}</label>
          <select name="category" id="category" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]">
            {(['Home Food', 'Handmade Crafts', 'Boutique', 'Groceries'] as Store['category'][]).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">{t('form_whatsapp_number')}</label>
          <input type="tel" name="whatsappNumber" id="whatsappNumber" required placeholder="e.g., 919876543210" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">{t('form_phone_number')}</label>
          <input type="tel" name="phoneNumber" id="phoneNumber" required placeholder="e.g., 919876543210" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : t('form_submit_store')}</Button>
      </form>
    </Modal>
  );
};

export default AddStoreModal;
