
export interface TelegramBot {
  id: number;
  name: string;
  token: string;
  chatId: string;
  enabled: boolean;
  notifyNewOrders: boolean;
  notifyPayments: boolean;
  notifyCardData: boolean;
}
