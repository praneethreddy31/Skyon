// src/pages/StorePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Card from '../components/Card';
import AddProductModal from '../components/AddProductModal'; // <-- Import new modal
import { Product, Store } from '../types';
import { getDocumentById, deleteDocument, updateDocument } from '../services/databaseService';

const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className }) => {
  // ... (StarRating component remains the same)
};

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const fetchStore = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
        const data = await getDocumentById<Store>('stores', storeId);
        setStore(data);
    } catch (error) {
        console.error("Error fetching store data:", error);
        setStore(null);
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStore();
  }, [storeId]);

  useEffect(() => {
    // Check for ownership when user or store data is available
    if (currentUser && store) {
      setIsOwner(currentUser.uid === store.owner.uid);
    } else {
      setIsOwner(false);
    }
  }, [currentUser, store]);

  const handleDeleteStore = async () => {
    if (!storeId || !isOwner) return;
    if (window.confirm("Are you sure you want to delete this entire store? This cannot be undone.")) {
      try {
        await deleteDocument('stores', storeId);
        alert("Store deleted successfully.");
        navigate('/bazaar');
      } catch (error) {
        console.error("Error deleting store:", error);
        alert("Failed to delete store.");
      }
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!store || !isOwner) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const updatedProducts = store.products.filter(p => p.id !== productId);
        await updateDocument('stores', store.id, { products: updatedProducts });
        fetchStore(); // Refresh the store data
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  if (loading) {
      return <div className="text-center py-10">Loading store...</div>;
  }

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
      {/* ... Back to Bazaar Link */}
      <Card>
        <img src={store.coverImageUrl} alt={store.name} className="w-full h-48 object-cover" />
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{store.name}</h1>
              <p className="text-gray-600 mt-1">By {`${store.owner.name} (${store.owner.block}-${store.owner.flatNumber})`}</p>
            </div>
            {isOwner && (
              <Button onClick={handleDeleteStore} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                Delete Store
              </Button>
            )}
          </div>
          {/* ... StarRating and Contact Buttons ... */}

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{t('store_products')}</h2>
              {isOwner && (
                <Button onClick={() => setIsProductModalOpen(true)}>Add Product</Button>
              )}
            </div>
            {store.products && store.products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {store.products.map((product: Product) => (
                    <div key={product.id} className="border rounded-lg p-3 text-center transition-shadow hover:shadow-md relative group">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-28 object-cover rounded-md mb-2"/>
                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <p className="text-sm text-[#3b5978] font-semibold mt-1">₹{product.price}</p>
                        {isOwner && (
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-1 bg-red-500 text-white rounded-full">
                              <Icon name="close" className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">
                  {isOwner ? "You haven't added any products yet. Click 'Add Product' to get started!" : "The store owner hasn't added any products yet."}
                </p>
            )}
        </div>
      </Card>
      {isProductModalOpen && <AddProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onProductAdded={fetchStore} store={store} />}
    </div>
  );
};

export default StorePage;