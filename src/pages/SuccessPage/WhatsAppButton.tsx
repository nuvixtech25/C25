
import React, { useEffect } from 'react';
import { WhatsappIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
  fullWidth?: boolean;
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  hasWhatsappSupport, 
  whatsappNumber,
  number,
  message = "Olá! Acabei de fazer um pagamento via Pix e gostaria de confirmar o recebimento.",
  fullWidth = false
}) => {
  useEffect(() => {
    console.log('[WhatsAppButton] Detailed Rendering Props:', { 
      hasWhatsappSupport, 
      whatsappNumber,
      number,
      hasWhatsappSupportType: typeof hasWhatsappSupport,
      whatsappNumberType: typeof whatsappNumber
    });
  }, [hasWhatsappSupport, whatsappNumber, number]);

  const phoneNumber = number || whatsappNumber;
  
  // More robust check for displaying the WhatsApp button
  const shouldShowButton = Boolean(phoneNumber) && 
    (hasWhatsappSupport !== false && hasWhatsappSupport !== undefined);
  
  console.log('[WhatsAppButton] Button Visibility Checks:', {
    phoneNumber,
    hasWhatsappSupport,
    shouldShowButton
  });

  if (!shouldShowButton) {
    console.log('[WhatsAppButton] Not rendering - button conditions failed:', {
      hasWhatsappSupport,
      whatsappNumber,
      number
    });
    return null;
  }

  const formatWhatsAppUrl = () => {
    const cleanNumber = phoneNumber?.replace(/\D/g, '') || '';
    console.log('[WhatsAppButton] Creating WhatsApp URL with number:', cleanNumber);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Button 
      asChild 
      variant="outline"
      className={`border-green-500 bg-white hover:bg-green-50 text-green-600 transition-colors px-6 py-3 h-auto text-lg rounded-lg shadow-sm mt-2 ${fullWidth ? 'w-full' : ''}`}
    >
      <a 
        href={formatWhatsAppUrl()} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        Falar no WhatsApp
        <WhatsappIcon className="ml-2 h-5 w-5" />
      </a>
    </Button>
  );
};
