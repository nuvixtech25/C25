
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Save, Loader2, Plus } from 'lucide-react';
import { TelegramBotCard } from '@/components/admin/telegram/TelegramBotCard';
import { TelegramSetupGuide } from '@/components/admin/telegram/TelegramSetupGuide';
import { useTelegramBots } from '@/components/admin/telegram/useTelegramBots';

const TelegramSetupPage: React.FC = () => {
  const {
    bots,
    loading,
    initialLoading,
    addNewBot,
    removeBot,
    updateBot,
    saveTelegramSettings
  } = useTelegramBots();

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

      <TelegramSetupGuide />

      <div className="grid gap-6">
        {bots.map((bot, index) => (
          <TelegramBotCard
            key={bot.id}
            bot={bot}
            onUpdate={(field, value) => updateBot(index, field, value)}
            onRemove={() => removeBot(bot.id)}
          />
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
