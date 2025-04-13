
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Calendar, CreditCard, FileText } from 'lucide-react';

interface PixPaymentDetailsProps {
  description: string;
  value: number;
  expirationDate?: string;
}

export const PixPaymentDetails: React.FC<PixPaymentDetailsProps> = ({
  description,
  value,
  expirationDate
}) => {
  // Add stronger safety check to handle undefined or null values
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  return (
    <CardFooter className="flex flex-col gap-2 sm:gap-3 bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center">
          <div className="mr-2 sm:mr-3 bg-green-50 p-1.5 sm:p-2 rounded-full">
            <CreditCard className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-700">Total a pagar</p>
            <p className="text-xs text-gray-500">{description || 'Pagamento'}</p>
          </div>
        </div>
        <p className="font-bold text-base sm:text-lg text-gray-900">{safeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
      
      {expirationDate && (
        <div className="flex items-center mt-1 pt-2 sm:pt-3 border-t border-gray-100">
          <Calendar className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400 mr-1.5 sm:mr-2" />
          <p className="text-xs text-gray-500">
            <span className="font-medium">Validade:</span> {new Date(expirationDate).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
      
      <div className="flex items-center mt-1 bg-yellow-50 p-1.5 sm:p-2 rounded-md text-center sm:text-left">
        <FileText className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-yellow-600 mr-1.5 sm:mr-2 flex-shrink-0" />
        <p className="text-xs text-yellow-700">
          O pagamento será confirmado em instantes após o PIX ser realizado
        </p>
      </div>
    </CardFooter>
  );
};
