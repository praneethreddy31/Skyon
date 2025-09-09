import React, { useMemo } from 'react';
// Fix: Use the useLocalization hook instead of importing LocalizationContext from App.
import { useLocalization } from '../contexts/LocalizationContext';
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';
import { mockListings, mockStores, mockDailyDishes } from '../data/mockData';
import Card from '../components/Card';

const Home: React.FC = () => {
  // Fix: Use the useLocalization hook.
  const { t } = useLocalization();

  const featuredListing = useMemo(() => mockListings[0], []);
  const featuredStore = useMemo(() => mockStores[0], []);
  const latestDishes = useMemo(() => mockDailyDishes.slice(0, 1), []);

  const otherServices = [
    { name: t('nav_events'), path: '/events', icon: 'events' },
    { name: t('nav_medical'), path: '/medical', icon: 'medical' },
    { name: t('nav_parking'), path: '/parking-watch', icon: 'parking' },
    { name: t('nav_services'), path: '/vendors', icon: 'services' },
    { name: t('nav_transport'), path: '/transport', icon: 'car' },
    { name: t('lost_found'), path: '/lost-and-found', icon: 'lost-found' },
  ];

  return (
    <div className="space-y-8">
      
      <div className="text-left">
        <h1 className="text-4xl font-bold text-[#3b5978]">{t('home_welcome')}</h1>
        <p className="text-gray-500 mt-1 text-lg">Your community dashboard.</p>
      </div>

      {/* Top section: Marketplace and Bazaar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketplace Card */}
        <Link to="/marketplace" className="block group">
            <Card className="h-full p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-[#3b5978]">{t('nav_market')}</h2>
                      <Icon name="store" className="w-10 h-10 text-amber-400" />
                    </div>
                    <p className="text-gray-600 mt-2">Buy, sell, and rent items with your neighbors.</p>
                </div>
                {featuredListing && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase">Featured Item</p>
                    <div className="flex items-center gap-3 mt-2">
                        <img src={featuredListing.imageUrl} alt={featuredListing.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-gray-800">{featuredListing.title}</p>
                          <p className="text-sm text-[#3b5978] font-bold">{typeof featuredListing.price === 'number' ? `₹${featuredListing.price}` : t('free')}</p>
                        </div>
                    </div>
                  </div>
                )}
            </Card>
        </Link>
        
        {/* Bazaar Card */}
        <Link to="/bazaar" className="block group">
             <Card className="h-full p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-[#3b5978]">{t('nav_bazaar')}</h2>
                      <Icon name="bazaar" className="w-10 h-10 text-rose-500" />
                    </div>
                     <p className="text-gray-600 mt-2">Discover stores from your neighbors.</p>
                </div>
                {featuredStore && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase">Featured Store</p>
                      <div className="flex items-center gap-3 mt-2">
                        <img src={featuredStore.coverImageUrl} alt={featuredStore.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-gray-800 mt-1">{featuredStore.name}</p>
                          <p className="text-sm text-gray-500">{featuredStore.category}</p>
                        </div>
                      </div>
                    </div>
                )}
            </Card>
        </Link>
      </div>

      {/* Today's Dishes Section */}
      <Link to="/todays-dishes" className="block group">
        <Card className="transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#3b5978]">{t('todays_dishes_title')}</h2>
                <p className="text-gray-600 mt-1">{t('todays_dishes_subtitle')}</p>
              </div>
              <Icon name="food" className="w-10 h-10 text-green-500" />
            </div>
            {latestDishes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{t('latest_dishes')}</p>
                {latestDishes.map(dish => (
                  <div key={dish.id} className="flex items-center gap-4">
                    <img src={dish.imageUrl} alt={dish.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-lg text-gray-800">{dish.name}</p>
                      {/* Fix: Access seller name via `dish.seller.name` instead of `dish.sellerName`. */}
                      <p className="text-sm text-gray-500">by {dish.seller.name}</p>
                      <p className="text-md text-[#3b5978] font-bold">₹{dish.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
             <div className="text-right mt-2 text-sm font-semibold text-[#3b5978] group-hover:underline">
              View all dishes &rarr;
            </div>
          </div>
        </Card>
      </Link>
      
      {/* Bottom section: Other services */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">More Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherServices.map(link => (
            <Link to={link.path} key={link.name} className="block group">
                <Card className="p-3 flex flex-col items-center justify-center text-center space-y-1 h-28 transition-shadow hover:shadow-lg border border-transparent hover:border-gray-200">
                    <Icon name={link.icon} className="w-8 h-8 text-[#3b5978]" />
                    <h2 className="text-sm font-semibold text-gray-700 group-hover:text-[#3b5978]">{link.name}</h2>
                </Card>
            </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
