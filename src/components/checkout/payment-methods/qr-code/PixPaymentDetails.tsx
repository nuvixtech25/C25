
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
    <CardFooter className="flex flex-col gap-3 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center">
          <div className="mr-3 bg-green-50 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Total a pagar</p>
            <p className="text-xs text-gray-500">{description || 'Pagamento'}</p>
          </div>
        </div>
        <p className="font-bold text-lg text-gray-900">{safeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
      
      {expirationDate && (
        <div className="flex items-center mt-1 pt-3 border-t border-gray-100">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          <p className="text-xs text-gray-500">
            <span className="font-medium">Validade:</span> {new Date(expirationDate).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
      
      <div className="flex items-center mt-1 bg-yellow-50 p-2 rounded-md">
        <FileText className="h-4 w-4 text-yellow-600 mr-2" />
        <p className="text-xs text-yellow-700">
          O pagamento será confirmado em instantes após o PIX ser realizado
        </p>
      </div>
    </CardFooter>
  );
};
