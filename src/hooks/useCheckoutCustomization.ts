
import { useState, useEffect } from 'react';
import { CheckoutCustomization, Product } from '@/types/checkout';

// Default customization values
const defaultCustomization: CheckoutCustomization = {
  buttonColor: '#F2FCE2', // Updated to soft green
  buttonText: 'Finalizar Compra',
  headingColor: '#6E59A5',
  bannerImageUrl: null,
  topMessage: 'Oferta por tempo limitado!',
  countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  isDigitalProduct: true
};

export const useCheckoutCustomization = (product?: Product) => {
  const [customization, setCustomization] = useState<CheckoutCustomization>(defaultCustomization);
  
  useEffect(() => {
    if (product) {
      // Update customization based on product
      setCustomization({
        ...defaultCustomization,
        isDigitalProduct: product.isDigital ?? true
      });
      
      // In a real app, you would fetch the customization from your API/database
      // based on the product or merchant settings
    }
  }, [product]);
  
  return customization;
};
