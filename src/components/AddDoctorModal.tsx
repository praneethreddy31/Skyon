// src/components/AddDoctorModal.tsx

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import { imageUploadService } from '../services/imageUploadService';
import Modal from './Modal';
import Button from './Button';
import { UserInfo } from '../types';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
      const doctorData = {
        name: formData.get('name') as string,
        specialty: formData.get('specialty') as string,
        location: formData.get('location') as string,
        availability: formData.get('availability') as string,
        isResident: (formData.get('isResident') === 'true'),
        imageUrl: imageUrl,
        phoneNumber: formData.get('phoneNumber') as string,
        whatsappNumber: formData.get('whatsappNumber') as string,
      };

      await addDocument('doctors', doctorData, currentUser as UserInfo);
      alert('Doctor added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert('Failed to add doctor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a Doctor">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder="Name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="specialty" type="text" placeholder="Specialty" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="location" type="text" placeholder="Location (Clinic/Flat No)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="availability" type="text" placeholder="Availability (e.g., Mon-Fri, 10 AM - 1 PM)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="phoneNumber" type="tel" placeholder="Phone Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="whatsappNumber" type="tel" placeholder="WhatsApp Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <div>
          <label>Is a Resident?</label>
          <select name="isResident" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div>
          <label>Doctor's Photo</label>
          <input 
            type="file" 
            required
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) setImageFile(e.target.files[0]);
            }}
            className="mt-1 block w-full text-sm..."
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Adding...' : 'Add Doctor'}</Button>
      </form>
    </Modal>
  );
};

export default AddDoctorModal;