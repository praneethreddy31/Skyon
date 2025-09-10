// src/components/AddStoreModal.tsx

import React, { useState, useRef } from 'react'; // Import useRef
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';
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
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // Create a ref for the form

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Still need to prevent default form submission
    
    if (!currentUser || !currentUser.block || !coverImage) {
      alert("Please fill all fields and upload a store picture.");
      return;
    }
    if (!formRef.current) return; // Guard clause for the ref

    setLoading(true);

    try {
      const imageUrl = await imageUploadService.uploadImage(coverImage);
      if (!imageUrl) {
        throw new Error("Image upload failed.");
      }

      const formData = new FormData(formRef.current); // Use the ref to get form data
      const ownerInfo: UserInfo = {
          uid: currentUser.uid,
          name: currentUser.displayName || 'Unknown',
          block: currentUser.block,
          flatNumber: currentUser.flatNumber || '000',
      };

      const storeData = {
          name: formData.get('storeName') as string,
          category: formData.get('category') as Store['category'],
          owner: ownerInfo,
          rating: 0,
          coverImageUrl: imageUrl,
          products: [],
          whatsappNumber: formData.get('whatsappNumber') as string,
          phoneNumber: formData.get('phoneNumber') as string,
      };

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
      {/* Attach the ref to the form element */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">{t('form_store_name')}</label>
          <input type="text" name="storeName" id="storeName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t('form_category')}</label>
          <select name="category" id="category" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            {(['Home Food', 'Handmade Crafts', 'Boutique', 'Groceries'] as Store['category'][]).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
         <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">{t('form_whatsapp_number')}</label>
          <input type="tel" name="whatsappNumber" id="whatsappNumber" required placeholder="e.g., 919876543210" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">{t('form_phone_number')}</label>
          <input type="tel" name="phoneNumber" id="phoneNumber" required placeholder="e.g., 919876543210" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Store Picture</label>
          <input 
            type="file" 
            required 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setCoverImage(e.target.files[0]);
            }}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : t('form_submit_store')}</Button>
      </form>
    </Modal>
  );
};

export default AddStoreModal;