import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import Card from '../components/Card';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const { t } = useLocalization();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (!currentUser.block || !currentUser.flatNumber) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  const handleLogin = async () => {
    try {
      const user = await authService.signInWithGoogle();
      if (!user.block || !user.flatNumber) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to log in", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-full pt-16">
      <Card className="w-full max-w-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">{t('app_title')}</h1>
        <p className="text-gray-600 my-4">{t('auth_please_login')}</p>
        <Button onClick={handleLogin} className="w-full">
          {t('auth_login_with_google')}
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
