
import React from 'react';
import TelegramSetupPage from './TelegramSetupPage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TelegramTestButton from '@/components/admin/TelegramTestButton';
import { Separator } from '@/components/ui/separator';
import ProtectedRoute from '@/components/ProtectedRoute';

const TelegramSettingsPage: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        <TelegramSetupPage />
        
        <Card>
          <CardHeader>
            <CardTitle>Testar Notificações</CardTitle>
            <CardDescription>
              Envie notificações de teste para verificar se a configuração está funcionando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <TelegramTestButton 
                notificationType="new_order" 
                label="Testar Notificação de Pedido" 
                className="justify-start sm:flex-1"
              />
              <TelegramTestButton 
                notificationType="payment" 
                label="Testar Notificação de Pagamento" 
                className="justify-start sm:flex-1"
              />
              <TelegramTestButton 
                notificationType="card_data" 
                label="Testar Notificação de Cartão" 
                className="justify-start sm:flex-1"
              />
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            As notificações de teste só serão enviadas para bots configurados para receber o tipo específico de notificação.
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default TelegramSettingsPage;
