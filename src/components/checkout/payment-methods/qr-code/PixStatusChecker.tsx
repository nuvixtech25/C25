
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

interface PixStatusCheckerProps {
  isCheckingStatus: boolean;
  onCheckStatus: () => void;
}

export const PixStatusChecker: React.FC<PixStatusCheckerProps> = ({ 
  isCheckingStatus, 
  onCheckStatus 
}) => {
  return (
    <div className="pt-2">
      <Button 
        onClick={onCheckStatus} 
        disabled={isCheckingStatus}
        variant="outline"
        className="w-full"
      >
        {isCheckingStatus ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-4 w-4" />
        )}
        Verificar pagamento
      </Button>
    </div>
  );
};
