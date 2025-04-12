import React, { useEffect, useState } from 'react';
import CheckoutHeader from './CheckoutHeader';
import CheckoutFooter from './CheckoutFooter';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CheckoutContainerProps {
  children: React.ReactNode;
}

interface CheckoutCustomization {
  button_color?: string;
  button_text_color?: string;
  button_text?: string;
  header_message?: string;
  banner_image_url?: string;
  show_banner?: boolean;
  heading_color?: string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ children }) => {
  const { toast } = useToast();
  const [customization, setCustomization] = useState<CheckoutCustomization>({
    button_color: '#3b82f6',
    button_text_color: '#ffffff',
    button_text: 'Finalizar Pagamento',
    header_message: 'Oferta por tempo limitado!',
    banner_image_url: '',
    show_banner: true,
    heading_color: '#000000'
  });
  const [isCustomizationLoaded, setIsCustomizationLoaded] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const { data, error } = await supabase
          .from('checkout_customization')
          .select('button_color, button_text_color, button_text, header_message, banner_image_url, show_banner, heading_color')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching checkout customization:', error);
          toast({
            title: "Erro ao carregar",
            description: "Erro ao carregar as configurações do checkout. Verifique o console para mais detalhes.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setCustomization(data as CheckoutCustomization);
        }
      } catch (err) {
        console.error('Failed to fetch checkout customization', err);
        toast({
          title: "Erro ao carregar",
          description: "Erro ao carregar as configurações do checkout. Verifique o console para mais detalhes.",
          variant: "destructive",
        });
      } finally {
        setIsCustomizationLoaded(true);
      }
    };

    fetchCustomization();
  }, [toast]);

  // Add CSS variables for checkout button styling
  const customStyles = {
    '--button-color': customization.button_color || '#3b82f6',
    '--button-text-color': customization.button_text_color || '#ffffff',
    '--button-text': `'${customization.button_text || 'Finalizar Pagamento'}'`,
    '--heading-color': customization.heading_color || '#000000',
  } as React.CSSProperties;

  // Show a simple loading state while customization is loading
  if (!isCustomizationLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black touch-manipulation" style={customStyles}>
      <CheckoutHeader />
      <main className="max-w-xl mx-auto py-2 px-4">
        {children}
      </main>
      <CheckoutFooter />
    </div>
  );
};

export default CheckoutContainer;
