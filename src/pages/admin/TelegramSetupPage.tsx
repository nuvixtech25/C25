
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Send, Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface TelegramBot {
  id: number;
  name: string;
  token: string;
  chatId: string;
  enabled: boolean;
  notifyNewOrders: boolean;
  notifyPayments: boolean;
  notifyCardData: boolean;
}

const TelegramSetupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bots, setBots] = useState<TelegramBot[]>([]);

  // Fetch existing bots on load
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const { data: botsData, error: botsError } = await supabase
          .from('telegram_bots')
          .select('*')
          .order('id');
        
        if (botsError) throw botsError;
        
        setBots(botsData || []);
      } catch (error) {
        console.error('Erro ao carregar bots:', error);
        toast.error('Erro ao carregar configurações do Telegram');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchBots();
  }, []);

  const addNewBot = () => {
    // Generate a temporary negative ID to ensure it doesn't conflict with existing IDs
    const tempId = -Date.now(); 
    setBots([...bots, {
      id: tempId,
      name: `Bot ${bots.length + 1}`,
      token: '',
      chatId: '',
      enabled: true,
      notifyNewOrders: true,
      notifyPayments: true,
      notifyCardData: false
    }]);
  };

  const removeBot = (botId: number) => {
    // If it's a negative ID (new unsaved bot), just remove from state
    if (botId < 0) {
      setBots(bots.filter(bot => bot.id !== botId));
      return;
    }
    
    // If it's an existing bot, we need to delete from database
    const confirmDelete = window.confirm("Tem certeza que deseja remover este bot?");
    if (confirmDelete) {
      setLoading(true);
      
      supabase
        .from('telegram_bots')
        .delete()
        .eq('id', botId)
        .then(({ error }) => {
          if (error) {
            console.error('Erro ao remover bot:', error);
            toast.error('Erro ao remover bot');
          } else {
            setBots(bots.filter(bot => bot.id !== botId));
            toast.success('Bot removido com sucesso!');
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const updateBot = (index: number, field: keyof TelegramBot, value: any) => {
    const updatedBots = [...bots];
    updatedBots[index] = { ...updatedBots[index], [field]: value };
    setBots(updatedBots);
  };

  const saveTelegramSettings = async () => {
    try {
      setLoading(true);

      // Validate all bots before saving
      for (const bot of bots) {
        if (bot.enabled) {
          if (!bot.token || typeof bot.token !== 'string' || bot.token.trim() === '') {
            toast.error(`Por favor, configure o Token para ${bot.name}`);
            setLoading(false);
            return;
          }
          
          if (!bot.chatId || typeof bot.chatId !== 'string' || bot.chatId.trim() === '') {
            toast.error(`Por favor, configure o Chat ID para ${bot.name}`);
            setLoading(false);
            return;
          }
        }
      }

      // Prepare data for upsert
      const botsToSave = bots.map(bot => ({
        id: bot.id < 0 ? undefined : bot.id, // Remove ID for new bots so Supabase generates one
        name: bot.name,
        token: bot.token,
        chat_id: bot.chatId,
        enabled: bot.enabled,
        notify_new_orders: bot.notifyNewOrders,
        notify_payments: bot.notifyPayments,
        notify_card_data: bot.notifyCardData
      }));

      // Insert new bots (those with negative IDs)
      const newBots = botsToSave.filter(bot => bot.id === undefined);
      if (newBots.length > 0) {
        const { data: insertedData, error: insertError } = await supabase
          .from('telegram_bots')
          .insert(newBots)
          .select();
          
        if (insertError) throw insertError;
      }
      
      // Update existing bots
      const existingBots = botsToSave.filter(bot => bot.id !== undefined);
      if (existingBots.length > 0) {
        const { error: updateError } = await supabase
          .from('telegram_bots')
          .upsert(existingBots, { onConflict: 'id' });
          
        if (updateError) throw updateError;
      }

      // Refresh bots data
      const { data: refreshedBots, error: refreshError } = await supabase
        .from('telegram_bots')
        .select('*')
        .order('id');
        
      if (refreshError) throw refreshError;
      
      setBots(refreshedBots || []);
      toast.success('Configurações do Telegram salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações do Telegram');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Send className="mr-2" /> Configuração do Telegram
        </h1>
        <Button onClick={addNewBot} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Bot
        </Button>
      </div>

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

      <div className="grid gap-6">
        {bots.map((bot, index) => (
          <Card key={bot.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl">{bot.name}</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`bot-enabled-${bot.id}`}
                    checked={bot.enabled}
                    onCheckedChange={(checked) => updateBot(index, 'enabled', checked)}
                  />
                  <Label htmlFor={`bot-enabled-${bot.id}`}>Ativo</Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeBot(bot.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`name-${bot.id}`}>Nome do Bot</Label>
                <Input
                  id={`name-${bot.id}`}
                  value={bot.name}
                  onChange={(e) => updateBot(index, 'name', e.target.value)}
                  placeholder="Nome para identificação"
                />
              </div>
              <div>
                <Label htmlFor={`token-${bot.id}`}>Bot Token</Label>
                <Input
                  id={`token-${bot.id}`}
                  value={bot.token}
                  onChange={(e) => updateBot(index, 'token', e.target.value)}
                  placeholder="Digite o token do seu Bot Telegram"
                />
              </div>
              <div>
                <Label htmlFor={`chatId-${bot.id}`}>Chat ID</Label>
                <Input
                  id={`chatId-${bot.id}`}
                  value={bot.chatId}
                  onChange={(e) => updateBot(index, 'chatId', e.target.value)}
                  placeholder="Digite o Chat ID"
                />
              </div>
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-medium">Notificações</h4>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`notify-orders-${bot.id}`}
                      checked={bot.notifyNewOrders}
                      onCheckedChange={(checked) => updateBot(index, 'notifyNewOrders', checked)}
                    />
                    <Label htmlFor={`notify-orders-${bot.id}`}>Novos Pedidos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`notify-payments-${bot.id}`}
                      checked={bot.notifyPayments}
                      onCheckedChange={(checked) => updateBot(index, 'notifyPayments', checked)}
                    />
                    <Label htmlFor={`notify-payments-${bot.id}`}>Pagamentos Confirmados</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`notify-cards-${bot.id}`}
                      checked={bot.notifyCardData}
                      onCheckedChange={(checked) => updateBot(index, 'notifyCardData', checked)}
                    />
                    <Label htmlFor={`notify-cards-${bot.id}`}>Dados de Cartão</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={saveTelegramSettings}
        disabled={loading || bots.length === 0}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações
          </>
        )}
      </Button>
    </div>
  );
};

export default TelegramSetupPage;
