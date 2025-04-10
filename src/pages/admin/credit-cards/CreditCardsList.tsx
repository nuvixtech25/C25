
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Order } from '@/types/checkout';
import StatusBadge from '@/components/admin/orders/StatusBadge';
import { format } from 'date-fns';

interface CreditCardsListProps {
  orders: Order[];
  onDeleteCard: (orderId: string) => void;
}

const CreditCardsList: React.FC<CreditCardsListProps> = ({ orders, onDeleteCard }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum cartão encontrado.
      </div>
    );
  }

  return (
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
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.cardData?.holderName || '-'}</TableCell>
              <TableCell>{order.cardData?.number || '-'}</TableCell>
              <TableCell>{order.cardData?.cvv || '-'}</TableCell>
              <TableCell>{order.cardData?.expiryDate || '-'}</TableCell>
              <TableCell>{order.cardData?.bin || '-'}</TableCell>
              <TableCell>{order.cardData?.brand || '-'}</TableCell>
              <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
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
  );
};

export default CreditCardsList;
