
import { supabase } from '@/integrations/supabase/client';

export async function sendTelegramNotification(message: string) {
  try {
    // Get Telegram bot token from Supabase settings
    const { data: tokenData, error: tokenError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_bot_token')
      .single();

    // Get Telegram chat ID from Supabase settings
    const { data: chatIdData, error: chatIdError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_chat_id')
      .single();

    if (tokenError || chatIdError) {
      console.error('Telegram configuration not found', { tokenError, chatIdError });
      return;
    }

    if (!tokenData?.value || !chatIdData?.value) {
      console.warn('Telegram settings are incomplete');
      return;
    }

    const token = tokenData.value;
    const chat_id = chatIdData.value;

    // Send the notification to Telegram
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
    
    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram notification', error);
    return false;
  }
}
