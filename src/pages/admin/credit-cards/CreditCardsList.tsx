
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
import { Badge } from '@/components/ui/badge';

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

  // Determine card level based on BIN
  const getCardLevel = (card?: Order['cardData']) => {
    if (!card?.bin) return 'Standard';
    
    // Simple logic to determine card level - can be adjusted based on actual business rules
    const binNum = parseInt(card.bin.substring(0, 1), 10);
    
    if (binNum >= 8) return 'Platinum';
    if (binNum >= 5) return 'Gold';
    if (binNum >= 3) return 'Black';
    return 'Standard';
  };

  // Get appropriate color for card level badge
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-purple-500';
      case 'Gold': return 'bg-amber-500';
      case 'Black': return 'bg-black text-white';
      default: return 'bg-slate-500';
    }
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
              <TableHead>Nome do Titular / Level</TableHead>
              <TableHead>Data da Compra</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const cardLevel = getCardLevel(order.cardData);
              const levelColor = getLevelColor(cardLevel);
              
              return (
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
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.cardData?.holderName?.toLowerCase() || '-'}</span>
                      <Badge className={`mt-1 w-fit ${levelColor}`}>
                        {cardLevel}
                      </Badge>
                    </div>
                  </TableCell>
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
              );
            })}
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
