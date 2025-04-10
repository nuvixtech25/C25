
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
import { CreditCard } from "lucide-react";

interface PaymentDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

// Helper function to get bank name from BIN
const getBankFromBin = (bin: string | undefined): string => {
  if (!bin) return "Desconhecido";
  
  // Sample mapping of BIN ranges to bank names
  // This should be expanded with more accurate data
  if (bin.startsWith("4")) return "Visa";
  if (bin.startsWith("5")) return "Mastercard";
  if (bin.startsWith("34") || bin.startsWith("37")) return "American Express";
  if (bin.startsWith("6")) return "Discover";
  
  return "Outro";
};

// Helper function to get card level
const getCardLevel = (bin: string | undefined, brand: string | undefined): string => {
  if (!bin) return "Standard";
  
  // This is a simplified example - in a real implementation,
  // you would use a more complete BIN database
  if (brand?.toLowerCase() === "visa" && bin.startsWith("4")) {
    if (bin.startsWith("49")) return "Platinum";
    if (bin.startsWith("43")) return "Gold";
  }
  
  if (brand?.toLowerCase() === "mastercard" && bin.startsWith("5")) {
    if (bin.startsWith("55")) return "Platinum";
    if (bin.startsWith("53")) return "Gold";
  }
  
  return "Standard";
};

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) return null;
  
  // Get bank name and card level if card data exists
  const bankName = order.cardData ? getBankFromBin(order.cardData.bin) : undefined;
  const cardLevel = order.cardData ? getCardLevel(order.cardData.bin, order.cardData.brand) : undefined;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {order.paymentMethod === "creditCard" && <CreditCard className="mr-2 h-4 w-4" />}
            Dados do Pagamento
          </DialogTitle>
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
                <h4 className="font-medium mb-2 flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Dados do Cartão
                </h4>
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
                  <div className="col-span-2">
                    {order.cardData.bin} 
                    {bankName && ` - ${bankName}`}
                  </div>
                </div>
              )}
              {order.cardData.brand && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-medium text-gray-500">Bandeira:</div>
                  <div className="col-span-2">{order.cardData.brand}</div>
                </div>
              )}
              {cardLevel && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-medium text-gray-500">Nível do Cartão:</div>
                  <div className="col-span-2">{cardLevel}</div>
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
