
import React from 'react';
import { ArrowLeft, ShieldCheck, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export const PaymentHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-md mb-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-full shadow-sm border border-green-100">
                <LockKeyhole className="h-3.5 w-3.5 text-green-600" />
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700 font-medium">Pagamento Seguro</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Seus dados estão protegidos com criptografia de ponta a ponta</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Finalize seu pagamento</h1>
        <p className="text-gray-500 text-sm mt-1">Escolha uma das opções abaixo para continuar</p>
      </div>
    </div>
  );
};
