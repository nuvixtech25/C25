
import { PaymentStatus } from '@/types/checkout';

/**
 * Verifica o status de um pagamento Asaas
 * @param paymentId ID do pagamento no Asaas
 * @returns Status atual do pagamento
 */
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  try {
    console.log(`Verificando status do pagamento: ${paymentId}`);
    
    // Adicionar parâmetro para evitar cache do navegador
    const url = `/api/check-payment-status?paymentId=${paymentId}&t=${Date.now()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao verificar status: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Status do pagamento ${paymentId} recebido:`, data);
    
    // Se não tiver status ou o status não for válido, assumir PENDING
    if (!data.status || typeof data.status !== 'string') {
      console.warn('Status inválido recebido da API:', data);
      return 'PENDING';
    }
    
    return data.status as PaymentStatus;
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    // Em caso de erro, assumir que o pagamento ainda está pendente
    return 'PENDING';
  }
};

// Add the generatePixPayment function to fix the import error
export const generatePixPayment = async (billingData: any) => {
  try {
    console.log('Generating PIX payment with data:', billingData);
    
    const response = await fetch('/api/create-asaas-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ billingData }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate PIX payment: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating PIX payment:', error);
    throw error;
  }
};
