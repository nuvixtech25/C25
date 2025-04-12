
import { useState, useEffect } from 'react';
import { CheckoutCustomization, Product } from '@/types/checkout';

// Default customization values
const defaultCustomization: CheckoutCustomization = {
  buttonColor: '#22c55e', // Verde mais forte
  buttonText: 'Finalizar Compra',
  headingColor: '#ffffff',
  bannerImageUrl: null,
  topMessage: 'Oferta por tempo limitado!',
  countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  isDigitalProduct: true,
  bannerColor: '#000000' // Cor padrão do banner
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
