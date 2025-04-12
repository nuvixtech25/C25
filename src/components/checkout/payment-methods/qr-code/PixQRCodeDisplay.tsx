
import React from 'react';
import { QrCode, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  const handleDownloadQRCode = () => {
    if (!qrCodeImage) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = 'pix-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      {qrCodeImage ? (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
          <div className="relative p-4 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
            <div className="absolute top-2 right-2 flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-asaas-primary animate-pulse" />
            </div>
            <img 
              src={qrCodeImage} 
              alt="QR Code PIX" 
              className="max-w-full max-h-full object-contain animate-scale-in"
              onError={(e) => {
                console.error("Failed to load QR code image");
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.innerHTML = '<div class="text-center text-gray-500"><QrCode class="h-12 w-12 mx-auto mb-2" /><p>Erro ao carregar QR Code</p></div>';
              }}
            />
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="mt-2 text-xs text-gray-500 hover:text-asaas-primary mx-auto flex items-center"
            onClick={handleDownloadQRCode}
          >
            <Download className="h-3 w-3 mr-1" />
            Salvar QR Code
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl blur-lg opacity-20"></div>
          <div className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 w-64 h-64 mx-auto flex flex-col items-center justify-center text-gray-400">
            <QrCode className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-center text-sm">
              QR Code não disponível.<br />Use o código de cópia e cola abaixo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
