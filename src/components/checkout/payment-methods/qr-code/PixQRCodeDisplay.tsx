
import React from 'react';
import { QrCode, Sparkles, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  const handleDownloadQRCode = () => {
    if (!qrCodeImage || qrCodeImage.trim() === '') {
      console.warn("Attempted to download QR code, but image is not available");
      return;
    }
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = 'pix-qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };
  
  // Log QR code presence for debugging
  React.useEffect(() => {
    if (qrCodeImage && qrCodeImage.trim() !== '') {
      console.log("QR code image is available for display");
    } else {
      console.warn("QR code image is not available for display");
    }
  }, [qrCodeImage]);
  
  return (
    <div className="flex flex-col items-center justify-center">
      {qrCodeImage && qrCodeImage.trim() !== '' ? (
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
                // Check if parentElement exists before using it
                const element = e.currentTarget;
                const parent = element.parentElement;
                if (parent) {
                  // Hide the image
                  element.style.display = 'none';
                  // Replace with error message
                  parent.innerHTML = '<div class="text-center text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 mx-auto mb-2"><rect x="1" y="1" width="22" height="22" rx="2" ry="2"></rect><path d="M8 8v8"></path><path d="M16 16v-3"></path><path d="M16 8v3"></path></svg><p>Erro ao carregar QR Code</p></div>';
                }
              }}
              loading="eager" // Prioritize loading
            />
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="mt-2 text-xs text-gray-500 hover:text-asaas-primary mx-auto flex items-center"
            onClick={handleDownloadQRCode}
            disabled={!qrCodeImage || qrCodeImage.trim() === ''}
          >
            <Download className="h-3 w-3 mr-1" />
            Salvar QR Code
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl blur-lg opacity-20"></div>
          <div className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 w-64 h-64 mx-auto flex flex-col items-center justify-center text-gray-400">
            <AlertCircle className="w-16 h-16 mb-4 text-amber-400" />
            <p className="text-center text-sm">
              QR Code não disponível.<br />Tente usar o código de cópia e cola abaixo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
