import React, { useState } from 'react';
// Fix: Use the useLocalization hook instead of importing LocalizationContext from App.
import { useLocalization } from '../contexts/LocalizationContext';
import Modal from './Modal';
import Button from './Button';
import { mockDishTemplates } from '../data/mockData';
import { DishTemplate } from '../types';

interface PostDishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostDishModal: React.FC<PostDishModalProps> = ({ isOpen, onClose }) => {
  // Fix: Use the useLocalization hook.
  const { t } = useLocalization();
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');

  const handleTemplateClick = (template: DishTemplate) => {
    setDishName(template.name);
    setPrice(template.price.toString());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ dishName, price });
    // In a real app, you would handle file upload and API submission here
    alert('Dish posted for today!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('post_todays_dish')}>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{t('use_template')}</h3>
          <div className="flex flex-wrap gap-2">
            {mockDishTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateClick(template)}
                className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
          <div>
            <label htmlFor="dishName" className="block text-sm font-medium text-gray-700">{t('dish_name')}</label>
            <input
              type="text"
              name="dishName"
              id="dishName"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('price')}</label>
            <input
              type="number"
              name="price"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('form_add_photo')}</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#3b5978] hover:file:bg-sky-100"
            />
          </div>
          <Button type="submit" className="w-full">{t('post_dish')}</Button>
        </form>
      </div>
    </Modal>
  );
};

export default PostDishModal;
