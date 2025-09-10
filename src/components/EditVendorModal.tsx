import React, { useState, useRef, useEffect } from 'react';
import { updateDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { Vendor } from '../types';

interface EditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendor: Vendor;
}

const EditVendorModal: React.FC<EditVendorModalProps> = ({ isOpen, onClose, onSuccess, vendor }) => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (vendor && formRef.current) {
        (formRef.current.elements.namedItem('name') as HTMLInputElement).value = vendor.name;
        (formRef.current.elements.namedItem('service') as HTMLInputElement).value = vendor.service;
        (formRef.current.elements.namedItem('description') as HTMLTextAreaElement).value = vendor.description;
        (formRef.current.elements.namedItem('whatsappNumber') as HTMLInputElement).value = vendor.whatsappNumber;
        (formRef.current.elements.namedItem('phoneNumber') as HTMLInputElement).value = vendor.phoneNumber;
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const updatedData = {
        name: formData.get('name') as string,
        service: formData.get('service') as string,
        description: formData.get('description') as string,
        whatsappNumber: formData.get('whatsappNumber') as string,
        phoneNumber: formData.get('phoneNumber') as string,
      };

      await updateDocument('vendors', vendor.id, updatedData);
      alert('Vendor updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert('Failed to update vendor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${vendor.name}`}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Vendor Name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="service" type="text" placeholder="Service" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <textarea name="description" rows={3} placeholder="Description" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
        <input name="whatsappNumber" type="tel" placeholder="WhatsApp Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="phoneNumber" type="tel" placeholder="Phone Number for Calls" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </Modal>
  );
};

export default EditVendorModal;
