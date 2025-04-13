
import React from 'react';
import { CardFooter } from '@/components/ui/card';

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
    <CardFooter className="flex flex-col gap-2 bg-white rounded-lg">
      <div className="flex justify-between w-full">
        <div>
          <p className="text-sm font-medium">Total</p>
          <p className="text-muted-foreground text-xs">{description || 'Pagamento'}</p>
        </div>
        <p className="font-bold text-lg">{safeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
      
      {expirationDate && (
        <div className="w-full pt-2 border-t border-gray-100">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Validade:</span> {new Date(expirationDate).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
    </CardFooter>
  );
};
