
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
            {isLoading ? 'Processando...' : (
              <span className="flex items-center justify-center">
                {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 w-full max-w-sm mx-auto text-center">
          <div className="w-48 h-48 mx-auto mb-4 animate-pulse bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-sm text-gray-500">Carregando QR Code...</p>
          </div>
          <p className="font-medium">Gerando o QR Code PIX</p>
          <p className="text-sm text-gray-500 mt-2">
            O pagamento será confirmado automaticamente
          </p>
        </div>
      )}
    </div>
  );
};
