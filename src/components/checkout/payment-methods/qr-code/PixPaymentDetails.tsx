
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
  return (
    <CardFooter className="flex justify-between bg-white rounded-lg">
      <div>
        <p className="text-sm font-medium">Total</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <p className="font-bold text-lg">{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
    </CardFooter>
  );
};
