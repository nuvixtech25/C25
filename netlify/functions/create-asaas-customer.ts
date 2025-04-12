
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// ===== INTERFACES =====
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

interface SupabasePaymentData {
  order_id: string;
  payment_id: string;
  status: string;
  amount: number;
  qr_code: string;
  qr_code_image: string;
  copy_paste_key: string;
  expiration_date: string;
}

// ===== CONSTANTS =====
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';

// ===== ERROR HANDLING =====
class AsaasApiError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "AsaasApiError";
  }
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

// ===== MAIN HANDLER =====
export const handler: Handler = async (event) => {
  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return createErrorResponse(405, 'Método não permitido. Use POST.');
    }

    // Validate environment variables
    const { supabaseUrl, supabaseServiceKey, asaasApiKey } = validateEnvironmentVariables();

    // Initialize Supabase client
    console.log('Inicializando cliente Supabase...');
    console.log(`URL Supabase: ${supabaseUrl.substring(0, 10)}...`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse and validate request data
    const requestData = parseAndValidateRequestData(event);
    console.log('Dados recebidos:', requestData);

    // Main process flow
    const result = await processPaymentFlow(requestData, asaasApiKey, supabase);

    // Return successful response
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Erro na função:', error);
    
    // Create appropriate error response
    return createErrorResponse(
      error instanceof ConfigurationError ? 400 : 500,
      error.message || 'Erro interno no servidor',
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    );
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Validates required environment variables
 */
function validateEnvironmentVariables() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const asaasApiKey = process.env.ASAAS_API_KEY;
  
  // Check for missing environment variables
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('SUPABASE_URL');
  if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!asaasApiKey) missingVars.push('ASAAS_API_KEY');
  
  if (missingVars.length > 0) {
    throw new ConfigurationError(`Configuração incompleta. Faltam variáveis de ambiente: ${missingVars.join(', ')}`);
  }
  
  return { supabaseUrl, supabaseServiceKey, asaasApiKey };
}

/**
 * Parses and validates the request data
 */
function parseAndValidateRequestData(event: any): AsaasCustomerRequest {
  try {
    const requestData = JSON.parse(event.body || '{}') as AsaasCustomerRequest;
    
    // Check for required fields
    const requiredFields = ['name', 'cpfCnpj', 'email', 'phone', 'orderId', 'value'];
    const missingFields = requiredFields.filter(field => !requestData[field]);
    
    if (missingFields.length > 0) {
      throw new ConfigurationError(`Dados incompletos. Campos obrigatórios: ${missingFields.join(', ')}`);
    }
    
    return requestData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ConfigurationError('Formato de JSON inválido na requisição');
    }
    throw error;
  }
}

/**
 * Creates a standardized error response
 */
function createErrorResponse(statusCode: number, message: string, stack?: string) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      error: message,
      stack: stack
    }),
  };
}

/**
 * Main processing flow for payment creation
 */
async function processPaymentFlow(
  requestData: AsaasCustomerRequest,
  apiKey: string,
  supabase: any
) {
  // 1. Create customer in Asaas
  const customer = await createAsaasCustomer(requestData, apiKey);
  console.log('Cliente criado no Asaas:', customer);
  
  // 2. Create PIX payment
  const description = requestData.description || `Pedido #${requestData.orderId}`;
  const payment = await createAsaasPayment(
    customer.id, 
    requestData.value, 
    description, 
    requestData.orderId,
    apiKey
  );
  console.log('Pagamento criado no Asaas:', payment);
  
  // 3. Get PIX QR Code
  const pixQrCode = await getAsaasPixQrCode(payment.id, apiKey);
  console.log('QR Code PIX recebido:', {
    success: pixQrCode.success,
    payloadLength: pixQrCode.payload ? pixQrCode.payload.length : 0,
    encodedImageLength: pixQrCode.encodedImage ? pixQrCode.encodedImage.length : 0
  });
  
  // 4. Save payment data to Supabase
  const paymentData = {
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
    expirationDate: pixQrCode.expirationDate
  };
}

/**
 * Creates a customer in Asaas
 */
async function createAsaasCustomer(
  data: AsaasCustomerRequest, 
  apiKey: string
): Promise<AsaasCustomerResponse> {
  // Format phone: remove all non-numeric characters
  const formattedPhone = data.phone.replace(/\D/g, '');
  
  const customerData = {
    name: data.name,
    cpfCnpj: data.cpfCnpj.replace(/\D/g, ''), // Remove non-numeric characters
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
      const errorResponse = await handleApiError(response, 'criar cliente no Asaas');
      throw new AsaasApiError(`Erro ao criar cliente no Asaas: ${errorResponse.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
}

/**
 * Creates a PIX payment in Asaas
 */
async function createAsaasPayment(
  customerId: string, 
  value: number, 
  description: string,
  externalReference: string,
  apiKey: string
): Promise<AsaasPaymentResponse> {
  // Set due date to today
  const today = new Date();
  const dueDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  
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
      const errorResponse = await handleApiError(response, 'criar pagamento PIX no Asaas');
      throw new AsaasApiError(`Erro ao criar pagamento PIX no Asaas: ${errorResponse.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }
}

/**
 * Gets the PIX QR Code for a payment
 */
async function getAsaasPixQrCode(
  paymentId: string, 
  apiKey: string
): Promise<AsaasPixQrCodeResponse> {
  try {
    console.log(`Requesting QR code for payment ID: ${paymentId}`);
    
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      }
    });
    
    if (!response.ok) {
      const errorResponse = await handleApiError(response, 'buscar QR Code PIX');
      throw new AsaasApiError(`Erro ao buscar QR Code PIX: ${errorResponse.message}`);
    }
    
    const data = await response.json();
    
    // Log information about the QR code
    console.log(`QR code received successfully. Encoded image length: ${data.encodedImage ? data.encodedImage.length : 0}`);
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar QR Code:', error);
    throw error;
  }
}

/**
 * Handles API errors
 */
async function handleApiError(response: Response, operation: string) {
  const errorText = await response.text();
  let errorData;
  
  try {
    errorData = JSON.parse(errorText);
  } catch (e) {
    errorData = { message: errorText };
  }
  
  console.error(`Erro ao ${operation}:`, errorData);
  return errorData;
}

/**
 * Saves payment data to Supabase
 */
async function savePaymentData(supabase: any, data: SupabasePaymentData) {
  try {
    console.log('Salvando dados de pagamento no Supabase...');
    console.log(`Order ID: ${data.order_id}, Payment ID: ${data.payment_id}`);
    
    const { data: result, error } = await supabase
      .from('asaas_payments')
      .insert(data)
      .select();
    
    if (error) {
      console.error('Erro detalhado ao salvar no Supabase:', error);
      throw new Error(`Erro ao salvar dados no Supabase: ${error.message}`);
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao salvar pagamento:', error);
    throw error;
  }
}

/**
 * Updates the order with the Asaas payment ID
 */
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
