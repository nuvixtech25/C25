
import React from 'react';
import { Loader2 } from 'lucide-react';

interface SimplifiedPixOptionProps {
  onSubmit: () => void;
  isLoading: boolean;
  buttonColor: string;
}

export const SimplifiedPixOption: React.FC<SimplifiedPixOptionProps> = ({
  onSubmit,
  isLoading,
  buttonColor
}) => {
  return (
    <div className="mt-6">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <svg className="h-5 w-5 mr-2 text-gray-600 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-700">Como funciona o pagamento com PIX</p>
            <p className="text-sm text-gray-600 mt-1">
              Ao clicar em "Pagar com PIX", você será direcionado para uma página com o QR Code e o código para copiar e colar no aplicativo do seu banco.
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={onSubmit}
        className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center"
        style={{ backgroundColor: buttonColor }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          'Pagar com PIX'
        )}
      </button>
    </div>
  );
};
