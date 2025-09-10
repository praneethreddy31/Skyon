// src/components/PostRequestModal.tsx

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addDocument } from '../services/databaseService';
import Modal from './Modal';
import Button from './Button';
import { UserInfo } from '../types';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PostRequestModal: React.FC<PostRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !formRef.current) return;
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const requestData = {
        requestType: formData.get('requestType') as 'Need a Ride' | 'Need a Driver',
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        whatsappNumber: formData.get('whatsappNumber') as string,
        phoneNumber: formData.get('phoneNumber') as string,
        // --- THIS PART WAS MISSING ---
        requester: {
          uid: currentUser.uid,
          name: currentUser.displayName || 'Unknown',
          block: currentUser.block || 'N/A',
          flatNumber: currentUser.flatNumber || '000',
        }
        // -----------------------------
      };

      await addDocument('transportRequests', requestData, currentUser as UserInfo);
      alert('Request posted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error posting request:", error);
      alert('Failed to post request.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a Request">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>I am looking for a...</label>
          <select name="requestType" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option>Need a Ride</option>
            <option>Need a Driver</option>
          </select>
        </div>
        <textarea name="description" rows={3} placeholder="Describe your request..." required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
        <input name="date" type="text" placeholder="Date Needed" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="whatsappNumber" type="tel" placeholder="WhatsApp Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <input name="phoneNumber" type="tel" placeholder="Phone Number" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Posting...' : 'Post Request'}</Button>
      </form>
    </Modal>
  );
};

export default PostRequestModal;
