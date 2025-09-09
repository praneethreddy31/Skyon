import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  leftIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', leftIcon, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-[#3b5978] text-white border-transparent hover:bg-[#2c4259] focus:ring-[#3b5978]',
    secondary: 'bg-gray-200 text-gray-800 border-transparent hover:bg-gray-300 focus:ring-gray-400',
    outline: 'bg-transparent text-[#3b5978] border-[#3b5978] hover:bg-sky-50 focus:ring-[#3b5978]',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  );
};

export default Button;