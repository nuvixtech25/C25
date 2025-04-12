
import { CheckoutCustomizationSettings } from '@/types/customization';

// Function to create the URL of checkout preview
export const createPreviewUrl = (settings: CheckoutCustomizationSettings): string => {
  let url = `/checkout/preview?buttonColor=${encodeURIComponent(settings.buttonColor)}&buttonText=${encodeURIComponent(settings.buttonText)}&headingColor=${encodeURIComponent(settings.headingColor)}&topMessage=${encodeURIComponent(settings.topMessage)}&countdownEndTime=${encodeURIComponent(settings.countdownEndTime)}&isDigitalProduct=${settings.isDigitalProduct}`;
  
  if (settings.bannerImageUrl) {
    url += `&bannerImageUrl=${encodeURIComponent(settings.bannerImageUrl)}`;
  }
  
  return url;
};
