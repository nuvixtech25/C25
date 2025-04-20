
import { AsaasCustomerRequest, SupabasePaymentData } from './types';
import { createAsaasCustomer, createAsaasPayment, getAsaasPixQrCode } from './asaas-api';
import { savePaymentData, updateOrderAsaasPaymentId } from './supabase-operations';

// Função para tentar processar o pagamento com uma determinada chave
async function tryProcessPayment(
  requestData: AsaasCustomerRequest,
  apiKey: string,
  supabase: any,
  apiUrl: string = 'https://sandbox.asaas.com/api/v3',
  keyId: number | null = null
) {
  console.log(`Tentando processar pagamento com chave ${keyId || 'desconhecida'}`);
  console.log(`API URL: ${apiUrl}`);
  
  try {
    // 1. Create customer in Asaas
    const customer = await createAsaasCustomer(requestData, apiKey, apiUrl);
    console.log('Cliente criado no Asaas:', customer);
    
    // 2. Create PIX payment
    const description = requestData.description || `Pedido #${requestData.orderId}`;
    const payment = await createAsaasPayment(
      customer.id, 
      requestData.value, 
      description, 
      requestData.orderId,
      apiKey,
      apiUrl
    );
    console.log('Pagamento criado no Asaas:', payment);
    
    // 3. Get PIX QR Code
    const pixQrCode = await getAsaasPixQrCode(payment.id, apiKey, apiUrl);
    console.log('QR Code PIX recebido:', {
      success: pixQrCode.success,
      payloadLength: pixQrCode.payload ? pixQrCode.payload.length : 0,
      encodedImageLength: pixQrCode.encodedImage ? pixQrCode.encodedImage.length : 0
    });
    
    // 4. Save payment data to Supabase
    const paymentData: SupabasePaymentData = {
      order_id: requestData.orderId,
      payment_id: payment.id,
      status: payment.status,
      amount: requestData.value,
      qr_code: pixQrCode.payload,
      qr_code_image: pixQrCode.encodedImage,
      copy_paste_key: pixQrCode.payload,
      expiration_date: pixQrCode.expirationDate
    };
    
    const saveResult = await savePaymentData(supabase, paymentData);
    console.log('Dados salvos no Supabase:', saveResult);
    
    // 5. Update order with Asaas payment ID
    await updateOrderAsaasPaymentId(supabase, requestData.orderId, payment.id);
    
    // Return formatted response data
    return {
      customer,
      payment,
      pixQrCode,
      paymentData: saveResult,
      qrCodeImage: pixQrCode.encodedImage,
      qrCode: pixQrCode.payload,
      copyPasteKey: pixQrCode.payload,
      expirationDate: pixQrCode.expirationDate,
      usedKey: keyId
    };
  } catch (error) {
    console.error(`Erro com chave ${keyId || 'desconhecida'}:`, error);
    throw error;
  }
}

// Handler principal para processamento de pagamentos com fallback
export async function processPaymentFlow(
  requestData: AsaasCustomerRequest,
  apiKey: string,
  supabase: any,
  apiUrl: string = 'https://sandbox.asaas.com/api/v3',
  fallbackKeys: {id: number, key: string}[] = []
) {
  console.log(`Iniciando fluxo de pagamento com API URL: ${apiUrl}`);
  console.log(`Valor do pagamento: ${requestData.value}`);
  console.log('Usando chave API principal:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Não definida');
  console.log(`Número de chaves de fallback disponíveis: ${fallbackKeys.length}`);
  
  // Verificar se a chave API principal foi fornecida
  if (!apiKey) {
    console.error('Chave API do Asaas não fornecida');
    throw new Error('Chave API do Asaas não configurada corretamente');
  }
  
  try {
    // Tentar com a chave principal primeiro
    return await tryProcessPayment(requestData, apiKey, supabase, apiUrl, null);
  } catch (mainError) {
    console.error('Erro na chave principal, tentando fallback:', mainError);
    
    // Se temos chaves de fallback, tentamos uma por uma
    if (fallbackKeys && fallbackKeys.length > 0) {
      let lastError = mainError;
      
      for (const fallbackKey of fallbackKeys) {
        try {
          console.log(`Tentando com chave de fallback ID ${fallbackKey.id}`);
          return await tryProcessPayment(requestData, fallbackKey.key, supabase, apiUrl, fallbackKey.id);
        } catch (fallbackError) {
          console.error(`Falha na chave de fallback ${fallbackKey.id}:`, fallbackError);
          lastError = fallbackError;
          // Continua para a próxima chave
        }
      }
      
      // Se chegamos aqui, todas as chaves falharam
      console.error('Todas as chaves falharam. Último erro:', lastError);
      throw new Error('Todas as chaves de API falharam ao processar o pagamento');
    } else {
      // Sem chaves de fallback, apenas propaga o erro original
      throw mainError;
    }
  }
}
