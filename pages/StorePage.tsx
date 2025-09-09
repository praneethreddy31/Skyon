import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockStores } from '../data/mockData';
import { useLocalization } from '../contexts/LocalizationContext';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Card from '../components/Card';
import { Product } from '../types';

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

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { t } = useLocalization();
  
  const store = mockStores.find(s => s.id === parseInt(storeId || ''));

  if (!store) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Store not found</h2>
        <Link to="/bazaar" className="text-[#3b5978] hover:underline mt-4 inline-block">
          &larr; {t('back_to_bazaar')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link to="/bazaar" className="text-[#3b5978] hover:text-[#2c4259] flex items-center gap-2">
          <Icon name="arrowLeft" className="w-5 h-5" />
          <span>{t('back_to_bazaar')}</span>
        </Link>
      </div>

      <Card>
        <img src={store.coverImageUrl} alt={store.name} className="w-full h-48 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">{store.name}</h1>
          <p className="text-gray-600 mt-1">By {`${store.owner.name} (${store.owner.block}-${store.owner.flatNumber})`}</p>
          <div className="flex items-center mt-2">
            <StarRating rating={store.rating} />
            <span className="text-sm text-gray-500 ml-2">{store.rating.toFixed(1)} rating</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                    <Icon name="whatsapp" className="w-5 h-5 mr-2" />
                    {t('chat_on_whatsapp')}
                </Button>
            </a>
            <a href={`tel:${store.phoneNumber}`} className="w-full">
                <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                    <Icon name="phone" className="w-5 h-5 mr-2" />
                    {t('call_owner')}
                </Button>
            </a>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('store_products')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {store.products.map((product: Product) => (
                <div key={product.id} className="border rounded-lg p-3 text-center transition-shadow hover:shadow-md">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-28 object-cover rounded-md mb-2"/>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-[#3b5978] font-semibold mt-1">₹{product.price}</p>
                </div>
              ))}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default StorePage;