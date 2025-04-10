
import React from "react";
import { PaymentStatus } from "@/types/checkout";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PaymentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Define styles and text for each status
  const statusConfig: Record<
    PaymentStatus,
    { bg: string; text: string; label: string }
  > = {
    PENDING: {
      bg: "bg-yellow-100 text-yellow-800 border-yellow-200",
      text: "text-yellow-800",
      label: "Em Análise",
    },
    CONFIRMED: {
      bg: "bg-green-100 text-green-800 border-green-200",
      text: "text-green-800",
      label: "Confirmado",
    },
    RECEIVED: {
      bg: "bg-green-100 text-green-800 border-green-200",
      text: "text-green-800",
      label: "Recebido",
    },
    OVERDUE: {
      bg: "bg-orange-100 text-orange-800 border-orange-200",
      text: "text-orange-800",
      label: "Vencido",
    },
    REFUNDED: {
      bg: "bg-blue-100 text-blue-800 border-blue-200",
      text: "text-blue-800",
      label: "Reembolsado",
    },
    CANCELLED: {
      bg: "bg-red-100 text-red-800 border-red-200",
      text: "text-red-800",
      label: "Cancelado",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bg
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
