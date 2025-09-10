import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';
import Modal from './Modal';
import Button from './Button';
import { UserInfo } from '../types';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !formRef.current || !imageFile) {
        alert("Please fill all fields and upload a photo.");
        return;
    }
    setLoading(true);

    try {
        const imageUrl = await imageUploadService.uploadImage(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");
        
        const formData = new FormData(formRef.current);
        const vendorData = {
            name: formData.get('name') as string,
            service: formData.get('service') as string,
            description: formData.get('description') as string,
            imageUrl: imageUrl,
            rating: 5,
            reviews: [],
            phoneNumber: formData.get('phoneNumber') as string,
            whatsappNumber: formData.get('whatsappNumber') as string,
        };

        await addDocument('vendors', vendorData, currentUser as UserInfo);
        alert('Vendor added successfully!');
        onSuccess();
        onClose();
    } catch (error) {
        console.error("Error adding vendor:", error);
        alert('Failed to add vendor.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a New Vendor">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Vendor Name (e.g., Ramesh Kumar)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="service" type="text" placeholder="Service (e.g., Electrician)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <textarea name="description" rows={3} placeholder="Description of services..." required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
        <input name="whatsappNumber" type="tel" placeholder="WhatsApp Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="phoneNumber" type="tel" placeholder="Phone Number for Calls" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <div>
          <label>Vendor Photo/Logo</label>
          <input 
            type="file" 
            required
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImageFile(e.target.files[0]);
            }}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-[#3b5978] hover:file:bg-sky-100"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Adding...' : 'Add Vendor'}</Button>
      </form>
    </Modal>
  );
};

export default AddVendorModal;
