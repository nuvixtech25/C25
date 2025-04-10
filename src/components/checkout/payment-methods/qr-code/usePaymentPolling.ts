
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
  intervalMs: number = 10000
): UsePaymentPollingResult => {
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Função para verificar status (usando useCallback para estabilizar a referência)
  const checkStatus = useCallback(async () => {
    if (!paymentId || isCheckingStatus) return;
    
    setIsCheckingStatus(true);
    setError(null);
    
    try {
      console.log(`Iniciando verificação de status para pagamento: ${paymentId}`);
      const currentStatus = await checkPaymentStatus(paymentId);
      console.log(`Status atualizado recebido: ${currentStatus}`);
      
      // Atualizar estado apenas se for diferente para evitar re-renders desnecessários
      if (currentStatus !== status) {
        console.log(`Atualizando status de ${status} para ${currentStatus}`);
        setStatus(currentStatus);
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Erro ao verificar status:", err);
    } finally {
      setIsCheckingStatus(false);
    }
  }, [paymentId, isCheckingStatus, status]);
  
  // Verificação manual do status
  const forceCheck = async () => {
    console.log('Forçando verificação de status...');
    await checkStatus();
  };

  // Configurar verificação periódica
  useEffect(() => {
    // Verificar imediatamente na montagem do componente
    checkStatus();
    
    // Configurar verificação periódica se o status estiver pendente
    let intervalId: NodeJS.Timeout | undefined;
    
    if (status === 'PENDING') {
      console.log(`Configurando polling a cada ${intervalMs}ms para o pagamento: ${paymentId}`);
      intervalId = setInterval(checkStatus, intervalMs);
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
  }, [paymentId, status, intervalMs, checkStatus]);

  return { status, isCheckingStatus, error, forceCheck };
};
