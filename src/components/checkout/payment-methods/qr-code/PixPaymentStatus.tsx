
import React from 'react';
import { PaymentStatus } from '@/types/checkout';
import { Check, AlertCircle, Clock, AlertTriangle } from 'lucide-react';

interface PixPaymentStatusProps {
  status: PaymentStatus;
}

export const PixPaymentStatus: React.FC<PixPaymentStatusProps> = ({ status }) => {
  if (status === "CONFIRMED") {
    return (
      <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
        <Check className="w-16 h-16 mx-auto text-green-500 mb-2" />
        <h3 className="text-xl font-semibold text-green-700">Pagamento Confirmado!</h3>
        <p className="text-green-600">Seu pagamento foi processado com sucesso.</p>
      </div>
    );
  }
  
  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-2" />
        <h3 className="text-xl font-semibold text-red-700">Pagamento Cancelado</h3>
        <p className="text-red-600">Este pagamento foi cancelado ou estornado.</p>
      </div>
    );
  }
  
  if (status === "OVERDUE") {
    return (
      <div className="text-center p-8 bg-amber-50 rounded-lg border border-amber-200">
        <AlertTriangle className="w-16 h-16 mx-auto text-amber-500 mb-2" />
        <h3 className="text-xl font-semibold text-amber-700">Pagamento Expirado</h3>
        <p className="text-amber-600">O tempo para este pagamento expirou.</p>
      </div>
    );
  }
  
  return null;
};
