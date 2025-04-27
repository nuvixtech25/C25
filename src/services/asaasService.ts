
import { PaymentStatus } from '@/types/checkout';

interface PaymentStatusResponse {
  status: PaymentStatus;
  error?: string;
  source?: string;
}

/**
 * Verifica o status de um pagamento Asaas
 * @param paymentId ID do pagamento no Asaas
 * @returns Status atual do pagamento
 */
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus | PaymentStatusResponse> => {
  try {
    console.log(`Verificando status do pagamento: ${paymentId}`);
    
    // Adicionar parâmetro para evitar cache do navegador
    const url = `/api/check-payment-status?paymentId=${paymentId}&t=${Date.now()}`;
    
    // Implementar mecanismo de retry para lidar com falhas temporárias
    const MAX_RETRIES = 2;
    let retries = 0;
    let lastError = null;
    
    while (retries <= MAX_RETRIES) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Status do pagamento ${paymentId} recebido:`, data);
          
          // Se não tiver status ou o status não for válido, assumir PENDING
          if (!data.status || typeof data.status !== 'string') {
            console.warn('Status inválido recebido da API:', data);
            return 'PENDING';
          }
          
          // Normalize the status - ensure consistent formatting across the system
          let normalizedStatus: PaymentStatus = data.status as PaymentStatus;
          
          // Remapear certos status do Asaas para o formato que usamos
          if (normalizedStatus === 'RECEIVED') {
            console.log('Remapeando status RECEIVED para CONFIRMED');
            normalizedStatus = 'CONFIRMED';
          }
          
          return normalizedStatus;
        } else {
          lastError = `${response.status} ${response.statusText}`;
          console.warn(`Tentativa ${retries + 1} falhou: ${lastError}`);
          retries++;
          
          if (retries <= MAX_RETRIES) {
            // Aguardar antes de tentar novamente (exponential backoff)
            await new Promise(r => setTimeout(r, 500 * Math.pow(2, retries)));
          }
        }
      } catch (error: unknown) {
        const fetchError = error as Error;
        lastError = fetchError.message;
        console.warn(`Erro de fetch na tentativa ${retries + 1}: ${lastError}`);
        retries++;
        
        if (retries <= MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 500 * Math.pow(2, retries)));
        }
      }
    }
    
    console.error(`Todas as ${MAX_RETRIES + 1} tentativas falharam. Último erro: ${lastError}`);
    
    // Em caso de erro após todas as tentativas, assumir que o pagamento ainda está pendente
    return {
      status: 'PENDING',
      error: `Não foi possível verificar o status após ${MAX_RETRIES + 1} tentativas: ${lastError}`,
      source: 'client_fallback'
    };
  } catch (error: unknown) {
    const thrownError = error as Error;
    console.error('Erro ao verificar status do pagamento:', thrownError);
    // Em caso de erro, assumir que o pagamento ainda está pendente
    return {
      status: 'PENDING',
      error: thrownError.message || 'Erro desconhecido',
      source: 'exception_handler' 
    };
  }
};

// ... keep existing code (generatePixPayment function and related implementation)
