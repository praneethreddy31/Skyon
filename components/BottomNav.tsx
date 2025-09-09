import React from 'react';
import { NavLink } from 'react-router-dom';
// Fix: Use the useLocalization hook instead of importing LocalizationContext from App.
import { useLocalization } from '../contexts/LocalizationContext';
import Icon from './Icon';

const BottomNav: React.FC = () => {
  // Fix: Use the useLocalization hook.
  const { t } = useLocalization();

  const navItems = [
    { path: '/', label: t('nav_home'), icon: 'home' },
    { path: '/marketplace', label: t('nav_market'), icon: 'store' },
    { path: '/vendors', label: t('nav_services'), icon: 'services' },
    { path: '/medical', label: t('nav_medical'), icon: 'medical' },
    { path: '/events', label: t('nav_events'), icon: 'events' },
  ];

  const activeLinkClass = 'text-[#3b5978]';
  const inactiveLinkClass = 'text-gray-500 hover:text-[#3b5978]';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-md z-10">
      <div className="container mx-auto flex justify-around p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            <Icon name={item.icon} className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
