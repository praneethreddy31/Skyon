// src/components/EditHospitalModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { updateDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { MedicalService } from '../types';

interface EditHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service: MedicalService;
}

const EditHospitalModal: React.FC<EditHospitalModalProps> = ({ isOpen, onClose, onSuccess, service }) => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Pre-fill form when the service data is available
  useEffect(() => {
    if (service && formRef.current) {
        (formRef.current.elements.namedItem('name') as HTMLInputElement).value = service.name;
        (formRef.current.elements.namedItem('type') as HTMLSelectElement).value = service.type;
        (formRef.current.elements.namedItem('address') as HTMLInputElement).value = service.address;
        (formRef.current.elements.namedItem('phone') as HTMLInputElement).value = service.phone;
        (formRef.current.elements.namedItem('timings') as HTMLInputElement).value = service.timings;
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const updatedData = {
        name: formData.get('name') as string,
        type: formData.get('type') as 'Hospital' | 'Clinic',
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        timings: formData.get('timings') as string,
      };

      await updateDocument('medicalServices', service.id, updatedData);
      alert('Service updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating medical service:", error);
      alert('Failed to update service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${service.name}`}>
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
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </Modal>
  );
};

export default EditHospitalModal;