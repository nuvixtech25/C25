
import React from 'react';
import { PaymentStatus } from '@/types/checkout';
import { Check, AlertCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PixPaymentStatusProps {
  status: PaymentStatus;
}

export const PixPaymentStatus: React.FC<PixPaymentStatusProps> = ({ status }) => {
  if (status === "CONFIRMED") {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-md animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Pagamento Confirmado!</h3>
        <p className="text-green-600">Seu pagamento foi processado com sucesso.</p>
        <div className="mt-4 flex items-center justify-center text-green-500 text-sm">
          <ShieldCheck className="w-4 h-4 mr-1" />
          <span>Transação segura</span>
        </div>
      </div>
    );
  }
  
  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-md animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-red-400 rounded-full blur-md opacity-30"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-red-700 mb-2">Pagamento Cancelado</h3>
        <p className="text-red-600">Este pagamento foi cancelado ou estornado.</p>
      </div>
    );
  }
  
  if (status === "OVERDUE") {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-md animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-md opacity-30"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-amber-700 mb-2">Pagamento Expirado</h3>
        <p className="text-amber-600">O tempo para este pagamento expirou.</p>
      </div>
    );
  }
  
  return null;
};
