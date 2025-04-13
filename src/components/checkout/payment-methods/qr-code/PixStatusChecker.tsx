
import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentStatus } from '@/types/checkout';

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
        size="lg"
      >
        {isCheckingStatus ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Verificando pagamento...
          </>
        ) : (
          <>
            {isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Verificar pagamento
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verificar novamente
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};
