
import React, { useEffect } from 'react';
import { MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  hasWhatsappSupport: boolean;
  whatsappNumber?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  hasWhatsappSupport, 
  whatsappNumber 
}) => {
  useEffect(() => {
    console.log('[WhatsAppButton] Rendering with props:', { 
      hasWhatsappSupport, 
      whatsappNumber,
      hasWhatsappSupportType: typeof hasWhatsappSupport,
      whatsappNumberType: typeof whatsappNumber
    });
  }, [hasWhatsappSupport, whatsappNumber]);

  // Enhanced validation with more detailed logging
  if (!hasWhatsappSupport || !whatsappNumber) {
    console.log('[WhatsAppButton] Not rendering - validation failed', {
      hasWhatsappSupport,
      whatsappNumber,
      hasWhatsappSupportType: typeof hasWhatsappSupport,
      whatsappNumberLength: whatsappNumber?.length || 0
    });
    return null;
  }

  const formatWhatsAppUrl = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '') || '';
    console.log('[WhatsAppButton] Creating WhatsApp URL with number:', cleanNumber);
    const url = `https://wa.me/${cleanNumber}?text=Olá! Acabei de adquirir um produto e gostaria de obter mais informações.`;
    return url;
  };

  return (
    <Button 
      asChild 
      variant="outline"
      className="w-full border-green-500 bg-white hover:bg-green-50 text-green-600 transition-colors px-6 py-3 h-auto text-lg rounded-lg shadow-sm mt-2"
    >
      <a 
        href={formatWhatsAppUrl()} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        Falar no WhatsApp
        <MessageCircleIcon className="ml-2 h-5 w-5" />
      </a>
    </Button>
  );
};
