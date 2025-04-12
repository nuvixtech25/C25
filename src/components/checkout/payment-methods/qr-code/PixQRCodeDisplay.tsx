
import React from 'react';
import { Loader2, QrCode } from 'lucide-react';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  return (
    <div className="flex justify-center">
      {qrCodeImage ? (
        <img 
          src={qrCodeImage} 
          alt="QR Code PIX" 
          className="w-48 h-48 border-4 border-white shadow-md rounded-lg" 
          onError={(e) => {
            // If image fails to load, show a fallback
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('qr-error');
          }}
        />
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <QrCode className="h-16 w-16 text-gray-400" />
          <Loader2 className="h-8 w-8 animate-spin text-asaas-primary absolute" />
        </div>
      )}
    </div>
  );
};
