// src/components/PostRideModal.tsx

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { UserInfo } from '../types';

interface PostRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PostRideModal: React.FC<PostRideModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !formRef.current) return;
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const rideData = {
        from: formData.get('from') as string,
        to: formData.get('to') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        seatsAvailable: Number(formData.get('seatsAvailable')),
        whatsappNumber: formData.get('whatsappNumber') as string,
        phoneNumber: formData.get('phoneNumber') as string,
        // --- THIS PART WAS MISSING ---
        driver: {
          uid: currentUser.uid,
          name: currentUser.displayName || 'Unknown',
          block: currentUser.block || 'N/A',
          flatNumber: currentUser.flatNumber || '000',
        }
        // -----------------------------
      };

      await addDocument('carpoolRides', rideData, currentUser as UserInfo);
      alert('Ride posted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error posting ride:", error);
      alert('Failed to post ride.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a Carpool Ride">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input name="from" type="text" placeholder="From (e.g., Society Gate)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="to" type="text" placeholder="To (e.g., Hitech City)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="date" type="text" placeholder="Date (e.g., Daily, Mon-Fri)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="time" type="text" placeholder="Time (e.g., 8:30 AM)" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="seatsAvailable" type="number" placeholder="Seats Available" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="whatsappNumber" type="tel" placeholder="WhatsApp Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="phoneNumber" type="tel" placeholder="Phone Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Posting...' : 'Post Ride'}</Button>
      </form>
    </Modal>
  );
};

export default PostRideModal;
