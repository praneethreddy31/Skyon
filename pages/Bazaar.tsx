import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStores } from '../data/mockData';
import { Store } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import AddStoreModal from '../components/AddStoreModal';
import PostDishModal from '../components/PostDishModal';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Icon
          key={i}
          name="star"
          className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const StoreCard: React.FC<{ store: Store, onClick: () => void }> = ({ store, onClick }) => {
  return (
    <Card onClick={onClick} className="h-full">
      <img src={store.coverImageUrl} alt={store.name} className="w-full h-32 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{store.name}</h3>
        <p className="text-[#3b5978] font-medium text-sm">{store.category}</p>
        <div className="flex items-center mt-2">
            <StarRating rating={store.rating} />
            <span className="text-sm text-gray-500 ml-2">{store.rating.toFixed(1)}</span>
        </div>
      </div>
    </Card>
  );
};

const Bazaar: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [isPostDishModalOpen, setIsPostDishModalOpen] = useState(false);
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setStores(mockStores);
  }, []);

  const handleActionClick = (action: () => void) => {
    if (currentUser) {
      action();
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('bazaar_title')}</h1>
        <p className="text-gray-600">{t('bazaar_subtitle')}</p>
      </div>
      <div className="flex justify-center gap-4 mb-6">
        <Button onClick={() => handleActionClick(() => setIsAddStoreModalOpen(true))} variant="outline" leftIcon={<Icon name="add" className="w-4 h-4" />}>
            {t('bazaar_add_store')}
        </Button>
        <Button onClick={() => handleActionClick(() => setIsPostDishModalOpen(true))} leftIcon={<Icon name="food" className="w-4 h-4" />}>
            {t('post_todays_dish')}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} onClick={() => navigate(`/bazaar/${store.id}`)} />
        ))}
      </div>
      <AddStoreModal isOpen={isAddStoreModalOpen} onClose={() => setIsAddStoreModalOpen(false)} />
      <PostDishModal isOpen={isPostDishModalOpen} onClose={() => setIsPostDishModalOpen(false)} />
    </div>
  );
};

export default Bazaar;