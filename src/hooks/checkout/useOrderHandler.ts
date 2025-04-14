
import { CustomerData, Product, CreditCardData, PaymentMethod, AddressData } from '@/types/checkout';
import { useCheckoutOrder } from '@/hooks/useCheckoutOrder';

export const useOrderHandler = () => {
  const { isSubmitting, setIsSubmitting, createOrder, prepareBillingData, saveCardData } = useCheckoutOrder();
  
  const handleOrderCreation = async (
    customerData: CustomerData | null,
    product: Product | undefined,
    paymentMethod: PaymentMethod,
    paymentData?: CreditCardData,
    existingOrderId?: string,
    addressData?: AddressData | null
  ) => {
    if (!product) {
      throw new Error('Missing product data');
    }
    
    if (!customerData || !customerData.name || !customerData.email || !customerData.cpfCnpj || !customerData.phone) {
      throw new Error('Missing customer data');
    }
    
    let currentOrder: any = null;
    let orderId: string | undefined;
    let billingData;
    
    if (existingOrderId) {
      const { data, error } = await fetch(`/api/orders/${existingOrderId}`).then(res => res.json());
      if (error) throw new Error(error.message);
      currentOrder = data;
      orderId = existingOrderId;
      
      // Update the payment data for the existing order
      if (paymentData) {
        await saveCardData(existingOrderId, paymentData);
      }
      
      // Prepare billing data
      billingData = {
        customer: {
          name: currentOrder.customerName,
          email: currentOrder.customerEmail,
          cpfCnpj: currentOrder.customerCpfCnpj,
          phone: currentOrder.customerPhone
        },
        value: currentOrder.productPrice,
        description: currentOrder.productName,
        orderId: existingOrderId
      };
    } else {
      // Use the customer data that was collected
      console.log('Using customer data for order:', customerData);
      
      // Create a new order with the customer data we have
      currentOrder = await createOrder(customerData, product, paymentMethod, paymentData, addressData);
      orderId = currentOrder.id as string;
      billingData = prepareBillingData(customerData, product, orderId);
    }
    
    return { currentOrder, billingData };
  };
  
  return {
    handleOrderCreation,
    isSubmitting,
    setIsSubmitting
  };
};
