
import { BillingData, PaymentStatus, PixPaymentData } from "@/types/checkout";

const ASAAS_API_URL = "https://api.asaas.com/v3";
const ASAAS_API_KEY = "your_asaas_api_key"; // This should be stored in environment variables in production

// Generate PIX payment through Asaas API
export const generatePixPayment = async (billingData: BillingData): Promise<PixPaymentData> => {
  try {
    // For development demo purposes, we'll simulate the API call
    // In production, uncomment the fetch code below and use the real API
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response for development
    return {
      paymentId: `pix_${Date.now()}`,
      qrCode: "00020126330014BR.GOV.BCB.PIX0111123456789012520400005303986540510.005802BR5913ASAAS PAGTOS6008JOINVILLE62070503***6304EB4C",
      qrCodeImage: "data:image/png;base64,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",
      copyPasteKey: "00020126330014BR.GOV.BCB.PIX0111123456789012520400005303986540510.005802BR5913ASAAS PAGTOS6008JOINVILLE62070503***6304EB4C",
      expirationDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
      status: "PENDING",
      value: billingData.value,
      description: billingData.description
    };
    
    // In a production environment, use the Asaas API
    /*
    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: JSON.stringify({
        customer: billingData.customer.name,
        billingType: 'PIX',
        value: billingData.value,
        dueDate: new Date().toISOString().split('T')[0],
        description: billingData.description,
        externalReference: 'PIX_PAYMENT'
      })
    });

    if (!response.ok) {
      throw new Error(`Error creating payment: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Request the PIX QR Code
    const pixResponse = await fetch(`${ASAAS_API_URL}/payments/${responseData.id}/pixQrCode`, {
      headers: {
        'access_token': ASAAS_API_KEY
      }
    });

    if (!pixResponse.ok) {
      throw new Error(`Error generating PIX QR Code: ${pixResponse.statusText}`);
    }

    const pixData = await pixResponse.json();
    
    return {
      paymentId: responseData.id,
      qrCode: pixData.encodedImage,
      qrCodeImage: pixData.encodedImage,
      copyPasteKey: pixData.payload,
      expirationDate: pixData.expirationDate,
      status: responseData.status,
      value: responseData.value,
      description: responseData.description
    };
    */
  } catch (error) {
    console.error("Error generating PIX payment:", error);
    throw new Error("Failed to generate PIX payment. Please try again.");
  }
};

// Check payment status from Asaas API
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  try {
    // For development demo purposes, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In development, randomly return CONFIRMED or PENDING to simulate payment flow
    const statusOptions: PaymentStatus[] = ["PENDING", "CONFIRMED"];
    const randomStatus = statusOptions[Math.floor(Math.random() * 2)];
    
    return randomStatus;
    
    // In production, use this code:
    /*
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      headers: {
        'access_token': ASAAS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Error checking payment status: ${response.statusText}`);
    }

    const paymentData = await response.json();
    return paymentData.status;
    */
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw new Error("Failed to check payment status. Please try again.");
  }
};
