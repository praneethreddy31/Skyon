
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Vendor, Review, UserInfo } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { getCollection, deleteDocument, addDocument, updateDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';

// --- Re-usable Components ---
const StarRating: React.FC<{ rating: number; }> = ({ rating }) => {
  return (
    <div className="flex items-center">
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

// --- Add/Edit Modal (Combined) ---
const VendorFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vendor?: Vendor | null;
}> = ({ isOpen, onClose, onSuccess, vendor }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const isEditMode = !!vendor;

    useEffect(() => {
        if (formRef.current) {
            if (isEditMode && vendor) {
                (formRef.current.elements.namedItem('name') as HTMLInputElement).value = vendor.name;
                (formRef.current.elements.namedItem('service') as HTMLInputElement).value = vendor.service;
                (formRef.current.elements.namedItem('description') as HTMLTextAreaElement).value = vendor.description;
                (formRef.current.elements.namedItem('whatsappNumber') as HTMLInputElement).value = vendor.whatsappNumber;
                (formRef.current.elements.namedItem('phoneNumber') as HTMLInputElement).value = vendor.phoneNumber;
            } else {
                formRef.current.reset();
                setImageFile(null);
            }
        }
    }, [vendor, isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser || !formRef.current) return;
        if (!isEditMode && !imageFile) {
            alert("Please upload a photo for the new vendor.");
            return;
        }
        setLoading(true);

        try {
            let imageUrl = vendor?.imageUrl;
            if (imageFile) {
                const uploadedUrl = await imageUploadService.uploadImage(imageFile);
                if (!uploadedUrl) throw new Error("Image upload failed");
                imageUrl = uploadedUrl;
            }

            const formData = new FormData(formRef.current);
            const vendorData = {
                name: formData.get('name') as string,
                service: formData.get('service') as string,
                description: formData.get('description') as string,
                whatsappNumber: formData.get('whatsappNumber') as string,
                phoneNumber: formData.get('phoneNumber') as string,
                imageUrl: imageUrl,
                rating: vendor?.rating || 5,
                reviews: vendor?.reviews || [],
            };

            if (isEditMode && vendor) {
                await updateDocument('vendors', vendor.id, vendorData);
                alert('Vendor updated successfully!');
            } else {
                await addDocument('vendors', vendorData, currentUser as UserInfo);
                alert('Vendor added successfully!');
            }
            
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving vendor:", error);
            alert('Failed to save vendor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? `Edit ${vendor?.name}` : "Add a New Vendor"}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <input name="name" type="text" placeholder="Vendor Name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <input name="service" type="text" placeholder="Service" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <textarea name="description" rows={3} placeholder="Description" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
                <input name="whatsappNumber" type="tel" placeholder="WhatsApp Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <input name="phoneNumber" type="tel" placeholder="Phone Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor Photo {isEditMode && "(Optional: to change)"}</label>
                    <input
                        type="file"
                        required={!isEditMode}
                        accept="image/*"
                        onChange={(e) => { if (e.target.files) setImageFile(e.target.files[0]); }}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Vendor')}</Button>
            </form>
        </Modal>
    );
};

// --- Main Page Component ---
const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useLocalization();
  const { currentUser } = useAuth();

  const ADMIN_EMAIL = 'praneethreddykarrem123@gmail.com';

  const fetchData = async () => {
    try {
        const data = await getCollection<Vendor>('vendors');
        setVendors(data);
    } catch (error) {
        console.error("Error fetching vendors:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
    } else {
        setIsAdmin(false);
    }
  }, [currentUser]);

  const handleDelete = async (vendorId: string) => {
    if(!isAdmin) return;
    if(window.confirm("Are you sure you want to delete this vendor?")) {
        try {
            await deleteDocument('vendors', vendorId);
            fetchData();
        } catch (error) {
            alert("Failed to delete vendor.");
        }
    }
  }
  
  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;
    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vendors, searchTerm]);

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{t('services_title')}</h1>
            {isAdmin && <Button onClick={() => setIsAddModalOpen(true)}>Add New Vendor</Button>}
        </div>
      
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

      {loading ? <p className="text-center py-10">Loading vendors...</p> : 
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id}>
              <div className="flex items-center p-4">
                <img src={vendor.imageUrl} alt={vendor.name} className="w-20 h-20 rounded-full object-cover mr-4 cursor-pointer" onClick={() => setSelectedVendor(vendor)}/>
                <div className="flex-grow cursor-pointer" onClick={() => setSelectedVendor(vendor)}>
                  <h3 className="font-semibold text-lg text-gray-800">{vendor.name}</h3>
                  <p className="text-[#3b5978] font-medium">{vendor.service}</p>
                  <div className="flex items-center mt-1">
                    <StarRating rating={vendor.rating} />
                    <span className="text-sm text-gray-500 ml-2">{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex flex-col gap-2 pl-2 border-l ml-2">
                      <Button size="sm" onClick={() => setEditingVendor(vendor)}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(vendor.id)} className="border-red-500 text-red-500 hover:bg-red-50">Delete</Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      }

      {selectedVendor && (
          <Modal isOpen={!!selectedVendor} onClose={() => setSelectedVendor(null)} title={selectedVendor.name}>
            <div>
              <div className="flex flex-col items-center mb-4 text-center">
                <img src={selectedVendor.imageUrl} alt={selectedVendor.name} className="w-24 h-24 rounded-full object-cover mb-2" />
                <h3 className="text-xl font-bold text-gray-800">{selectedVendor.service}</h3>
                <StarRating rating={selectedVendor.rating} />
              </div>
              <p className="text-gray-600 mb-6 text-center">{selectedVendor.description}</p>

              <div className="flex gap-2 mt-4 mb-6">
                  <a href={`https://wa.me/${selectedVendor.whatsappNumber}`} className="flex-1">
                      <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                          <Icon name="whatsapp" className="w-4 h-4 mr-2" /> WhatsApp
                      </Button>
                  </a>
                  <a href={`tel:${selectedVendor.phoneNumber}`} className="flex-1">
                      <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                          <Icon name="phone" className="w-4 h-4 mr-2" /> Call
                      </Button>
                  </a>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{t('vendor_reviews')} ({selectedVendor.reviews?.length || 0})</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {selectedVendor.reviews && selectedVendor.reviews.length > 0 ? selectedVendor.reviews.map((review: Review) => (
                    <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">{review.author}</span>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                    </div>
                  )) : <p className="text-sm text-gray-500">No reviews yet.</p>}
                </div>
              </div>
            </div>
          </Modal>
      )}

      {isAdmin && (
        <>
            <VendorFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={fetchData} />
            {editingVendor && (
                <VendorFormModal 
                    isOpen={!!editingVendor} 
                    onClose={() => setEditingVendor(null)} 
                    onSuccess={fetchData} 
                    vendor={editingVendor} 
                />
            )}
        </>
      )}
    </div>
  );
};

export default Vendors;