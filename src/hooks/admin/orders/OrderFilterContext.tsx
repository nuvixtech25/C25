
import React, { createContext, useContext, useState } from 'react';
import { PaymentMethod, PaymentStatus } from '@/types/checkout';

interface FilterState {
  paymentMethod: PaymentMethod;
  status: PaymentStatus | 'ALL';
  startDate?: Date;
  endDate?: Date;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const OrderFilterContext = createContext<FilterContextType | undefined>(undefined);

export function OrderFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    paymentMethod: 'pix',
    status: 'ALL'
  });

  return (
    <OrderFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </OrderFilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(OrderFilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within an OrderFilterProvider');
  }
  return context;
}
