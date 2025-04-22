
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TelegramBot } from './types';

export const useTelegramBots = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bots, setBots] = useState<TelegramBot[]>([]);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const { data: botsData, error: botsError } = await supabase
        .from('telegram_bots')
        .select('*')
        .order('id');
      
      if (botsError) throw botsError;
      
      // Map database format to frontend format
      const mappedBots = botsData?.map(bot => ({
        id: bot.id,
        name: bot.name,
        token: bot.token,
        chatId: bot.chat_id,
        enabled: bot.enabled,
        notifyNewOrders: bot.notify_new_orders,
        notifyPayments: bot.notify_payments,
        notifyCardData: bot.notify_card_data
      })) || [];
      
      console.log('Bots carregados:', mappedBots);
      setBots(mappedBots);
    } catch (error) {
      console.error('Erro ao carregar bots:', error);
      toast.error('Erro ao carregar configurações do Telegram');
    } finally {
      setInitialLoading(false);
    }
  };

  const addNewBot = () => {
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

  const removeBot = async (botId: number) => {
    if (botId < 0) {
      setBots(bots.filter(bot => bot.id !== botId));
      return;
    }
    
    const confirmDelete = window.confirm("Tem certeza que deseja remover este bot?");
    if (confirmDelete) {
      setLoading(true);
      
      try {
        const { error } = await supabase
          .from('telegram_bots')
          .delete()
          .eq('id', botId);
          
        if (error) {
          console.error('Erro ao remover bot:', error);
          toast.error('Erro ao remover bot');
        } else {
          setBots(bots.filter(bot => bot.id !== botId));
          toast.success('Bot removido com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao remover bot:', error);
        toast.error('Erro ao remover bot');
      } finally {
        setLoading(false);
      }
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
      console.log('Iniciando salvamento de bots:', bots);

      // Validação dos bots ativos
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

      // Preparar os dados para salvar - formato que o banco espera
      const botsToSave = bots.map(bot => ({
        id: bot.id < 0 ? undefined : bot.id, // Remove o ID para novos bots
        name: bot.name,
        token: bot.token,
        chat_id: bot.chatId,
        enabled: bot.enabled,
        notify_new_orders: bot.notifyNewOrders,
        notify_payments: bot.notifyPayments,
        notify_card_data: bot.notifyCardData
      }));

      console.log('Bots preparados para salvar:', botsToSave);

      // Separar bots novos e existentes
      const newBots = botsToSave.filter(bot => bot.id === undefined);
      const existingBots = botsToSave.filter(bot => bot.id !== undefined);

      // Inserir novos bots
      if (newBots.length > 0) {
        console.log('Inserindo novos bots:', newBots);
        const { data: insertedData, error: insertError } = await supabase
          .from('telegram_bots')
          .insert(newBots)
          .select();
          
        if (insertError) {
          console.error('Erro ao inserir novos bots:', insertError);
          throw new Error(`Erro ao inserir novos bots: ${insertError.message}`);
        }
        
        console.log('Novos bots inseridos com sucesso:', insertedData);
      }
      
      // Atualizar bots existentes
      for (const bot of existingBots) {
        console.log('Atualizando bot existente:', bot);
        const { data: updatedData, error: updateError } = await supabase
          .from('telegram_bots')
          .update({
            name: bot.name,
            token: bot.token,
            chat_id: bot.chat_id,
            enabled: bot.enabled,
            notify_new_orders: bot.notify_new_orders,
            notify_payments: bot.notify_payments,
            notify_card_data: bot.notify_card_data
          })
          .eq('id', bot.id)
          .select();
          
        if (updateError) {
          console.error('Erro ao atualizar bot existente:', updateError);
          throw new Error(`Erro ao atualizar bot existente: ${updateError.message}`);
        }
        
        console.log('Bot atualizado com sucesso:', updatedData);
      }

      // Recarregar bots após salvar para ter os dados mais atualizados
      await fetchBots();
      
      toast.success('Configurações do Telegram salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao salvar configurações do Telegram: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    bots,
    loading,
    initialLoading,
    addNewBot,
    removeBot,
    updateBot,
    saveTelegramSettings
  };
};
