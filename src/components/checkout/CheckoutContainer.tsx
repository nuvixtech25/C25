
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutFooter } from './CheckoutFooter';

interface CheckoutContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader />
      
      <main className={cn("container mx-auto px-4 py-8", className)}>
        {children}
      </main>
      
      <CheckoutFooter />
    </div>
  );
};
