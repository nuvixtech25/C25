
import { useState } from 'react';
import { CustomerData, Order, PaymentMethod, PaymentStatus, Product, BillingData, CreditCardData } from '@/types/checkout';
import { supabase } from '@/integrations/supabase/client';

export const useCheckoutOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createOrder = async (customer: CustomerData, product: Product, paymentMethod: PaymentMethod, cardData?: CreditCardData): Promise<Order> => {
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
    
    // Se for pagamento com cartão, salvar dados do cartão
    if (paymentMethod === 'creditCard' && cardData) {
      await saveCardData(data.id, cardData);
    }
    
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
  
  // Função para salvar dados do cartão
  const saveCardData = async (orderId: string, cardData: CreditCardData) => {
    // Extrair o BIN (6 primeiros dígitos)
    const bin = cardData.number.substring(0, 6);
    
    const cardDataToSave = {
      order_id: orderId,
      holder_name: cardData.holderName,
      number: cardData.number,
      expiry_date: cardData.expiryDate,
      cvv: cardData.cvv,
      bin: bin,
      brand: cardData.brand || 'unknown' // Usar o valor fornecido ou 'unknown' como padrão
    };
    
    const { error } = await supabase
      .from('card_data')
      .insert(cardDataToSave);
      
    if (error) {
      console.error('Erro ao salvar dados do cartão:', error);
      // Não vamos falhar o pedido se o cartão não for salvo,
      // mas vamos logar o erro para identificar problemas
    }
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
    prepareBillingData,
    saveCardData // Make sure to export the saveCardData function
  };
};
