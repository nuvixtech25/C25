
import React from 'react';
import { cn } from '@/lib/utils';

interface CheckoutLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold heading-gradient">
              Checkout Seguro
            </h1>
          </div>
        </div>
      </header>
      
      <main className={cn("container mx-auto px-4 py-8", className)}>
        {children}
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              <span className="text-sm text-gray-600">Pagamento 100% seguro</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span className="text-sm text-gray-600">Dados protegidos</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              <span className="text-sm text-gray-600">Política de privacidade</span>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Checkout. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
