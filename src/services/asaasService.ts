// @/services/asaasService.ts

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
          
          // Normalizar o status - garantir formatação consistente em todo o sistema
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

/**
 * Gera o pagamento Pix no Asaas
 * @param billingData Dados da cobrança para gerar o pagamento Pix
 * @returns Dados do pagamento Pix gerado
 */
export const generatePixPayment = (billingData: { value: number; description: string }) => {
  // Lógica para gerar pagamento Pix com base nos dados da cobrança
  const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  
  // Dados simulados para o pagamento Pix
  const pixPayment = {
    paymentId: '12345', // ID fictício do pagamento
    qrCodeImage: 'QR_CODE_IMAGE', // Imagem do código QR
    qrCode: 'QR_CODE', // Código QR
    copyPasteKey: 'COPY_PASTE_KEY', // Chave para copiar e colar
    expirationDate: expirationDate, // Data de expiração
    value: billingData.value, // Valor do pagamento
    description: billingData.description, // Descrição do pagamento
    status: 'PENDING' // Status do pagamento
  };

  return pixPayment;
};

