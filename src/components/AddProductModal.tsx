// src/components/AddProductModal.tsx

import React, { useState, useRef } from 'react'; // Import useRef
import { useLocalization } from '../contexts/LocalizationContext';
import { updateDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';
import Modal from './Modal';
import Button from './Button';
import { Store, Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  store: Store;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded, store }) => {
  const { t } = useLocalization();
  const [loading, setLoading] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null); // Create a ref for the form

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productImage) {
      alert("Please upload a product image.");
      return;
    }
    if (!formRef.current) return; // Guard clause for the ref
    
    setLoading(true);

    try {
      const imageUrl = await imageUploadService.uploadImage(productImage);
      if (!imageUrl) throw new Error("Image upload failed");

      const formData = new FormData(formRef.current); // Use the ref to get form data
      const newProduct: Product = {
        id: new Date().getTime(), // Simple unique ID
        name: formData.get('productName') as string,
        price: Number(formData.get('price')),
        description: formData.get('description') as string,
        imageUrl: imageUrl,
      };

      const existingProducts = store.products || [];
      const updatedProducts = [...existingProducts, newProduct];

      await updateDocument('stores', store.id, { products: updatedProducts });

      alert("Product added!");
      onProductAdded();
      onClose();

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a New Product">
      {/* Attach the ref to the form element */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="productName" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input type="number" name="price" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={3} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input 
            type="file" 
            required 
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setProductImage(e.target.files[0]);
            }}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</Button>
      </form>
    </Modal>
  );
};

export default AddProductModal;