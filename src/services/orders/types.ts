
import { PaymentStatus } from "@/types/checkout";

export interface GetOrdersParams {
  paymentMethod: "pix" | "creditCard";
  status: PaymentStatus | "ALL";
  startDate?: Date;
  endDate?: Date;
}

export interface OrderTransformed {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpfCnpj: string;
  customerId: string;
  productName: string;
  productPrice: number;
  paymentMethod: string;
  createdAt: string;
  status: string;
  asaasPaymentId: string | null;
  [key: string]: any;
}

export interface DeleteOrderResult {
  success: boolean;
  count?: number;
  errors?: Array<{ orderId: string; error: string }>;
}
