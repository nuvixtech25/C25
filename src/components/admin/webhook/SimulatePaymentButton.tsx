
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, CreditCard, QrCode } from 'lucide-react';
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
  paymentMethod: string;
  isProcessing: boolean;
  onSimulate: (asaasPaymentId: string | null, orderId: string, isManualCard?: boolean) => Promise<void>;
}

const SimulatePaymentButton: React.FC<SimulatePaymentButtonProps> = ({
  asaasPaymentId,
  orderId,
  orderStatus,
  paymentMethod,
  isProcessing,
  onSimulate
}) => {
  // Determine if it's a credit card payment
  const isCreditCard = paymentMethod === 'creditCard';
  
  // Determine the reason the button is disabled for Asaas payments
  let disabledReasonAsaas = '';
  if (isProcessing) {
    disabledReasonAsaas = 'Processando...';
  } else if (orderStatus === 'CONFIRMED') {
    disabledReasonAsaas = 'Pagamento já confirmado';
  } else if (!asaasPaymentId && !isCreditCard) {
    disabledReasonAsaas = 'Sem ID de pagamento Asaas';
  }

  // For manual credit card payments
  const canSimulateManual = isCreditCard && orderStatus !== 'CONFIRMED';
  
  return (
    <div className="flex space-x-2 justify-end">
      {/* Button for Asaas ID simulation */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={() => onSimulate(asaasPaymentId, orderId, false)}
                disabled={!!disabledReasonAsaas}
                size="sm"
                variant={isCreditCard ? "outline" : "default"}
                className={isCreditCard ? "border-amber-500 text-amber-600" : ""}
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
                ) : !asaasPaymentId && !isCreditCard ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Sem ID Asaas
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    {isCreditCard ? "Simular com Asaas ID" : "Simular Pagamento"}
                  </>
                )}
              </Button>
            </span>
          </TooltipTrigger>
          {disabledReasonAsaas && (
            <TooltipContent>
              <p>{disabledReasonAsaas}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Button for manual credit card simulation */}
      {isCreditCard && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  onClick={() => onSimulate(null, orderId, true)}
                  disabled={!canSimulateManual || isProcessing}
                  size="sm"
                  variant="default"
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
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Simular Cartão Manual
                    </>
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!canSimulateManual && orderStatus === 'CONFIRMED' 
                ? 'Pagamento já confirmado' 
                : 'Simular confirmação de cartão manual'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SimulatePaymentButton;
