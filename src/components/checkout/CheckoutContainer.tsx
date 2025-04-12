
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutFooter } from './CheckoutFooter';

interface CheckoutContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Change from named export to default export
const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <CheckoutHeader />
      
      <main className={cn("container mx-auto px-4 py-4", className)}>
        {children}
      </main>
      
      <CheckoutFooter />
    </div>
  );
};

// Export as default instead of named export
export default CheckoutContainer;
