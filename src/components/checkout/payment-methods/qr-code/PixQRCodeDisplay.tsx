
import React, { useState, useEffect } from 'react';
import { Loader2, QrCode } from 'lucide-react';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  const [imageError, setImageError] = useState(false);
  
  // Reset image error state if a new QR code image is provided
  useEffect(() => {
    if (qrCodeImage) {
      setImageError(false);
    }
  }, [qrCodeImage]);

  // Log for debugging
  useEffect(() => {
    console.log('QR Code Image received in PixQRCodeDisplay:', qrCodeImage ? qrCodeImage.substring(0, 50) + '...' : 'No QR Code');
  }, [qrCodeImage]);

  return (
    <div className="flex justify-center">
      {qrCodeImage && !imageError ? (
        <img 
          src={qrCodeImage} 
          alt="QR Code PIX" 
          className="w-48 h-48 border-4 border-white shadow-md rounded-lg" 
          onError={(e) => {
            console.error('Error loading QR code image:', qrCodeImage);
            setImageError(true);
          }}
        />
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          {imageError ? (
            <div className="text-center">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">QR Code não pôde ser carregado</p>
              <p className="text-xs text-gray-400">Use o código copia e cola abaixo</p>
            </div>
          ) : (
            <>
              <QrCode className="h-16 w-16 text-gray-400" />
              <Loader2 className="h-8 w-8 animate-spin text-asaas-primary absolute" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
