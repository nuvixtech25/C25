
import React from 'react';
import { RefreshCw } from 'lucide-react';
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
  return (
    <div className="flex justify-center">
      <Button
        onClick={onCheckStatus}
        disabled={isCheckingStatus}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        {isCheckingStatus ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Verificando...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Verificar pagamento
          </>
        )}
      </Button>
    </div>
  );
};
