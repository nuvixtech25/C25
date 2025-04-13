import React from 'react';
import { PaymentStatus } from '@/types/checkout';
import { PixQRCode } from './PixQRCode';
import { PixCopyPaste } from './PixCopyPaste';
import { PixExpirationTimer } from './PixExpirationTimer';
import { PixPaymentDetails } from './PixPaymentDetails';
import { PixPaymentStatus } from './PixPaymentStatus';
import { PixStatusChecker } from './PixStatusChecker';
import { Card } from '@/components/ui/card';
import { QrCode, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';

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
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Payment status display - show at the top when confirmed, cancelled, or refunded */}
      {(status === 'CONFIRMED' || status === 'CANCELLED' || status === 'REFUNDED') && (
        <div className="p-6">
          <PixPaymentStatus status={status} orderId={orderId} />
        </div>
      )}
      
      {/* Only show payment methods if not confirmed or cancelled */}
      {showPaymentMethods && (
        <>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 mr-2 text-white opacity-90" />
              <h2 className="text-xl font-bold">Pagamento PIX</h2>
            </div>
            <p className="text-center text-sm text-white/90 max-w-md mx-auto">
              Realize o pagamento escaneando o QR Code ou copiando o código PIX abaixo
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - QR Code */}
              <Card className="p-6 border border-gray-200 shadow-sm bg-white rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-4 text-gray-700">
                    <QrCode className="mr-2 h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium">Escaneie o QR Code</h3>
                  </div>
                  <PixQRCode qrCodeImage={qrCodeImage} />
                  <PixExpirationTimer timeLeft={timeLeft} isExpired={isExpired} />
                </div>
              </Card>
              
              {/* Right column - Copy and Paste & Payment Details */}
              <div className="flex flex-col gap-6">
                <Card className="p-6 border border-gray-200 shadow-sm bg-white rounded-xl">
                  <div className="flex items-center mb-4 text-gray-700">
                    <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-medium">Copie e cole o código</h3>
                  </div>
                  <PixCopyPaste copyPasteKey={copyPasteKey} />
                </Card>
                
                {/* Payment details */}
                <PixPaymentDetails 
                  value={value} 
                  description={description}
                  expirationDate={expirationDate}
                />
              </div>
            </div>
            
            {/* Status checker */}
            <div className="mt-6">
              <PixStatusChecker 
                status={status} 
                isCheckingStatus={isCheckingStatus} 
                onCheckStatus={onCheckStatus}
              />
            </div>
            
            {/* Security badges */}
            <div className="mt-6 flex justify-center">
              <div className="flex gap-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-1 text-green-600" />
                  <span>Pagamento Seguro</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-green-600" />
                  <span>Transação Protegida</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Payment status display for pending/other status at the bottom */}
      {status !== 'CONFIRMED' && status !== 'CANCELLED' && status !== 'REFUNDED' && status !== 'PENDING' && (
        <div className="p-6 border-t border-gray-100">
          <PixPaymentStatus status={status} orderId={orderId} />
        </div>
      )}
    </div>
  );
};
