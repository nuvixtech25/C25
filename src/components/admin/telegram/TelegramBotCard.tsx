
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';

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

interface TelegramBotCardProps {
  bot: TelegramBot;
  onUpdate: (field: keyof TelegramBot, value: any) => void;
  onRemove: () => void;
}

export const TelegramBotCard: React.FC<TelegramBotCardProps> = ({
  bot,
  onUpdate,
  onRemove,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">{bot.name}</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id={`bot-enabled-${bot.id}`}
              checked={bot.enabled}
              onCheckedChange={(checked) => onUpdate('enabled', checked)}
            />
            <Label htmlFor={`bot-enabled-${bot.id}`}>Ativo</Label>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700"
            onClick={onRemove}
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
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Nome para identificação"
          />
        </div>
        <div>
          <Label htmlFor={`token-${bot.id}`}>Bot Token</Label>
          <Input
            id={`token-${bot.id}`}
            value={bot.token}
            onChange={(e) => onUpdate('token', e.target.value)}
            placeholder="Digite o token do seu Bot Telegram"
          />
        </div>
        <div>
          <Label htmlFor={`chatId-${bot.id}`}>Chat ID</Label>
          <Input
            id={`chatId-${bot.id}`}
            value={bot.chatId}
            onChange={(e) => onUpdate('chatId', e.target.value)}
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
                onCheckedChange={(checked) => onUpdate('notifyNewOrders', checked)}
              />
              <Label htmlFor={`notify-orders-${bot.id}`}>Novos Pedidos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`notify-payments-${bot.id}`}
                checked={bot.notifyPayments}
                onCheckedChange={(checked) => onUpdate('notifyPayments', checked)}
              />
              <Label htmlFor={`notify-payments-${bot.id}`}>Pagamentos Confirmados</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`notify-cards-${bot.id}`}
                checked={bot.notifyCardData}
                onCheckedChange={(checked) => onUpdate('notifyCardData', checked)}
              />
              <Label htmlFor={`notify-cards-${bot.id}`}>Dados de Cartão</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
