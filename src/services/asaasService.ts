
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
      // Tentar obter resposta como texto primeiro para debug
      const errorText = await response.text();
      console.error("Resposta de erro bruta:", errorText);
      
      // Tentar parsear como JSON se possível
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        throw new Error(`Erro ao gerar pagamento PIX: ${JSON.stringify(errorData)}`);
      } catch (parseError) {
        // Se não for JSON, use o texto bruto
        throw new Error(`Erro ao gerar pagamento PIX: ${errorText.substring(0, 200)}`);
      }
    }

    // Verificar se a resposta pode ser parseada como JSON
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Erro ao parsear resposta como JSON:", responseText.substring(0, 200));
      throw new Error("Resposta inválida do servidor. Não foi possível processar o pagamento.");
    }
    
    // Verificar se todos os dados necessários estão presentes
    if (!data.payment || !data.pixQrCode) {
      console.error("Resposta incompleta:", data);
      throw new Error("Dados de pagamento incompletos na resposta do servidor.");
    }
    
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
      // Tentar obter resposta como texto primeiro para debug
      const errorText = await response.text();
      console.error("Resposta de erro bruta:", errorText);
      
      // Tentar parsear como JSON se possível
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        throw new Error(`Erro ao verificar status do pagamento: ${JSON.stringify(errorData)}`);
      } catch (parseError) {
        // Se não for JSON, use o texto bruto
        throw new Error(`Erro ao verificar status do pagamento: ${errorText.substring(0, 200)}`);
      }
    }
    
    // Verificar se a resposta pode ser parseada como JSON
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Erro ao parsear resposta como JSON:", responseText.substring(0, 200));
      throw new Error("Resposta inválida do servidor. Não foi possível verificar o status do pagamento.");
    }
    
    if (!data.status) {
      console.error("Resposta incompleta:", data);
      throw new Error("Dados de status incompletos na resposta do servidor.");
    }
    
    return data.status as PaymentStatus;
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
    throw new Error("Falha ao verificar status do pagamento. Por favor, tente novamente.");
  }
};
