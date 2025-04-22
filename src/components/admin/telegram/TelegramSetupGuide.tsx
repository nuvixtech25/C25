
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const TelegramSetupGuide: React.FC = () => {
  return (
    <Accordion type="single" collapsible defaultValue="telegram-setup">
      <AccordionItem value="telegram-setup">
        <AccordionTrigger>Como configurar o Bot do Telegram</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>1. Acesse <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">@BotFather</a> no Telegram</p>
            <p>2. Use o comando /newbot para criar um bot</p>
            <p>3. Escolha um nome e username para o bot</p>
            <p>4. Copie o Token de Acesso gerado</p>
            <p>5. Envie uma mensagem para seu bot no Telegram</p>
            <p>6. Acesse <code>https://api.telegram.org/bot&lt;SEU_TOKEN&gt;/getUpdates</code> no navegador</p>
            <p>7. Copie o número de chat_id da resposta</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
