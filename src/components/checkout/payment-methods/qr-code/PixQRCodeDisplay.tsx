
import React from 'react';
import { QrCode } from 'lucide-react';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {qrCodeImage ? (
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 w-64 h-64 mx-auto flex items-center justify-center">
          <img 
            src={qrCodeImage} 
            alt="QR Code PIX" 
            className="max-w-full max-h-full object-contain animate-scale-in"
          />
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 w-64 h-64 mx-auto flex flex-col items-center justify-center text-gray-400">
          <QrCode className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-center text-sm">
            QR Code não disponível.<br />Use o código de cópia e cola abaixo.
          </p>
        </div>
      )}
    </div>
  );
};
