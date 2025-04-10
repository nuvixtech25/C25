
import { useState } from 'react';
import { CustomerData, Order, PaymentMethod, PaymentStatus, Product, BillingData } from '@/types/checkout';
import { supabase } from '@/integrations/supabase/client';

export const useCheckoutOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createOrder = async (customer: CustomerData, product: Product, paymentMethod: PaymentMethod): Promise<Order> => {
    // Criar pedido no Supabase
    const order = {
      customer_id: `customer_${Date.now()}`, // No futuro, usar ID real do cliente no Asaas
      customer_name: customer.name,
      customer_email: customer.email,
      customer_cpf_cnpj: customer.cpfCnpj,
      customer_phone: customer.phone,
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      status: "PENDING" as PaymentStatus,
      payment_method: paymentMethod,
    };
    
    // Salvar no Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerCpfCnpj: data.customer_cpf_cnpj,
      customerPhone: data.customer_phone,
      productId: data.product_id,
      productName: data.product_name,
      productPrice: data.product_price,
      status: data.status as PaymentStatus,
      paymentMethod: data.payment_method as PaymentMethod,
      asaasPaymentId: data.asaas_payment_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  };
  
  const prepareBillingData = (customerData: CustomerData, product: Product, orderId: string): BillingData => {
    return {
      customer: customerData,
      value: product.price,
      description: product.name,
      orderId: orderId
    };
  };
  
  return {
    isSubmitting,
    setIsSubmitting,
    createOrder,
    prepareBillingData
  };
};
