import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import Card from '../components/Card';
import Button from '../components/Button';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { t } = useLocalization();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [block, setBlock] = useState('A');
  const [flatNumber, setFlatNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // Pre-fill form with user data if it exists
    setName(currentUser.displayName || '');
    setBlock(currentUser.block || 'A');
    setFlatNumber(currentUser.flatNumber || '');
  }, [currentUser, navigate]);

  const isProfileComplete = currentUser?.block && currentUser?.flatNumber;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) {
        setError('You are not logged in.');
        return;
    }

    if (!/^\d{3,4}$/.test(flatNumber)) {
        setError('Flat number must be 3 or 4 digits.');
        return;
    }
    
    setLoading(true);
    try {
      const profileData = {
        displayName: name,
        block: block as User['block'],
        flatNumber: flatNumber,
      };

      if (isProfileComplete) {
        // Update existing profile
        await authService.updateUserProfile(currentUser.uid, profileData);
      } else {
        // Create new profile
        await authService.createUserProfile(currentUser, profileData);
      }
      
      setSuccess(t('profile_saved_success'));
      setTimeout(() => {
        if (!isProfileComplete) navigate('/', { replace: true });
      }, 1000);

    } catch (err) {
      console.error(err);
      setError('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  }

  return (
    <div className="flex justify-center items-center pt-8">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            {isProfileComplete ? t('profile_title') : t('profile_setup_title')}
        </h1>
        {!isProfileComplete && <p className="text-center text-gray-500 mb-6">{t('profile_setup_subtitle')}</p>}

        <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('profile_name')}</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]" 
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">{t('profile_block')}</label>
              <select 
                value={block}
                onChange={e => setBlock(e.target.value as 'A' | 'B' | 'C' | 'D' | 'E' | 'F')}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]"
              >
                {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('profile_flat_number')}</label>
              <input 
                type="text"
                pattern="\d{3,4}"
                title="Flat number must be 3 or 4 digits"
                value={flatNumber}
                onChange={e => setFlatNumber(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3b5978] focus:border-[#3b5978]" 
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : t('profile_save')}
            </Button>
        </form>
        {isProfileComplete && <Button variant="outline" onClick={handleLogout} className="w-full mt-4">{t('auth_logout')}</Button>}
      </Card>
    </div>
  );
};

export default ProfilePage;
