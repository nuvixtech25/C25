
import { supabase } from '@/integrations/supabase/client';

export async function sendTelegramNotification(message: string) {
  try {
    const { data: tokenData, error: tokenError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_bot_token')
      .single();

    const { data: chatIdData, error: chatIdError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_chat_id')
      .single();

    if (tokenError || chatIdError) {
      console.error('Telegram configuration not found', { tokenError, chatIdError });
      return;
    }

    if (!tokenData || !chatIdData) {
      console.warn('Telegram settings are incomplete');
      return;
    }

    const token = tokenData.value;
    const chat_id = chatIdData.value;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id, 
        text: message 
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Failed to send Telegram notification', errorBody);
    }
  } catch (error) {
    console.error('Error sending Telegram notification', error);
  }
}
