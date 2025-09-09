import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockListings } from '../data/mockData';
import { Listing, ListingCondition, ListingType } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Icon from '../components/Icon';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/geminiService';

const ListingCard: React.FC<{ listing: Listing, onClick: () => void }> = ({ listing, onClick }) => {
  const { t } = useLocalization();
  return (
    <Card onClick={onClick} className="relative">
      <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{listing.title}</h3>
        <p className="text-[#3b5978] font-bold text-xl my-2">
          {typeof listing.price === 'number' ? `₹${listing.price}` : t('free')}
          {listing.type === 'For Rent' && <span className="text-sm font-normal text-gray-500"> /day</span>}
        </p>
        <div className="text-sm text-gray-500 flex justify-between">
          <span>{listing.seller.name}</span>
          <span>{`${listing.seller.block}-${listing.seller.flatNumber}`}</span>
        </div>
      </div>
       <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full text-white ${
          listing.type === 'For Rent' ? 'bg-blue-500' : 'bg-green-500'
        }`}>
        {listing.type === 'For Rent' ? t('filter_for_rent') : t('filter_for_sale')}
      </span>
    </Card>
  );
};

const ListingDetailModal: React.FC<{ listing: Listing | null; onClose: () => void }> = ({ listing, onClose }) => {
  const { t } = useLocalization();
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listing) {
      setLoading(true);
      geminiService.findSimilarListings(listing)
        .then(setSimilar)
        .finally(() => setLoading(false));
    }
  }, [listing]);

  if (!listing) return null;

  return (
    <Modal isOpen={!!listing} onClose={onClose} title={listing.title}>
      <div>
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-64 object-cover rounded-lg mb-4" />
        <p className="text-gray-600 mb-4">{listing.description}</p>
        <div className="space-y-2 mb-6">
          <p><strong className="text-gray-800">{t('listing_price')}:</strong> <span className="text-[#3b5978] font-bold">{typeof listing.price === 'number' ? `₹${listing.price}` : t('free')}{listing.type === 'For Rent' && <span className="text-sm font-normal text-gray-500"> /day</span>}</span></p>
          <p><strong className="text-gray-800">{t('listing_type')}:</strong> {listing.type === 'For Rent' ? t('filter_for_rent') : t('filter_for_sale')}</p>
          <p><strong className="text-gray-800">{t('listing_condition')}:</strong> {listing.condition}</p>
          <p><strong className="text-gray-800">Category:</strong> {listing.category}</p>
          <p><strong className="text-gray-800">Seller:</strong> {`${listing.seller.name} (${listing.seller.block}-${listing.seller.flatNumber})`}</p>
        </div>
        <div className="flex gap-4">
            <Button className="w-full">{t('listing_contact_seller')}</Button>
            <Button variant="outline" className="w-full">{t('listing_make_offer')}</Button>
        </div>

        {loading && <p className="mt-6 text-center">Loading similar items...</p>}
        {similar.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">{t('listing_similar')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {similar.map(item => (
                <div key={item.id} className="border rounded-lg p-2">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-20 object-cover rounded-md mb-2"/>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-[#3b5978] font-semibold">{typeof item.price === 'number' ? `₹${item.price}` : 'Free'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const PostItemModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { t } = useLocalization();
    const [title, setTitle] = useState('');
    const [categorySuggestion, setCategorySuggestion] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (newTitle.length > 5) {
            setIsSuggesting(true);
            const suggestion = await geminiService.suggestCategory(newTitle);
            setCategorySuggestion(suggestion);
            setIsSuggesting(false);
        } else {
            setCategorySuggestion(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('market_post_item')}>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('listing_type')}</label>
                     <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]">
                        <option value="For Sale">{t('filter_for_sale')}</option>
                        <option value="For Rent">{t('filter_for_rent')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_title')}</label>
                    <input type="text" value={title} onChange={handleTitleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_category')}</label>
                    <input type="text" placeholder={isSuggesting ? 'Thinking...' : ''} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                    {categorySuggestion && <p className="text-sm text-[#3b5978] mt-1">{t('form_ai_suggestion')} {categorySuggestion}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_description')}</label>
                    <textarea rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_price')}</label>
                    <input type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_condition')}</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]">
                        {(['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] as ListingCondition[]).map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_add_photo')}</label>
                    <input type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#3b5978] hover:file:bg-sky-100"/>
                </div>
                <Button type="submit" className="w-full">{t('form_post_listing')}</Button>
            </form>
        </Modal>
    );
};


const Marketplace: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ListingType | 'All'>('All');
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handlePostItemClick = () => {
    if (currentUser) {
      setIsPostModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
        if (typeFilter === 'All') return true;
        return listing.type === typeFilter;
    });
  }, [listings, typeFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{t('market_title')}</h1>
        <Button onClick={handlePostItemClick} leftIcon={<Icon name="add" className="w-5 h-5"/>}>
          {t('market_post_item')}
        </Button>
      </div>

       <div className="mb-6 bg-white p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
            <span className="font-semibold text-sm">{t('filter_by')}:</span>
            <div className="flex gap-2">
                {(['All', 'For Sale', 'For Rent'] as const).map(type => (
                    <button 
                        key={type}
                        onClick={() => setTypeFilter(type)}
                        className={`px-3 py-1 text-sm rounded-full ${typeFilter === type ? 'bg-[#3b5978] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {type === 'All' ? t('filter_all') : type === 'For Sale' ? t('filter_for_sale') : t('filter_for_rent')}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onClick={() => setSelectedListing(listing)} />
        ))}
      </div>
      <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
      <PostItemModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
    </div>
  );
};

export default Marketplace;