
import React from 'react';
import { Loader2 } from 'lucide-react';

interface PixQRCodeProps {
  qrCodeImage: string;
}

export const PixQRCode: React.FC<PixQRCodeProps> = ({ qrCodeImage }) => {
  return (
    <div className="flex justify-center">
      {qrCodeImage ? (
        <img 
          src={qrCodeImage} 
          alt="QR Code PIX" 
          className="w-48 h-48 border-4 border-white shadow-md rounded-lg" 
        />
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-asaas-primary" />
        </div>
      )}
    </div>
  );
};
