
export interface CustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

export interface BillingData {
  customer: CustomerData;
  value: number;
  description: string;
}

export interface PixPaymentData {
  paymentId: string;
  qrCode: string;
  qrCodeImage: string;
  copyPasteKey: string;
  expirationDate: string;
  status: PaymentStatus;
  value: number;
  description: string;
}

export type PaymentStatus = 
  | "PENDING" 
  | "RECEIVED" 
  | "CONFIRMED" 
  | "OVERDUE" 
  | "REFUNDED" 
  | "CANCELLED";

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  comment: string;
}

export interface CreditCardData {
  holderName: string;
  number: string;
  expiryDate: string;
  cvv: string;
}

export interface CheckoutCustomization {
  buttonColor: string;
  buttonText: string;
  headingColor: string;
  bannerImageUrl: string | null;
  topMessage: string | null;
  countdownEndTime: string | null;
  isDigitalProduct: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isDigital?: boolean;
  imageUrl?: string;
  status?: boolean;
  type?: 'digital' | 'physical';
  slug?: string;
}

export type PaymentMethod = "creditCard" | "pix";

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
}
