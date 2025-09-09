import React, { useState, useEffect, useMemo } from 'react';
import { mockVendors } from '../data/mockData';
import { Vendor, Review } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Icon from '../components/Icon';
// Fix: Use the useLocalization hook instead of importing LocalizationContext from App.
import { useLocalization } from '../contexts/LocalizationContext';

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

const VendorCard: React.FC<{ vendor: Vendor; onClick: () => void }> = ({ vendor, onClick }) => (
  <Card onClick={onClick}>
    <div className="flex items-center p-4">
      <img src={vendor.imageUrl} alt={vendor.name} className="w-20 h-20 rounded-full object-cover mr-4" />
      <div className="flex-grow">
        <h3 className="font-semibold text-lg text-gray-800">{vendor.name}</h3>
        <p className="text-[#3b5978] font-medium">{vendor.service}</p>
        <div className="flex items-center mt-1">
          <StarRating rating={vendor.rating} />
          <span className="text-sm text-gray-500 ml-2">{vendor.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  </Card>
);

const VendorDetailModal: React.FC<{ vendor: Vendor | null; onClose: () => void }> = ({ vendor, onClose }) => {
  // Fix: Use the useLocalization hook.
  const { t } = useLocalization();
  if (!vendor) return null;

  return (
    <Modal isOpen={!!vendor} onClose={onClose} title={vendor.name}>
      <div>
        <div className="flex items-center mb-4">
          <img src={vendor.imageUrl} alt={vendor.name} className="w-24 h-24 rounded-full object-cover mr-4" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">{vendor.service}</h3>
            <StarRating rating={vendor.rating} />
          </div>
        </div>
        <p className="text-gray-600 mb-6">{vendor.description}</p>
        <Button className="w-full mb-6">{t('vendor_book_service')}</Button>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">{t('vendor_reviews')} ({vendor.reviews.length})</h4>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {vendor.reviews.map((review: Review) => (
              <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">{review.author}</span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  // Fix: Use the useLocalization hook.
  const { t } = useLocalization();

  useEffect(() => {
    // In a real app, you would fetch this data
    setVendors(mockVendors);
  }, []);
  
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vendors, searchTerm]);


  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('services_title')}</h1>
      
      <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon name="search" className="w-5 h-5 text-gray-400" />
          </span>
          <input
              type="text"
              placeholder={t('services_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b5978]"
          />
      </div>

      <div className="space-y-4">
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} onClick={() => setSelectedVendor(vendor)} />
        ))}
      </div>

      <VendorDetailModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
    </div>
  );
};

export default Vendors;
