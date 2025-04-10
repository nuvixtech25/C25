
import { useState } from 'react';
import { PaymentStatus } from '@/types/checkout';
import { WebhookEventType } from '@/hooks/admin/webhook/types';

export const useWebhookState = () => {
  // Processing state for orders
  const [processingOrders, setProcessingOrders] = useState<Record<string, boolean>>({});
  
  // Filters and event selection
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<WebhookEventType>('PAYMENT_RECEIVED');

  return {
    // Processing state
    processingOrders,
    setProcessingOrders,
    
    // Filters and selection
    statusFilter,
    setStatusFilter,
    selectedEvent,
    setSelectedEvent,
  };
};
