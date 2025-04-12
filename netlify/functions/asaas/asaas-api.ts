
import { 
  AsaasCustomerRequest, 
  AsaasCustomerResponse, 
  AsaasPaymentResponse,
  AsaasPixQrCodeResponse,
  AsaasApiError
} from './types';

// API URL constant
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';

export async function createAsaasCustomer(
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

export async function createAsaasPayment(
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

export async function getAsaasPixQrCode(
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

export async function handleApiError(response: Response, operation: string) {
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
