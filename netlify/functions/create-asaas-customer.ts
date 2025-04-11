import { Handler } from '@netlify/functions';
import { supabaseAdmin } from '../../src/lib/supabase/initServer';

// Tipos para o request e response
interface AsaasCustomerRequest {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  orderId: string;
  value: number;
  description?: string;
}

interface AsaasCustomerResponse {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

interface AsaasPaymentResponse {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  status: string;
  dueDate: string;
  paymentDate?: string;
  description: string;
  billingType: string;
  invoiceUrl: string;
  externalReference: string;
}

interface AsaasPixQrCodeResponse {
  success: boolean;
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

// Função principal que recebe a requisição
export const handler: Handler = async (event) => {
  // Verificar se o método é POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' }),
    };
  }

  // Verificar variáveis de ambiente necessárias de forma defensiva
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const asaasApiKey = process.env.ASAAS_API_KEY;
  
  // Verificação completa das variáveis necessárias
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('SUPABASE_URL');
  if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!asaasApiKey) missingVars.push('ASAAS_API_KEY');
  
  if (missingVars.length > 0) {
    console.error(`Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: `Configuração incompleta. Faltam variáveis de ambiente: ${missingVars.join(', ')}` 
      }),
    };
  }
  
  // We're already initializing the client in supabaseAdmin, so we don't need this section anymore
  // but we'll keep the logging
  console.log('Inicializando cliente Supabase...');
  console.log(`URL Supabase: ${supabaseUrl.substring(0, 10)}...`); // Log parcial por segurança

  try {
    // Parsear o corpo da requisição
    const requestData = JSON.parse(event.body || '{}') as AsaasCustomerRequest;
    
    // Validar os dados obrigatórios
    if (!requestData.name || !requestData.cpfCnpj || !requestData.email || 
        !requestData.phone || !requestData.orderId || !requestData.value) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Dados incompletos. Verifique os campos obrigatórios.' }),
      };
    }

    console.log('Dados recebidos:', requestData);

    // 1. Criar o cliente no Asaas
    const customer = await createAsaasCustomer(requestData, asaasApiKey);
    console.log('Cliente criado no Asaas:', customer);
    
    // 2. Criar o pagamento PIX
    const description = requestData.description || `Pedido #${requestData.orderId}`;
    const payment = await createAsaasPayment(
      customer.id, 
      requestData.value, 
      description, 
      requestData.orderId,
      asaasApiKey
    );
    console.log('Pagamento criado no Asaas:', payment);
    
    // 3. Buscar o QR Code do PIX
    const pixQrCode = await getAsaasPixQrCode(payment.id, asaasApiKey);
    console.log('QR Code PIX gerado');
    
    // 4. Salvar os dados no Supabase (tabela asaas_payments)
    const saveResult = await savePaymentData(
      supabaseAdmin,
      requestData.orderId,
      payment.id,
      payment.status,
      requestData.value,
      pixQrCode.payload,
      pixQrCode.encodedImage,
      pixQrCode.payload,
      pixQrCode.expirationDate
    );
    console.log('Dados salvos no Supabase:', saveResult);
    
    // 5. Atualizar o pedido com o ID do pagamento Asaas
    await updateOrderAsaasPaymentId(supabaseAdmin, requestData.orderId, payment.id);
    
    // Retornar os dados do pagamento e QR Code
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        payment,
        pixQrCode,
        paymentData: saveResult
      }),
    };
    
  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message || 'Erro interno no servidor',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
};

// Configuração da API Asaas atualizada
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';

// Função para criar um cliente no Asaas
async function createAsaasCustomer(
  data: AsaasCustomerRequest, 
  apiKey: string
): Promise<AsaasCustomerResponse> {
  // Formatar telefone: remover todos os caracteres não numéricos
  const formattedPhone = data.phone.replace(/\D/g, '');
  
  const customerData = {
    name: data.name,
    cpfCnpj: data.cpfCnpj.replace(/\D/g, ''), // Remover caracteres não numéricos
    email: data.email,
    phone: formattedPhone,
    mobilePhone: formattedPhone,
    notificationDisabled: false
  };
  
  try {
    const response = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      throw new Error(`Erro ao criar cliente no Asaas: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
}

// Função para criar um pagamento PIX no Asaas
async function createAsaasPayment(
  customerId: string, 
  value: number, 
  description: string,
  externalReference: string,
  apiKey: string
): Promise<AsaasPaymentResponse> {
  // Definir data de vencimento como hoje
  const today = new Date();
  const dueDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
  const paymentData = {
    customer: customerId,
    billingType: 'PIX',
    value: value,
    dueDate: dueDate,
    description: description,
    externalReference: externalReference,
    postalService: false
  };
  
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      throw new Error(`Erro ao criar pagamento PIX no Asaas: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
}

// Função para buscar o QR Code do PIX
async function getAsaasPixQrCode(
  paymentId: string, 
  apiKey: string
): Promise<AsaasPixQrCodeResponse> {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      throw new Error(`Erro ao buscar QR Code PIX: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar QR Code:', error);
    throw error;
  }
}

// Função para salvar os dados do pagamento no Supabase
async function savePaymentData(
  supabase: any,
  orderId: string,
  paymentId: string,
  status: string,
  amount: number,
  qrCode: string,
  qrCodeImage: string,
  copyPasteKey: string,
  expirationDate: string
) {
  try {
    console.log('Salvando dados de pagamento no Supabase...');
    console.log(`Order ID: ${orderId}, Payment ID: ${paymentId}`);
    
    const { data, error } = await supabase
      .from('asaas_payments')
      .insert({
        order_id: orderId,
        payment_id: paymentId,
        status: status,
        amount: amount,
        qr_code: qrCode,
        qr_code_image: qrCodeImage,
        copy_paste_key: copyPasteKey,
        expiration_date: expirationDate
      })
      .select();
    
    if (error) {
      console.error('Erro detalhado ao salvar no Supabase:', error);
      throw new Error(`Erro ao salvar dados no Supabase: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao salvar pagamento:', error);
    throw error;
  }
}

// Função para atualizar o ID do pagamento Asaas no pedido
async function updateOrderAsaasPaymentId(supabase: any, orderId: string, paymentId: string) {
  try {
    console.log(`Atualizando pedido ${orderId} com payment ID ${paymentId}`);
    
    const { error } = await supabase
      .from('orders')
      .update({ asaas_payment_id: paymentId })
      .eq('id', orderId);
    
    if (error) {
      console.error('Erro detalhado ao atualizar pedido:', error);
      throw new Error(`Erro ao atualizar pedido no Supabase: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }
}
