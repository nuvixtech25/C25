import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, CreditCard, Copy } from 'lucide-react';
import { Order } from '@/types/checkout';
import { format } from 'date-fns';
import CardDetailsModal from './CardDetailsModal';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CreditCardsListProps {
  orders: Order[];
  onDeleteCard: (orderId: string) => void;
}

const CreditCardsList: React.FC<CreditCardsListProps> = ({ orders, onDeleteCard }) => {
  const [selectedCard, setSelectedCard] = useState<Order | null>(null);
  const { toast } = useToast();
  
  // Formats card number to display only last 5 digits
  const formatCardNumber = (number: string | undefined) => {
    if (!number) return '-';
    const lastDigits = number.slice(-5);
    return `•••• ${lastDigits}`;
  };

  const copyCardNumber = (number: string | undefined) => {
    if (!number) return;
    navigator.clipboard.writeText(number);
    toast({
      title: "Copiado com sucesso",
      description: "O número do cartão foi copiado para a área de transferência",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum cartão encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bandeira</TableHead>
              <TableHead>BIN</TableHead>
              <TableHead>Número do Cartão</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>CVV</TableHead>
              <TableHead>Nome do Titular</TableHead>
              <TableHead>Data da Compra</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-1">💳</span>
                    {order.cardData?.brand || '-'}
                  </div>
                </TableCell>
                <TableCell>{order.cardData?.bin || '-'}</TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal" 
                    onClick={() => setSelectedCard(order)}
                  >
                    {formatCardNumber(order.cardData?.number)}
                  </Button>
                </TableCell>
                <TableCell>{order.cardData?.expiryDate || '-'}</TableCell>
                <TableCell>{order.cardData?.cvv || '-'}</TableCell>
                <TableCell>{order.cardData?.holderName?.toLowerCase() || '-'}</TableCell>
                <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell className="w-32">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => order.cardData?.number && copyCardNumber(order.cardData.number)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4 text-blue-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copiar número do cartão</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => onDeleteCard(order.id || '')}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir cartão</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedCard && (
        <CardDetailsModal 
          card={selectedCard.cardData} 
          isOpen={!!selectedCard} 
          onClose={() => setSelectedCard(null)} 
        />
      )}
    </>
  );
};

export default CreditCardsList;
