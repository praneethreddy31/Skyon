
import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { DishTemplate, UserInfo } from '../types';

// In a real app, templates could be fetched from the user's profile in the DB
const mockDishTemplates: DishTemplate[] = [
  { id: 1, name: 'Chicken Biryani', price: 180 },
  { id: 2, name: 'Paneer Butter Masala', price: 150 },
  { id: 3, name: 'Aloo Gobi', price: 100 },
];

interface PostDishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostDishModal: React.FC<PostDishModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTemplateClick = (template: DishTemplate) => {
    setDishName(template.name);
    setPrice(template.price.toString());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !currentUser.block) return;
    setLoading(true);

    const sellerInfo: UserInfo = {
        name: currentUser.displayName || 'Unknown',
        block: currentUser.block,
        flatNumber: currentUser.flatNumber || '000',
    };

    const dishData = {
        name: dishName,
        price: Number(price),
        seller: sellerInfo,
        imageUrl: 'https://picsum.photos/seed/' + dishName + '/400/300',
        postedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit'}),
    };

    try {
        await addDocument('dailyDishes', dishData, sellerInfo);
        alert('Dish posted for today!');
        onClose();
        // Optionally, trigger a refresh on the TodaysDishes page
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
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Posting..." : t('post_dish')}</Button>
        </form>
      </div>
    </Modal>
  );
};

export default PostDishModal;
