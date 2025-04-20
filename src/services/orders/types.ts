
import { Order, Product, PaymentStatus, PaymentMethod } from '@/types/checkout';

export interface GetOrdersParams {
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus | 'ALL';
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface DeleteOrderResult {
  success: boolean;
  count: number;
  errors?: Array<{ orderId: string; error: string }>;
}

export interface OrderTransformed extends Order {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf_cnpj: string;
  product_id: string;
  product_name: string;
  product_price: number;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at?: string;
}
