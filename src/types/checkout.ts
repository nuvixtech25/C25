
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
  qrCode: string;
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
  isDigital: boolean;
  imageUrl?: string;
}

export type PaymentMethod = "creditCard" | "pix";
