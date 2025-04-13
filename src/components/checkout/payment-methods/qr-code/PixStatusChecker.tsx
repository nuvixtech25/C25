
import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentStatus } from '@/types/checkout';
import { useIsMobile } from '@/hooks/use-mobile';

interface PixStatusCheckerProps {
  isCheckingStatus: boolean;
  onCheckStatus: () => void;
  status?: PaymentStatus;
}

export const PixStatusChecker: React.FC<PixStatusCheckerProps> = ({
  isCheckingStatus,
  onCheckStatus,
  status
}) => {
  // Determine button style based on status
  const isPending = !status || status === 'PENDING';
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-center mt-2">
      <Button
        onClick={onCheckStatus}
        disabled={isCheckingStatus}
        className={`w-full font-medium ${
          isPending 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
        size={isMobile ? "default" : "lg"}
      >
        {isCheckingStatus ? (
          <>
            <RefreshCw className="mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4 animate-spin" />
            <span className="text-sm sm:text-base">Verificando pagamento...</span>
          </>
        ) : (
          <>
            {isPending ? (
              <>
                <RefreshCw className="mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                <span className="text-sm sm:text-base">Verificar pagamento</span>
              </>
            ) : (
              <>
                <CheckCircle className="mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                <span className="text-sm sm:text-base">Verificar novamente</span>
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};
