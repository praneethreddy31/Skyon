
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import Card from '../components/Card';
import { DailyDish } from '../types';
import { getCollection } from '../services/databaseService';

const DishCard: React.FC<{ dish: DailyDish }> = ({ dish }) => {
  return (
    <Card className="flex items-center gap-4 p-4">
      <img src={dish.imageUrl || 'https://picsum.photos/200'} alt={dish.name} className="w-24 h-24 rounded-lg object-cover" />
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-800">{dish.name}</h3>
        <p className="text-sm text-gray-500">by {`${dish.seller.name} (${dish.seller.block}-${dish.seller.flatNumber})`}</p>
        <p className="text-xl font-bold text-[#3b5978] mt-2">₹{dish.price}</p>
      </div>
      <div className="text-right text-xs text-gray-400 self-start">
        {dish.postedAt}
      </div>
    </Card>
  );
};

const TodaysDishes: React.FC = () => {
  const { t } = useLocalization();
  const [dishes, setDishes] = useState<DailyDish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
        setLoading(true);
        try {
            const data = await getCollection<DailyDish>('dailyDishes');
            // Simple filter for today - in production, you'd query by timestamp
            setDishes(data.sort((a, b) => (b as any).createdAt - (a as any).createdAt));
        } catch (error) {
            console.error("Error fetching dishes:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchDishes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('todays_dishes_title')}</h1>
        <p className="text-gray-600 mt-1">{t('todays_dishes_subtitle')}</p>
      </div>
      {loading ? <p className="text-center text-gray-500 py-10">Loading today's dishes...</p> :
      <div className="space-y-4">
        {dishes.length > 0 ? (
          dishes.map(dish => <DishCard key={dish.id} dish={dish} />)
        ) : (
          <p className="text-center text-gray-500 py-10">No dishes have been posted today. Check back later!</p>
        )}
      </div>
      }
    </div>
  );
};

export default TodaysDishes;
