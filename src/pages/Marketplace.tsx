
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, ListingCondition, ListingType, UserInfo } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Icon from '../components/Icon';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/geminiService';
import { getCollection, addDocument } from '../services/databaseService';

const ListingCard: React.FC<{ listing: Listing, onClick: () => void }> = ({ listing, onClick }) => {
  const { t } = useLocalization();
  return (
    <Card onClick={onClick} className="relative">
      <img src={listing.imageUrl || 'https://picsum.photos/400/300'} alt={listing.title} className="w-full h-48 object-cover" />
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

const PostItemModal: React.FC<{ isOpen: boolean; onClose: () => void; onPost: () => void; }> = ({ isOpen, onClose, onPost }) => {
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [categorySuggestion, setCategorySuggestion] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [loading, setLoading] = useState(false);

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
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser || !currentUser.block) return;
        
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            type: formData.get('type') as ListingType,
            title: formData.get('title') as string,
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')) || 'Free',
            condition: formData.get('condition') as ListingCondition,
            imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/400/300', // Placeholder
        };

        const userInfo: UserInfo = {
            name: currentUser.displayName || 'Unknown',
            block: currentUser.block,
            flatNumber: currentUser.flatNumber || '000',
        };

        try {
            await addDocument('listings', data, userInfo);
            onPost();
            onClose();
        } catch (error) {
            console.error("Error posting item:", error);
            alert("Failed to post item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('market_post_item')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('listing_type')}</label>
                     <select name="type" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]">
                        <option value="For Sale">{t('filter_for_sale')}</option>
                        <option value="For Rent">{t('filter_for_rent')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_title')}</label>
                    <input name="title" type="text" value={title} onChange={handleTitleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_category')}</label>
                    <input name="category" type="text" placeholder={isSuggesting ? 'Thinking...' : ''} defaultValue={categorySuggestion || ''} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                    {categorySuggestion && <p className="text-sm text-[#3b5978] mt-1">{t('form_ai_suggestion')} {categorySuggestion}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_description')}</label>
                    <textarea name="description" rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_price')}</label>
                    <input name="price" type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_condition')}</label>
                    <select name="condition" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]">
                        {(['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] as ListingCondition[]).map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Posting...' : t('form_post_listing')}</Button>
            </form>
        </Modal>
    );
};


const Marketplace: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ListingType | 'All'>('All');
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchListings = async () => {
    setLoading(true);
    try {
        const data = await getCollection<Listing>('listings');
        setListings(data.sort((a, b) => (b as any).createdAt - (a as any).createdAt));
    } catch (error) {
        console.error("Error fetching listings:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

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
        {loading ? <p>Loading listings...</p> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} onClick={() => setSelectedListing(listing)} />
        ))}
      </div>
      }
      {/* Detail Modal would need similar migration to fetch similar listings from DB */}
      <PostItemModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} onPost={fetchListings} />
    </div>
  );
};

export default Marketplace;
