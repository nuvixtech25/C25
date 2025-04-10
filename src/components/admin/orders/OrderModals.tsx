import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order, PaymentStatus } from "@/types/checkout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";

interface CustomerModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dados do Cliente</DialogTitle>
          <DialogDescription>
            Informações detalhadas do cliente do pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Nome:</div>
            <div className="col-span-2">{order.customerName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Email:</div>
            <div className="col-span-2">{order.customerEmail}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">CPF/CNPJ:</div>
            <div className="col-span-2">{order.customerCpfCnpj}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Telefone:</div>
            <div className="col-span-2">{order.customerPhone}</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PaymentModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
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

interface StatusModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onChangeStatus: (status: PaymentStatus) => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  order,
  open,
  onClose,
  onChangeStatus,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Status do Pedido</DialogTitle>
          <DialogDescription>
            Selecione o novo status para este pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-gray-500 mb-4">
            Status atual: <StatusBadge status={order.status} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("PENDING");
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Em Análise</span>
                <span className="text-sm text-gray-500">Marca o pedido como pendente de análise.</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("CONFIRMED");
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Confirmado</span>
                <span className="text-sm text-gray-500">Marca o pedido como confirmado/aprovado.</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("RECEIVED");
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Recebido</span>
                <span className="text-sm text-gray-500">Marca o pagamento como recebido.</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("CANCELLED");
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-red-600">Cancelado</span>
                <span className="text-sm text-gray-500">Cancela o pedido.</span>
              </div>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleteAll: boolean;
  paymentMethod?: "pix" | "creditCard";
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleteAll,
  paymentMethod,
}) => {
  const methodName = paymentMethod === "pix" ? "PIX" : "Cartão de Crédito";

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDeleteAll 
              ? `Excluir todos os pedidos de ${methodName}?` 
              : "Excluir pedido?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDeleteAll
              ? `Esta ação irá excluir permanentemente todos os pedidos de ${methodName}. Essa ação não pode ser desfeita.`
              : "Esta ação irá excluir permanentemente este pedido. Essa ação não pode ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
