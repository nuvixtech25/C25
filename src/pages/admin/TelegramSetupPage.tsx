
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send } from 'lucide-react'; // Changed from Telegram to Send

const TelegramSetupPage: React.FC = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');

  const saveTelegramSettings = async () => {
    try {
      // Save Bot Token
      await supabase
        .from('settings')
        .upsert({ key: 'telegram_bot_token', value: botToken }, { onConflict: 'key' });

      // Save Chat ID  
      await supabase
        .from('settings')
        .upsert({ key: 'telegram_chat_id', value: chatId }, { onConflict: 'key' });

      toast.success('Configurações do Telegram salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações do Telegram');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Send className="mr-2" /> Configuração do Telegram
      </h1>

      <Accordion type="single" collapsible>
        <AccordionItem value="telegram-setup">
          <AccordionTrigger>Como configurar o Bot do Telegram</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>1. Acesse <a href="https://t.me/BotFather" target="_blank" className="text-blue-500 underline">@BotFather</a> no Telegram</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Telegram</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Bot Token</label>
            <Input 
              placeholder="Digite o token do seu Bot Telegram"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Chat ID</label>
            <Input 
              placeholder="Digite o Chat ID"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
          </div>
          <Button 
            onClick={saveTelegramSettings}
            disabled={!botToken || !chatId}
          >
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramSetupPage;
