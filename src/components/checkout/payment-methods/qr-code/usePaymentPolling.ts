
import { useState, useEffect, useCallback } from 'react';
import { PaymentStatus } from '@/types/checkout';
import { checkPaymentStatus } from '@/services/asaasService';

interface UsePaymentPollingResult {
  status: PaymentStatus;
  isCheckingStatus: boolean;
  error: Error | null;
  forceCheck: () => Promise<void>;
}

/**
 * Hook para verificar periodicamente o status de um pagamento
 */
export const usePaymentPolling = (
  paymentId: string, 
  initialStatus: PaymentStatus = 'PENDING', 
  intervalMs: number = 3000  // Reduced from 5000 to 3000 for even more frequent checks
): UsePaymentPollingResult => {
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<number>(0);
  const [consecutiveChecks, setConsecutiveChecks] = useState<number>(0);

  // Função para verificar status (usando useCallback para estabilizar a referência)
  const checkStatus = useCallback(async (force: boolean = false) => {
    // Don't check too frequently unless forced
    const now = Date.now();
    if (!force && lastCheckedAt && now - lastCheckedAt < 1000) {
      console.log('Skipping check - too soon since last check');
      return;
    }
    
    if (!paymentId || isCheckingStatus) return;
    
    setIsCheckingStatus(true);
    setError(null);
    
    try {
      console.log(`Iniciando verificação de status para pagamento: ${paymentId}`);
      const currentStatus = await checkPaymentStatus(paymentId);
      console.log(`Status atualizado recebido: ${currentStatus}`);
      
      // Check if status has changed
      if (currentStatus !== status) {
        console.log(`Atualizando status de ${status} para ${currentStatus}`);
        setStatus(currentStatus);
        setConsecutiveChecks(0); // Reset consecutive checks counter on change
      } else {
        // If status is still PENDING, increase consecutive checks counter
        if (currentStatus === 'PENDING') {
          setConsecutiveChecks(prev => prev + 1);
        }
      }
      
      // Update last checked timestamp
      setLastCheckedAt(now);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Erro ao verificar status:", err);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [paymentId, isCheckingStatus, status, lastCheckedAt]);
  
  // Verificação manual do status
  const forceCheck = async () => {
    console.log('Forçando verificação de status...');
    await checkStatus(true);
  };

  // Configurar verificação periódica
  useEffect(() => {
    // Verificar imediatamente na montagem do componente
    checkStatus();
    
    // Configurar verificação periódica se o status estiver pendente
    let intervalId: NodeJS.Timeout | undefined;
    
    if (status === 'PENDING') {
      // Determine polling frequency based on consecutive checks
      // As more checks return PENDING, we can slow down polling to reduce load
      let currentInterval = intervalMs;
      if (consecutiveChecks > 10) {
        currentInterval = intervalMs * 2; // Increase interval after 10 checks
      }
      
      console.log(`Configurando polling a cada ${currentInterval}ms para o pagamento: ${paymentId}`);
      intervalId = setInterval(() => checkStatus(), currentInterval);
    } else {
      console.log(`Status não é mais PENDING, polling parado. Status atual: ${status}`);
    }
    
    // Limpar intervalo na desmontagem
    return () => {
      if (intervalId) {
        console.log('Limpando intervalo de polling');
        clearInterval(intervalId);
      }
    };
  }, [paymentId, status, intervalMs, checkStatus, consecutiveChecks]);

  return { status, isCheckingStatus, error, forceCheck };
};
