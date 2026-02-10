
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 focus:ring-primary",
    secondary: "bg-secondary text-white hover:bg-opacity-90 focus:ring-secondary",
    danger: "bg-danger text-white hover:bg-opacity-90 focus:ring-danger",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-4 py-2 bg-white border border-borderLight rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all ${className}`}
    {...props}
  />
);

export const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className="block text-sm font-semibold text-primary mb-1">
    {children}
    {required && <span className="text-danger ml-1">*</span>}
  </label>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-borderLight shadow-sm ${className}`}>
    {children}
  </div>
);
