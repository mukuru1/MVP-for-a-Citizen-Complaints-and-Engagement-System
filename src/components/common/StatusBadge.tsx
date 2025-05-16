import React from 'react';
import { ComplaintStatus } from '../../types';
import { formatStatus, getStatusColor } from '../../utils/formatters';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center rounded-full font-medium text-white';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  const statusColor = getStatusColor(status);
  
  return (
    <span className={`${baseStyle} ${sizeStyles[size]} ${statusColor} ${className}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;