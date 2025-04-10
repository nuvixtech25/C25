
import { BillingData, PaymentStatus, PixPaymentData } from "@/types/checkout";

const ASAAS_API_URL = "https://api.asaas.com/v3";

// Gerar pagamento PIX através da nossa função Netlify
export const generatePixPayment = async (billingData: BillingData): Promise<PixPaymentData> => {
  try {
    // Chamar a função Netlify que criamos
    const response = await fetch('/.netlify/functions/create-asaas-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: billingData.customer.name,
        cpfCnpj: billingData.customer.cpfCnpj,
        email: billingData.customer.email,
        phone: billingData.customer.phone,
        orderId: billingData.orderId,
        value: billingData.value,
        description: billingData.description
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro ao gerar pagamento PIX: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Formatar os dados para o formato esperado pelo componente de pagamento
    return {
      paymentId: data.payment.id,
      qrCode: data.pixQrCode.payload,
      qrCodeImage: data.pixQrCode.encodedImage,
      copyPasteKey: data.pixQrCode.payload,
      expirationDate: data.pixQrCode.expirationDate,
      status: data.payment.status as PaymentStatus,
      value: data.payment.value,
      description: data.payment.description
    };
  } catch (error) {
    console.error("Erro ao gerar pagamento PIX:", error);
    throw new Error("Falha ao gerar pagamento PIX. Por favor, tente novamente.");
  }
};

// Verificar status do pagamento no Asaas
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  try {
    const response = await fetch(`/.netlify/functions/check-payment-status?paymentId=${paymentId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro ao verificar status do pagamento: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
    throw new Error("Falha ao verificar status do pagamento. Por favor, tente novamente.");
  }
};
