
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
import { Trash2, CreditCard } from 'lucide-react';
import { Order } from '@/types/checkout';
import { format } from 'date-fns';
import CardDetailsModal from './CardDetailsModal';

interface CreditCardsListProps {
  orders: Order[];
  onDeleteCard: (orderId: string) => void;
}

const CreditCardsList: React.FC<CreditCardsListProps> = ({ orders, onDeleteCard }) => {
  const [selectedCard, setSelectedCard] = useState<Order | null>(null);
  
  // Formats card number to display only last 5 digits
  const formatCardNumber = (number: string | undefined) => {
    if (!number) return '-';
    const lastDigits = number.slice(-5);
    return `•••• ${lastDigits}`;
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
              <TableHead>Nome do Titular</TableHead>
              <TableHead>Número do Cartão</TableHead>
              <TableHead>CVV</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>BIN</TableHead>
              <TableHead>Bandeira</TableHead>
              <TableHead>Data da Compra</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.cardData?.holderName?.toLowerCase() || '-'}</TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal" 
                    onClick={() => setSelectedCard(order)}
                  >
                    {formatCardNumber(order.cardData?.number)}
                  </Button>
                </TableCell>
                <TableCell>{order.cardData?.cvv || '-'}</TableCell>
                <TableCell>{order.cardData?.expiryDate || '-'}</TableCell>
                <TableCell>{order.cardData?.bin || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-1">💳</span>
                    {order.cardData?.brand || '-'}
                  </div>
                </TableCell>
                <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteCard(order.id || '')}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
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

