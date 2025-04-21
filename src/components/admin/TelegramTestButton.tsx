
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Loader2 } from 'lucide-react';
import { sendTelegramNotification } from '@/lib/notifications/sendTelegramNotification';

interface TestButtonProps {
  notificationType: 'new_order' | 'payment' | 'card_data';
  label: string;
  className?: string;
}

const TelegramTestButton: React.FC<TestButtonProps> = ({ 
  notificationType, 
  label,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);

  const getTestMessage = (type: 'new_order' | 'payment' | 'card_data') => {
    const date = new Date().toLocaleString('pt-BR');
    
    switch (type) {
      case 'new_order':
        return `<b>🛍️ TESTE: Novo pedido recebido!</b>
        
ID: TEST-${Math.floor(Math.random() * 10000)}
Cliente: Cliente de Teste
Produto: Produto Digital
Valor: R$ 97,00
Data: ${date}`;

      case 'payment':
        return `<b>💰 TESTE: Pagamento confirmado!</b>
        
ID: TEST-${Math.floor(Math.random() * 10000)}
Cliente: Cliente de Teste
Produto: Produto Digital
Valor: R$ 97,00
Método: PIX
Data: ${date}`;

      case 'card_data':
        return `<b>💳 TESTE: Dados de cartão recebidos!</b>
        
ID: TEST-${Math.floor(Math.random() * 10000)}
Cliente: Cliente de Teste
Cartão: 4*** **** **** **89
Bandeira: Visa
Data: ${date}`;

      default:
        return 'Mensagem de teste do sistema.';
    }
  };

  const sendTestNotification = async () => {
    try {
      setLoading(true);
      
      const message = getTestMessage(notificationType);
      await sendTelegramNotification(message, notificationType);
      
      toast.success('Notificação de teste enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error('Erro ao enviar notificação de teste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={sendTestNotification}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <MessageSquare className="h-4 w-4 mr-2" />
      )}
      {label}
    </Button>
  );
};

export default TelegramTestButton;
