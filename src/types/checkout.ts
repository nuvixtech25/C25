
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
