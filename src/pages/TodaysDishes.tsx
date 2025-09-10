// src/pages/TodaysDishes.tsx

import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from '../components/Icon';
import PostDishModal from '../components/PostDishModal';
import { DailyDish, User } from '../types';
import { getCollection, deleteDocument } from '../services/databaseService';

const DishCard: React.FC<{ dish: DailyDish; currentUser: User | null; onDelete: (dishId: string) => void; }> = ({ dish, currentUser, onDelete }) => {
  const { t } = useLocalization();
  // Check if the currently logged-in user is the one who posted the dish
  const isOwner = currentUser?.uid === dish.seller.uid;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      onDelete(dish.id);
    }
  };

  return (
    <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 relative">
      <img src={dish.imageUrl || 'https://picsum.photos/200'} alt={dish.name} className="w-full sm:w-32 h-32 rounded-lg object-cover" />
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-800">{dish.name}</h3>
        <p className="text-sm text-gray-500">by {`${dish.seller.name} (${dish.seller.block}-${dish.seller.flatNumber})`}</p>
        <p className="text-xl font-bold text-[#3b5978] mt-2">₹{dish.price}</p>
      </div>
      <div className="flex flex-col gap-2 self-stretch sm:self-center">
        <a href={`https://wa.me/${dish.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                <Icon name="whatsapp" className="w-4 h-4 mr-2" /> {t('chat_on_whatsapp')}
            </Button>
        </a>
        <a href={`tel:${dish.phoneNumber}`}>
            <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                <Icon name="phone" className="w-4 h-4 mr-2" /> {t('call_owner')}
            </Button>
        </a>
      </div>
      {isOwner && (
        <button onClick={handleDelete} className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
          <Icon name="close" className="w-4 h-4"/>
        </button>
      )}
    </Card>
  );
};

const TodaysDishes: React.FC = () => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const [dishes, setDishes] = useState<DailyDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const fetchDishes = async () => {
      setLoading(true);
      try {
          const data = await getCollection<DailyDish>('dailyDishes');
          
          // Filter for dishes created today
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Get the timestamp for the beginning of today
          
          const todaysDishes = data.filter(dish => dish.createdAt >= today.getTime());

          setDishes(todaysDishes);
      } catch (error) {
          console.error("Error fetching dishes:", error);
      } finally {
          setLoading(false);
      }
  };
  
  useEffect(() => {
    if(currentUser) { // Only fetch if user is logged in
        fetchDishes();
    } else {
        setLoading(false);
    }
  }, [currentUser]);

  const handleDeleteDish = async (dishId: string) => {
    try {
      await deleteDocument('dailyDishes', dishId);
      fetchDishes(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting dish:", error);
      alert("Failed to delete dish.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('todays_dishes_title')}</h1>
        <p className="text-gray-600 mt-1">{t('todays_dishes_subtitle')}</p>
      </div>

      {currentUser && (
        <div className="text-center">
            <Button onClick={() => setIsPostModalOpen(true)} leftIcon={<Icon name="add" />}>
                {t('post_todays_dish')}
            </Button>
        </div>
      )}

      {loading ? <p className="text-center text-gray-500 py-10">Loading today's dishes...</p> :
      <div className="space-y-4">
        {dishes.length > 0 ? (
          dishes.map(dish => <DishCard key={dish.id} dish={dish} currentUser={currentUser} onDelete={handleDeleteDish} />)
        ) : (
          <p className="text-center text-gray-500 py-10">
            {currentUser ? "No dishes have been posted today. Be the first!" : "Please log in to see today's dishes."}
          </p>
        )}
      </div>
      }

      {isPostModalOpen && 
        <PostDishModal 
            isOpen={isPostModalOpen} 
            onClose={() => setIsPostModalOpen(false)}
            onDishPosted={fetchDishes}
        />
      }
    </div>
  );
};

export default TodaysDishes;