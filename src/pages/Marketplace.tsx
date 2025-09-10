// src/pages/Marketplace.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing, ListingCondition, ListingType, UserInfo } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Icon from '../components/Icon';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../services/geminiService';
import { getCollection, addDocument, deleteDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';

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

const ListingDetailModal: React.FC<{ listing: Listing | null; onClose: () => void; onListingDeleted: () => void; }> = ({ listing, onClose, onListingDeleted }) => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  
  if (!listing) return null;

  const isOwner = currentUser?.uid === listing.seller.uid;

  const handleDelete = async () => {
    if (!isOwner) return;
    if (window.confirm("Are you sure you want to delete this listing?")) {
        try {
            await deleteDocument('listings', listing.id);
            alert("Listing deleted.");
            onListingDeleted();
            onClose();
        } catch (error) {
            console.error("Error deleting listing:", error);
            alert("Failed to delete listing.");
        }
    }
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <a href={`https://wa.me/${listing.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                    <Icon name="whatsapp" className="w-4 h-4 mr-2" /> {t('chat_on_whatsapp')}
                </Button>
            </a>
            <a href={`tel:${listing.phoneNumber}`}>
                <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                    <Icon name="phone" className="w-4 h-4 mr-2" /> {t('call_owner')}
                </Button>
            </a>
        </div>

        {isOwner && (
            <div className="mt-4 border-t pt-4">
                <Button onClick={handleDelete} variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                    Delete Listing
                </Button>
            </div>
        )}
      </div>
    </Modal>
  );
};

const PostItemModal: React.FC<{ isOpen: boolean; onClose: () => void; onPost: () => void; }> = ({ isOpen, onClose, onPost }) => {
    const { t } = useLocalization();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [categorySuggestion, setCategorySuggestion] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

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
        if (!currentUser || !currentUser.block || !imageFile) {
            alert("Please fill all fields and upload an image.");
            return;
        }
        if (!formRef.current) return;
        
        setLoading(true);
        try {
            const imageUrl = await imageUploadService.uploadImage(imageFile);
            if (!imageUrl) throw new Error("Image upload failed");

            const formData = new FormData(formRef.current);
            const data = {
                type: formData.get('type') as ListingType,
                title: formData.get('title') as string,
                category: formData.get('category') as string,
                description: formData.get('description') as string,
                price: Number(formData.get('price')) || 'Free',
                condition: formData.get('condition') as ListingCondition,
                imageUrl: imageUrl,
                whatsappNumber: formData.get('whatsappNumber') as string,
                phoneNumber: formData.get('phoneNumber') as string,
            };

            const userInfo: UserInfo = {
                uid: currentUser.uid,
                name: currentUser.displayName || 'Unknown',
                block: currentUser.block,
                flatNumber: currentUser.flatNumber || '000',
            };

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
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('listing_type')}</label>
                     <select name="type" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="For Sale">{t('filter_for_sale')}</option>
                        <option value="For Rent">{t('filter_for_rent')}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_title')}</label>
                    <input name="title" type="text" value={title} onChange={handleTitleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_category')}</label>
                    <input name="category" type="text" placeholder={isSuggesting ? 'Thinking...' : ''} defaultValue={categorySuggestion || ''} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                    {categorySuggestion && <p className="text-sm text-[#3b5978] mt-1">{t('form_ai_suggestion')} {categorySuggestion}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_description')}</label>
                    <textarea name="description" rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_price')}</label>
                    <input name="price" type="number" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">{t('form_condition')}</label>
                    <select name="condition" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        {(['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] as ListingCondition[]).map(c => <option key={c}>{c}</option>)}
                    </select>
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
        setListings(data);
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

      <ListingDetailModal 
        listing={selectedListing} 
        onClose={() => setSelectedListing(null)} 
        onListingDeleted={fetchListings}
      />
      <PostItemModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onPost={fetchListings} 
      />
    </div>
  );
};

export default Marketplace;