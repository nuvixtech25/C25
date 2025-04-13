
import React from 'react';
import { PaymentStatus } from '@/types/checkout';
import { PixQRCode } from './PixQRCode';
import { PixCopyPaste } from './PixCopyPaste';
import { PixExpirationTimer } from './PixExpirationTimer';
import { PixPaymentDetails } from './PixPaymentDetails';
import { PixPaymentStatus } from './PixPaymentStatus';
import { PixStatusChecker } from './PixStatusChecker';

interface PixPaymentContainerProps {
  orderId: string;
  paymentId: string;
  qrCode: string;
  qrCodeImage: string;
  copyPasteKey: string;
  expirationDate: string;
  value: number;
  description: string;
  status: PaymentStatus;
  isCheckingStatus: boolean;
  timeLeft: string;
  isExpired: boolean;
  onCheckStatus: () => void;
  productType?: 'digital' | 'physical';
}

export const PixPaymentContainer: React.FC<PixPaymentContainerProps> = ({
  orderId,
  paymentId,
  qrCode,
  qrCodeImage,
  copyPasteKey,
  expirationDate,
  value,
  description,
  status,
  isCheckingStatus,
  timeLeft,
  isExpired,
  onCheckStatus,
  productType = 'physical'
}) => {
  // Determine whether to show the QR code and copy-paste sections
  const showPaymentMethods = status !== 'CONFIRMED' && status !== 'CANCELLED' && status !== 'REFUNDED';
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Payment status display - show at the top when confirmed, cancelled, or refunded */}
      {(status === 'CONFIRMED' || status === 'CANCELLED' || status === 'REFUNDED') && (
        <div className="mb-8">
          <PixPaymentStatus status={status} orderId={orderId} />
        </div>
      )}
      
      {/* Only show payment methods if not confirmed or cancelled */}
      {showPaymentMethods && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - QR Code */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium mb-4 text-gray-700">Escaneie o QR Code</h3>
            <PixQRCode qrCodeImage={qrCodeImage} />
            <PixExpirationTimer timeLeft={timeLeft} isExpired={isExpired} />
          </div>
          
          {/* Right column - Copy and Paste */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-medium mb-4 text-gray-700">Ou copie e cole o código</h3>
            <PixCopyPaste copyPasteKey={copyPasteKey} />
          </div>
        </div>
      )}
      
      {/* Bottom section - Payment details and status check */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <PixPaymentDetails 
          value={value} 
          description={description}
          expirationDate={expirationDate}
        />
        
        {/* Status checker */}
        {showPaymentMethods && (
          <PixStatusChecker 
            status={status} 
            isCheckingStatus={isCheckingStatus} 
            onCheckStatus={onCheckStatus}
          />
        )}
      </div>
      
      {/* Payment status display for pending/other status at the bottom */}
      {status !== 'CONFIRMED' && status !== 'CANCELLED' && status !== 'REFUNDED' && status !== 'PENDING' && (
        <div className="mt-8">
          <PixPaymentStatus status={status} orderId={orderId} />
        </div>
      )}
    </div>
  );
};
