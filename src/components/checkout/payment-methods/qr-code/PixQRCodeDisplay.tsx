
import React, { useState, useEffect } from 'react';
import { Loader2, QrCode } from 'lucide-react';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  const [imageError, setImageError] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  
  // Reset image error state if a new QR code image is provided
  useEffect(() => {
    if (qrCodeImage) {
      setImageError(false);
      
      // Verificar se o QR code já está no formato de data URL
      if (qrCodeImage.startsWith('data:image')) {
        setDataUrl(qrCodeImage);
      } else {
        // Tenta converter para data URL se não estiver no formato correto
        try {
          // Para imagens base64 sem o prefixo de data URL
          setDataUrl(`data:image/png;base64,${qrCodeImage}`);
          console.log("QR Code convertido para data URL");
        } catch (e) {
          console.error("Erro ao converter QR code para data URL:", e);
          setImageError(true);
        }
      }
    } else {
      setDataUrl(null);
    }
  }, [qrCodeImage]);

  // Log for debugging
  useEffect(() => {
    const logInfo = dataUrl ? {
      isDataUrl: dataUrl.startsWith('data:image'),
      length: dataUrl.length,
      preview: dataUrl.substring(0, 50) + '...'
    } : 'No QR Code data';
    
    console.log('QR Code Image state in PixQRCodeDisplay:', logInfo);
  }, [dataUrl]);

  return (
    <div className="flex justify-center">
      {dataUrl && !imageError ? (
        <img 
          src={dataUrl} 
          alt="QR Code PIX" 
          className="w-48 h-48 border-4 border-white shadow-md rounded-lg" 
          onError={(e) => {
            console.error('Error loading QR code image:', e);
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
