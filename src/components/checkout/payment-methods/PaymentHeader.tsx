
import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const PaymentHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-md mb-6 flex items-center justify-between">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <div className="flex items-center text-xs bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
        <ShieldCheck className="h-4 w-4 mr-1.5 text-asaas-primary" />
        <span className="text-gray-700 font-medium">Pagamento Seguro</span>
      </div>
    </div>
  );
};
