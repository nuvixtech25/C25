
import React from 'react';
import { PixStatusCheck } from './PixStatusCheck';
import { PaymentStatus } from '@/types/checkout';

interface PixStatusCheckerProps {
  status: PaymentStatus;
  isCheckingStatus: boolean;
  onCheckStatus: () => void;
}

export const PixStatusChecker: React.FC<PixStatusCheckerProps> = ({ 
  status, 
  isCheckingStatus, 
  onCheckStatus 
}) => {
  // Always hide the status checker button
  const hidden = true;
  
  return (
    <div className="flex flex-col">
      <PixStatusCheck 
        checking={isCheckingStatus} 
        onCheck={onCheckStatus}
        hidden={hidden}
      />
    </div>
  );
};
