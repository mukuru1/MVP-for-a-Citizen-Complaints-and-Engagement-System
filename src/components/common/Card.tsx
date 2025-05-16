import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  borderColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  borderColor,
}) => {
  const baseStyle = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverStyle = hoverEffect ? 'hover:shadow-lg transition-shadow duration-300' : '';
  const borderStyle = borderColor ? `border-l-4 ${borderColor}` : '';
  const cursorStyle = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${borderStyle} ${cursorStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`px-4 py-3 border-b ${className}`}>{children}</div>;
};

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`px-4 py-3 border-t bg-gray-50 ${className}`}>{children}</div>;
};

export default Card;