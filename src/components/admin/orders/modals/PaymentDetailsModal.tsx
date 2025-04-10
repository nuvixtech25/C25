
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order } from "@/types/checkout";
import StatusBadge from "../StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

// Sample test data for demonstrating credit card display
const sampleCardOrder: Order = {
  id: "sample-123",
  customerId: "cus_123",
  customerName: "João Silva",
  customerEmail: "joao@example.com",
  customerCpfCnpj: "123.456.789-00",
  customerPhone: "(11) 99999-9999",
  productId: "prod_123",
  productName: "Curso Premium",
  productPrice: 299.90,
  status: "CONFIRMED",
  paymentMethod: "creditCard",
  asaasPaymentId: "pay_123456789",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  cardData: {
    holderName: "JOAO S SILVA",
    number: "4111 1111 1111 1111",
    expiryDate: "12/25",
    cvv: "123",
    bin: "411111",
    brand: "visa"
  }
};

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  order,
  open,
  onClose,
}) => {
  // Use provided order or sample data for testing
  const displayOrder = order || null;
  
  if (!displayOrder) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dados do Pagamento</DialogTitle>
          <DialogDescription>
            Informações detalhadas do pagamento.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Produto:</div>
            <div className="col-span-2">{displayOrder.productName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Valor:</div>
            <div className="col-span-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(displayOrder.productPrice))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Método:</div>
            <div className="col-span-2">
              {displayOrder.paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Status:</div>
            <div className="col-span-2">
              <StatusBadge status={displayOrder.status} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Data:</div>
            <div className="col-span-2">
              {format(new Date(displayOrder.createdAt), "dd/MM/yyyy HH:mm", {
                locale: ptBR,
              })}
            </div>
          </div>
          {displayOrder.asaasPaymentId && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium text-gray-500">ID do Pagamento:</div>
              <div className="col-span-2">{displayOrder.asaasPaymentId}</div>
            </div>
          )}
          
          {/* Credit Card Details */}
          {displayOrder.paymentMethod === "creditCard" && displayOrder.cardData && (
            <>
              <div className="border-t pt-3 my-3">
                <h4 className="font-medium mb-2">Dados do Cartão</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">Número:</div>
                <div className="col-span-2">{displayOrder.cardData.number}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">Titular:</div>
                <div className="col-span-2">{displayOrder.cardData.holderName}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">Validade:</div>
                <div className="col-span-2">{displayOrder.cardData.expiryDate}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">CVV:</div>
                <div className="col-span-2">{displayOrder.cardData.cvv}</div>
              </div>
              {displayOrder.cardData.bin && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-medium text-gray-500">BIN/Banco:</div>
                  <div className="col-span-2">{displayOrder.cardData.bin}</div>
                </div>
              )}
              {displayOrder.cardData.brand && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-medium text-gray-500">Bandeira:</div>
                  <div className="col-span-2">{displayOrder.cardData.brand}</div>
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailsModal;
