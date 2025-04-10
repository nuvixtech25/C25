
import { useState, useEffect } from 'react';
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
  intervalMs: number = 10000
): UsePaymentPollingResult => {
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Função para verificar status
  const checkStatus = async () => {
    if (!paymentId || isCheckingStatus) return;
    
    setIsCheckingStatus(true);
    setError(null);
    
    try {
      const currentStatus = await checkPaymentStatus(paymentId);
      setStatus(currentStatus);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Erro ao verificar status:", err);
    } finally {
      setIsCheckingStatus(false);
    }
  };
  
  // Verificação manual do status
  const forceCheck = async () => {
    await checkStatus();
  };

  // Configurar verificação periódica
  useEffect(() => {
    // Verificar imediatamente na montagem do componente
    checkStatus();
    
    // Configurar verificação periódica se o status estiver pendente
    let intervalId: NodeJS.Timeout | undefined;
    
    if (status === 'PENDING') {
      intervalId = setInterval(checkStatus, intervalMs);
    }
    
    // Limpar intervalo na desmontagem
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentId, status, intervalMs]);

  return { status, isCheckingStatus, error, forceCheck };
};
