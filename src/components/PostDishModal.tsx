// src/components/PostDishModal.tsx

import React, { useState, useRef } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';
import Modal from './Modal';
import Button from './Button';
import { DishTemplate, UserInfo } from '../types';

// The dish templates are defined directly inside the file
const dishTemplates: DishTemplate[] = [
  { id: 1, name: 'Chicken Biryani', price: 180 },
  { id: 2, name: 'Paneer Butter Masala', price: 150 },
  { id: 3, name: 'Aloo Gobi', price: 100 },
];

interface PostDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDishPosted: () => void;
}

const PostDishModal: React.FC<PostDishModalProps> = ({ isOpen, onClose, onDishPosted }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !currentUser.block || !imageFile) {
        alert("Please fill all fields and upload a dish photo.");
        return;
    };
    if (!formRef.current) return;
    setLoading(true);

    try {
        const imageUrl = await imageUploadService.uploadImage(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");

        const formData = new FormData(formRef.current);
        const sellerInfo: UserInfo = {
            uid: currentUser.uid,
            name: currentUser.displayName || 'Unknown',
            block: currentUser.block,
            flatNumber: currentUser.flatNumber || '000',
        };

        const dishData = {
            name: formData.get('dishName') as string,
            price: Number(formData.get('price')),
            seller: sellerInfo,
            whatsappNumber: formData.get('whatsappNumber') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            imageUrl: imageUrl, // Use real image URL
            postedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit'}),
        };

        await addDocument('dailyDishes', dishData, sellerInfo);
        alert('Dish posted for today!');
        onDishPosted();
        onClose();
    } catch (error) {
        console.error("Error posting dish:", error);
        alert("Failed to post dish.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('post_todays_dish')}>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{t('use_template')}</h3>
          <div className="flex flex-wrap gap-2">
            {dishTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => {
                  // This is a simple way to set form values from a template
                  if(formRef.current) {
                    (formRef.current.elements.namedItem('dishName') as HTMLInputElement).value = template.name;
                    (formRef.current.elements.namedItem('price') as HTMLInputElement).value = template.price.toString();
                  }
                }}
                className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('dish_name')}</label>
            <input type="text" name="dishName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('price')}</label>
            <input type="number" name="price" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form_whatsapp_number')}</label>
            <input type="tel" name="whatsappNumber" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form_phone_number')}</label>
            <input type="tel" name="phoneNumber" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form_add_photo')}</label>
            <input 
                type="file" 
                required
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files) setImageFile(e.target.files[0]);
                }}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Posting..." : t('post_dish')}</Button>
        </form>
      </div>
    </Modal>
  );
};

export default PostDishModal;