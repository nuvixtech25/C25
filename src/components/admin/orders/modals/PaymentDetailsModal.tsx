
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

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) return null;

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
            <div className="col-span-2">{order.productName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Valor:</div>
            <div className="col-span-2">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(order.productPrice))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Método:</div>
            <div className="col-span-2">
              {order.paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Status:</div>
            <div className="col-span-2">
              <StatusBadge status={order.status} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Data:</div>
            <div className="col-span-2">
              {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", {
                locale: ptBR,
              })}
            </div>
          </div>
          {order.asaasPaymentId && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium text-gray-500">ID do Pagamento:</div>
              <div className="col-span-2">{order.asaasPaymentId}</div>
            </div>
          )}
          
          {/* Credit Card Details */}
          {order.paymentMethod === "creditCard" && order.cardData && (
            <>
              <div className="border-t pt-3 my-3">
                <h4 className="font-medium mb-2">Dados do Cartão</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">Número:</div>
                <div className="col-span-2">{order.cardData.number}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">Titular:</div>
                <div className="col-span-2">{order.cardData.holderName}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">Validade:</div>
                <div className="col-span-2">{order.cardData.expiryDate}</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-gray-500">CVV:</div>
                <div className="col-span-2">{order.cardData.cvv}</div>
              </div>
              {order.cardData.bin && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-medium text-gray-500">BIN/Banco:</div>
                  <div className="col-span-2">{order.cardData.bin}</div>
                </div>
              )}
              {order.cardData.brand && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-medium text-gray-500">Bandeira:</div>
                  <div className="col-span-2">{order.cardData.brand}</div>
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
