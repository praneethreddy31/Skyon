
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cursorClass = onClick ? 'cursor-pointer' : '';
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
