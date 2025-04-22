
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
      
      setBots(botsData || []);
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
      setLoading(false);
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

      for (const bot of bots) {
        if (bot.enabled) {
          if (!bot.token || typeof bot.token !== 'string' || bot.token.trim() === '') {
            toast.error(`Por favor, configure o Token para ${bot.name}`);
            return;
          }
          
          if (!bot.chatId || typeof bot.chatId !== 'string' || bot.chatId.trim() === '') {
            toast.error(`Por favor, configure o Chat ID para ${bot.name}`);
            return;
          }
        }
      }

      const botsToSave = bots.map(bot => ({
        id: bot.id < 0 ? undefined : bot.id,
        name: bot.name,
        token: bot.token,
        chat_id: bot.chatId,
        enabled: bot.enabled,
        notify_new_orders: bot.notifyNewOrders,
        notify_payments: bot.notifyPayments,
        notify_card_data: bot.notifyCardData
      }));

      const newBots = botsToSave.filter(bot => bot.id === undefined);
      if (newBots.length > 0) {
        const { error: insertError } = await supabase
          .from('telegram_bots')
          .insert(newBots)
          .select();
          
        if (insertError) throw insertError;
      }
      
      const existingBots = botsToSave.filter(bot => bot.id !== undefined);
      if (existingBots.length > 0) {
        const { error: updateError } = await supabase
          .from('telegram_bots')
          .upsert(existingBots, { onConflict: 'id' });
          
        if (updateError) throw updateError;
      }

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
