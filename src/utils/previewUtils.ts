
import { CheckoutCustomizationSettings } from '@/types/customization';
import { Product } from '@/types/checkout';

// Function to create the URL of checkout preview
export const createPreviewUrl = (settings: CheckoutCustomizationSettings): string => {
  let url = `/checkout/preview?buttonColor=${encodeURIComponent(settings.buttonColor)}&buttonText=${encodeURIComponent(settings.buttonText)}&headingColor=${encodeURIComponent(settings.headingColor)}&topMessage=${encodeURIComponent(settings.topMessage)}&countdownEndTime=${encodeURIComponent(settings.countdownEndTime)}&isDigitalProduct=${settings.isDigitalProduct}`;
  
  if (settings.bannerImageUrl) {
    url += `&bannerImageUrl=${encodeURIComponent(settings.bannerImageUrl)}`;
  }
  
  return url;
};

// Function to get demo product for preview
export const getDemoProduct = (): Product => {
  return {
    id: 'demo-product',
    name: 'Produto de Demonstração',
    description: 'Este é um produto para visualização do checkout',
    price: 99.90,
    imageUrl: 'https://via.placeholder.com/300x200',
    isDigital: true
  };
};
