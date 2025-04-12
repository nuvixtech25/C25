
import React from 'react';
import { CardFooter } from '@/components/ui/card';

interface PixPaymentDetailsProps {
  description: string;
  value: number;
}

export const PixPaymentDetails: React.FC<PixPaymentDetailsProps> = ({
  description,
  value
}) => {
  // Add stronger safety check to handle undefined or null values
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  
  return (
    <CardFooter className="flex justify-between bg-white rounded-lg">
      <div>
        <p className="text-sm font-medium">Total</p>
        <p className="text-muted-foreground text-xs">{description || 'Pagamento'}</p>
      </div>
      <p className="font-bold text-lg">{safeValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
    </CardFooter>
  );
};
