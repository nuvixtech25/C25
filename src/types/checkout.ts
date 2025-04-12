
// Payment related types
export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'RECEIVED' | 'OVERDUE' | 'REFUNDED' | 'CANCELLED';
export type PaymentMethod = 'pix' | 'creditCard';

// Credit card related types
export interface CreditCardData {
  holderName: string;
  number: string;
  expiryDate: string;
  cvv: string;
  brand?: string;
  bin?: string;
  createdAt?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type?: 'digital' | 'physical';
  isDigital?: boolean;
  imageUrl?: string;
  has_whatsapp_support?: boolean;
  whatsapp_number?: string;
  slug?: string;
  status?: boolean;
}

// Customer data
export interface CustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

// Order and payment related interfaces
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

// Pix payment data
export interface PixPaymentData {
  paymentId: string;
  qrCode: string;
  qrCodeImage: string;
  copyPasteKey: string;
  expirationDate: string;
  value: number;
  description: string;
}

// Billing data
export interface BillingData {
  customer: CustomerData;
  value: number;
  description: string;
  orderId: string;
}

// UI Customization
export interface CheckoutCustomization {
  buttonColor: string;
  buttonText: string;
  headingColor: string;
  bannerImageUrl: string | null;
  topMessage: string;
  countdownEndTime: string;
  isDigitalProduct: boolean;
}

// Testimonial
export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  comment: string;
}

// Payment method data (used in checkout form)
export interface PaymentMethodData {
  id: string;
  name: string;
  icon: React.ReactNode;
}
