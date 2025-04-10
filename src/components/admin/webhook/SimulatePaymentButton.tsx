
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, CreditCard, QrCode } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WebhookEventType } from '@/hooks/admin/useWebhookSimulator';

interface SimulatePaymentButtonProps {
  asaasPaymentId: string | null;
  orderId: string;
  orderStatus: string;
  paymentMethod: string;
  isProcessing: boolean;
  selectedEvent: WebhookEventType;
  onSimulate: (asaasPaymentId: string | null, orderId: string, isManualCard?: boolean) => Promise<void>;
}

const SimulatePaymentButton: React.FC<SimulatePaymentButtonProps> = ({
  asaasPaymentId,
  orderId,
  orderStatus,
  paymentMethod,
  isProcessing,
  selectedEvent,
  onSimulate
}) => {
  // Determine if it's a credit card payment
  const isCreditCard = paymentMethod === 'creditCard';
  
  // Get event name for display
  const getEventDisplayName = (event: WebhookEventType) => {
    switch (event) {
      case 'PAYMENT_RECEIVED': return 'Recebido';
      case 'PAYMENT_CONFIRMED': return 'Confirmado';
      case 'PAYMENT_OVERDUE': return 'Vencido';
      case 'PAYMENT_CANCELED': return 'Cancelado';
      default: return event;
    }
  };
  
  // Determine if buttons should be disabled
  const isAlreadyProcessed = 
    (orderStatus === 'CONFIRMED' && 
     (selectedEvent === 'PAYMENT_RECEIVED' || selectedEvent === 'PAYMENT_CONFIRMED')) ||
    (orderStatus === 'CANCELLED' && selectedEvent === 'PAYMENT_CANCELED') ||
    (orderStatus === 'OVERDUE' && selectedEvent === 'PAYMENT_OVERDUE');
  
  const hasAsaasId = !!asaasPaymentId || isCreditCard;
  
  // Determine reason for disable
  const getDisabledReason = (isAsaasButton: boolean) => {
    if (isProcessing) return 'Processando...';
    if (isAlreadyProcessed) return `Status '${getEventDisplayName(selectedEvent)}' já aplicado`;
    if (!hasAsaasId && isAsaasButton) return 'Sem ID de pagamento Asaas';
    return '';
  };
  
  // For Asaas ID simulation
  const disabledReasonAsaas = getDisabledReason(true);
  
  // For manual credit card simulation
  const canSimulateManual = isCreditCard && !isAlreadyProcessed;
  const disabledReasonManual = !canSimulateManual ? 'Opção disponível apenas para cartão' : '';

  const handleSimulateAsaas = () => {
    if (asaasPaymentId || isCreditCard) {
      onSimulate(asaasPaymentId, orderId, false);
    }
  };

  const handleSimulateManual = () => {
    onSimulate(null, orderId, true);
  };

  return (
    <div className="flex space-x-2 justify-end">
      {/* Button for Asaas ID simulation */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                onClick={handleSimulateAsaas}
                disabled={!!disabledReasonAsaas || isProcessing}
                size="sm"
                variant={isCreditCard ? "outline" : "default"}
                className={isCreditCard ? "border-amber-500 text-amber-600" : ""}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processando...
                  </>
                ) : isAlreadyProcessed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Já {getEventDisplayName(selectedEvent)}
                  </>
                ) : !asaasPaymentId && !isCreditCard ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Sem ID Asaas
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    {isCreditCard 
                      ? `Simular Asaas (${getEventDisplayName(selectedEvent)})` 
                      : `Simular PIX (${getEventDisplayName(selectedEvent)})`}
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
                  onClick={handleSimulateManual}
                  disabled={!canSimulateManual || isProcessing}
                  size="sm"
                  variant="default"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processando...
                    </>
                  ) : isAlreadyProcessed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Já {getEventDisplayName(selectedEvent)}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Simular Cartão Manual ({getEventDisplayName(selectedEvent)})
                    </>
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!canSimulateManual && isAlreadyProcessed 
                ? `Status já ${getEventDisplayName(selectedEvent)}` 
                : disabledReasonManual || `Simular confirmação de cartão manual (${getEventDisplayName(selectedEvent)})`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SimulatePaymentButton;
