
import React, { useState, useEffect } from 'react';
import { QrCode, Sparkles, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset error state whenever we get a new QR code image
  useEffect(() => {
    if (qrCodeImage && qrCodeImage.trim() !== '') {
      setImageError(false);
      setIsLoading(true);
      console.log("QR code image received, length:", qrCodeImage.length);
      
      // Check if the image starts with data:image prefix (valid base64 image)
      if (!qrCodeImage.startsWith('data:image')) {
        console.warn("QR code image doesn't appear to be a valid data URL", 
          qrCodeImage.substring(0, 20) + "...");
        setImageError(true);
      }
    } else {
      console.warn("QR code image is empty or undefined");
      setImageError(true);
    }
  }, [qrCodeImage]);

  const handleDownloadQRCode = () => {
    if (!qrCodeImage || qrCodeImage.trim() === '' || imageError) {
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
  
  // Render error state if we have an error or no QR code
  if (imageError || !qrCodeImage || qrCodeImage.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl blur-lg opacity-20"></div>
          <div className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 w-64 h-64 mx-auto flex flex-col items-center justify-center text-gray-400">
            <AlertCircle className="w-16 h-16 mb-4 text-amber-400" />
            <p className="text-center text-sm">
              QR Code não disponível.<br />Tente usar o código de cópia e cola abaixo.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
        <div className="relative p-4 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <Sparkles className="h-4 w-4 text-asaas-primary animate-pulse" />
          </div>
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="w-8 h-8 border-4 border-asaas-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img 
            src={qrCodeImage} 
            alt="QR Code PIX" 
            className="max-w-full max-h-full object-contain animate-scale-in"
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              console.error("Failed to load QR code image");
              setImageError(true);
              setIsLoading(false);
            }}
            loading="eager" // Prioritize loading
          />
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="mt-2 text-xs text-gray-500 hover:text-asaas-primary mx-auto flex items-center"
          onClick={handleDownloadQRCode}
          disabled={imageError || isLoading}
        >
          <Download className="h-3 w-3 mr-1" />
          Salvar QR Code
        </Button>
      </div>
    </div>
  );
};
