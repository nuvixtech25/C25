
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

interface SimplifiedPixOptionProps {
  onSubmit: () => void;
  isLoading: boolean;
  buttonColor: string;
  buttonText: string;
  showQrCode?: boolean;
}

export const SimplifiedPixOption: React.FC<SimplifiedPixOptionProps> = ({ 
  onSubmit,
  isLoading,
  buttonColor,
  buttonText,
  showQrCode = false
}) => {
  
  return (
    <div className="flex flex-col items-center">
      {!showQrCode ? (
        <>
          <p className="text-sm text-center mb-6">
            Finalize o pagamento para gerar o QR Code do PIX.
          </p>
          
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full"
            style={{ backgroundColor: buttonColor }}
          >
            {isLoading ? 'Processando...' : buttonText}
          </Button>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 w-full max-w-sm mx-auto text-center">
          <QrCode className="w-48 h-48 mx-auto mb-4" />
          <p className="font-medium">Escaneie o QR Code para pagar</p>
          <p className="text-sm text-gray-500 mt-2">
            O pagamento será confirmado automaticamente
          </p>
        </div>
      )}
    </div>
  );
};
