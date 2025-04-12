
import React, { useEffect } from 'react';
import { MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
  forceShow?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  hasWhatsappSupport, 
  whatsappNumber,
  forceShow = false
}) => {
  useEffect(() => {
    console.log('[WhatsAppButton] Rendering with props:', { 
      hasWhatsappSupport, 
      whatsappNumber,
      forceShow,
      hasWhatsappSupportType: typeof hasWhatsappSupport,
      whatsappNumberType: typeof whatsappNumber
    });
  }, [hasWhatsappSupport, whatsappNumber, forceShow]);

  // More lenient check - show by default on failed payment page
  const shouldShowButton = forceShow || Boolean(hasWhatsappSupport || whatsappNumber);
  
  if (!shouldShowButton) {
    console.log('[WhatsAppButton] Not rendering - button conditions failed:', {
      hasWhatsappSupport,
      whatsappNumber,
      forceShow
    });
    return null;
  }

  const formatWhatsAppUrl = () => {
    // Default to a fallback number if none provided but support is enabled
    const numberToUse = whatsappNumber || '5511999999999';
    const cleanNumber = numberToUse.replace(/\D/g, '') || '';
    console.log('[WhatsAppButton] Creating WhatsApp URL with number:', cleanNumber);
    const url = `https://wa.me/${cleanNumber}?text=Olá! Acabei de tentar fazer uma compra e tive um problema. Gostaria de obter ajuda.`;
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
