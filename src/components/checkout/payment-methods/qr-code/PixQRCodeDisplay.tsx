
import React, { useState, useEffect } from 'react';
import { QrCode, Sparkles, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Renderizar um componente para debugging do QR code
  useEffect(() => {
    console.log("PixQRCodeDisplay - Recebendo QR code:", qrCodeImage ? 
      `${qrCodeImage.substring(0, 30)}... (${qrCodeImage.length} caracteres)` : 
      "QR code ausente");
      
    // Resetar o estado de erro quando recebemos uma nova imagem QR code
    if (qrCodeImage && qrCodeImage.trim() !== '') {
      setImageError(false);
      setIsLoading(true);
      
      // Verificar se a imagem é válida (começa com data:image)
      if (!qrCodeImage.startsWith('data:image')) {
        console.warn("QR code não é uma URL de dados válida, tentando corrigir");
        
        // Se parece base64 mas sem o prefixo, poderíamos tentar consertar
        // mas vamos registrar o erro por enquanto
        setImageError(true);
      }
    } else {
      console.warn("QR code está vazio ou indefinido");
      setImageError(true);
    }
  }, [qrCodeImage]);

  const handleDownloadQRCode = () => {
    if (!qrCodeImage || qrCodeImage.trim() === '' || imageError) {
      console.warn("Tentativa de download do QR code, mas a imagem não está disponível");
      return;
    }
    
    try {
      // Criar um elemento de link temporário
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = 'pix-qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Falha ao baixar QR code:", error);
    }
  };
  
  // Renderizar estado de erro se tivermos um erro ou nenhum QR code
  if (imageError || !qrCodeImage || qrCodeImage.trim() === '') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 w-64 h-64 mx-auto flex flex-col items-center justify-center text-gray-500">
            <AlertCircle className="w-16 h-16 mb-4 text-amber-400" />
            <p className="text-center text-sm">
              QR Code não disponível.<br />Use o código de cópia e cola abaixo.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group">
        <div className="relative p-4 bg-white rounded-xl w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img 
            src={qrCodeImage} 
            alt="QR Code PIX" 
            className="max-w-full max-h-full object-contain"
            onLoad={() => {
              console.log("QR code carregado com sucesso");
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error("Falha ao carregar imagem do QR code");
              setImageError(true);
              setIsLoading(false);
            }}
            loading="eager" // Priorizar carregamento
          />
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="mt-2 text-xs text-gray-500 hover:text-green-600 mx-auto flex items-center"
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
