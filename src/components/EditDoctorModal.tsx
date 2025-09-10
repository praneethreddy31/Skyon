// src/components/EditDoctorModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import { updateDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { Doctor } from '../types';

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctor: Doctor;
}

const EditDoctorModal: React.FC<EditDoctorModalProps> = ({ isOpen, onClose, onSuccess, doctor }) => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
      if(doctor && formRef.current) {
          (formRef.current.elements.namedItem('name') as HTMLInputElement).value = doctor.name;
          (formRef.current.elements.namedItem('specialty') as HTMLInputElement).value = doctor.specialty;
          (formRef.current.elements.namedItem('location') as HTMLInputElement).value = doctor.location;
          (formRef.current.elements.namedItem('availability') as HTMLInputElement).value = doctor.availability;
          (formRef.current.elements.namedItem('phoneNumber') as HTMLInputElement).value = doctor.phoneNumber;
          (formRef.current.elements.namedItem('whatsappNumber') as HTMLInputElement).value = doctor.whatsappNumber;
          (formRef.current.elements.namedItem('isResident') as HTMLSelectElement).value = String(doctor.isResident);
      }
  }, [doctor]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const updatedData = {
        name: formData.get('name') as string,
        specialty: formData.get('specialty') as string,
        location: formData.get('location') as string,
        availability: formData.get('availability') as string,
        phoneNumber: formData.get('phoneNumber') as string,
        whatsappNumber: formData.get('whatsappNumber') as string,
        isResident: (formData.get('isResident') === 'true'),
      };

      await updateDocument('doctors', doctor.id, updatedData);
      alert('Doctor updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert('Failed to update doctor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${doctor.name}`}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* ... All the same form fields as the Add modal, just for editing ... */}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </Modal>
  );
};

export default EditDoctorModal;