// src/components/AddHospitalModal.tsx

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { MedicalService, UserInfo } from '../types';

interface AddHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddHospitalModal: React.FC<AddHospitalModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !formRef.current) return;
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const serviceData = {
        name: formData.get('name') as string,
        type: formData.get('type') as 'Hospital' | 'Clinic',
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        timings: formData.get('timings') as string,
      };

      await addDocument('medicalServices', serviceData, currentUser as UserInfo);
      alert('Medical service added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding medical service:", error);
      alert('Failed to add medical service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Hospital or Clinic">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input name="name" type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label>Type</label>
          <select name="type" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="Hospital">Hospital</option>
            <option value="Clinic">Clinic</option>
          </select>
        </div>
        <div>
          <label>Address</label>
          <input name="address" type="text" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label>Phone Number</label>
          <input name="phone" type="tel" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label>Timings</label>
          <input name="timings" type="text" required placeholder="e.g., 9 AM - 8 PM" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Adding...' : 'Add Service'}</Button>
      </form>
    </Modal>
  );
};

export default AddHospitalModal;