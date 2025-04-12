
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutFooter } from './CheckoutFooter';

interface CheckoutContainerProps {
  children: React.ReactNode;
  className?: string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("min-h-screen bg-white text-gray-900", className)}>
      <CheckoutHeader />
      
      <main className={cn("container mx-auto px-4 py-8", className)}>
        {children}
      </main>
      
      <CheckoutFooter />
    </div>
  );
};

export default CheckoutContainer;
