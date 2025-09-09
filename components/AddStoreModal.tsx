import React from 'react';
// Fix: Use the useLocalization hook instead of importing LocalizationContext from App.
import { useLocalization } from '../contexts/LocalizationContext';
import Modal from './Modal';
import Button from './Button';
import { Store } from '../types';

interface AddStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({ isOpen, onClose }) => {
  // Fix: Use the useLocalization hook.
  const { t } = useLocalization();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const storeData = Object.fromEntries(formData.entries());
    console.log('New store submission:', storeData);
    // In a real application, you would send this data to a backend
    // for validation and approval before adding it to the list.
    alert('Store submitted for approval!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('form_add_store_title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">{t('form_store_name')}</label>
          <input type="text" name="storeName" id="storeName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]" />
        </div>
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">{t('form_owner_name')}</label>
          <input type="text" name="ownerName" id="ownerName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]" />
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
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('form_add_photo')} (Cover Image)</label>
          <input type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#3b5978] hover:file:bg-sky-100"/>
        </div>
        <Button type="submit" className="w-full">{t('form_submit_store')}</Button>
      </form>
    </Modal>
  );
};

export default AddStoreModal;
