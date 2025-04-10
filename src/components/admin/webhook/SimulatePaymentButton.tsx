
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimulatePaymentButtonProps {
  asaasPaymentId: string | null;
  orderId: string;
  orderStatus: string;
  isProcessing: boolean;
  onSimulate: (asaasPaymentId: string, orderId: string) => Promise<void>;
}

const SimulatePaymentButton: React.FC<SimulatePaymentButtonProps> = ({
  asaasPaymentId,
  orderId,
  orderStatus,
  isProcessing,
  onSimulate
}) => {
  // Determine the reason the button is disabled
  let disabledReason = '';
  if (isProcessing) {
    disabledReason = 'Processando...';
  } else if (orderStatus === 'CONFIRMED') {
    disabledReason = 'Pagamento já confirmado';
  } else if (!asaasPaymentId) {
    disabledReason = 'Sem ID de pagamento Asaas';
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              onClick={() => asaasPaymentId && onSimulate(asaasPaymentId, orderId)}
              disabled={!!disabledReason}
              size="sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processando...
                </>
              ) : orderStatus === 'CONFIRMED' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Já confirmado
                </>
              ) : !asaasPaymentId ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Sem ID Asaas
                </>
              ) : (
                "Simular Pagamento Confirmado"
              )}
            </Button>
          </span>
        </TooltipTrigger>
        {disabledReason && (
          <TooltipContent>
            <p>{disabledReason}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default SimulatePaymentButton;
