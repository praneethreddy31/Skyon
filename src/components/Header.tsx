// src/components/Header.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../types';
import Icon from './Icon';
import logo from '../assets/logo.png'; // <-- Import the new logo image

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();
  const { currentUser } = useAuth();

  const handleLanguageChange = () => {
    if (language === Language.EN) {
      setLanguage(Language.HI);
    } else if (language === Language.HI) {
      setLanguage(Language.TE);
    } else {
      setLanguage(Language.EN);
    }
  };

  const getLanguageButtonText = () => {
    if (language === Language.EN) return 'हिंदी';
    if (language === Language.HI) return 'తెలుగు';
    return 'English';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
            {/* Use the imported logo variable here */}
            <img src={logo} alt="Skyon Logo" className="h-12" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icon name="language" className="w-5 h-5" />
            <button
              onClick={handleLanguageChange}
              className="font-semibold text-[#3b5978] hover:text-[#2c4259]"
            >
              {getLanguageButtonText()}
            </button>
          </div>
          {currentUser ? (
             <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-[#3b5978] hover:text-[#2c4259]">
              <span>{currentUser.displayName}</span>
              <Icon name="user" className="w-5 h-5" />
             </Link>
          ) : (
            <Link to="/login" className="font-semibold text-sm text-[#3b5978] hover:text-[#2c4259]">
              {t('auth_login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;