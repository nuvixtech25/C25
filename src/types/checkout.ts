
export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCpfCnpj: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productPrice: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  asaasPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  cardData?: CreditCardData;
  allCardData?: CreditCardData[]; // Added for multiple card attempts
  productType?: 'digital' | 'physical'; // Added to determine product type for success page
  
  // New properties for WhatsApp support
  has_whatsapp_support?: boolean;
  whatsapp_number?: string;
}
