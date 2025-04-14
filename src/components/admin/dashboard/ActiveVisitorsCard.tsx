
import React from 'react';
import { Users } from 'lucide-react';
import { useCheckoutPresence } from '@/hooks/useCheckoutPresence';
import StatCard from './StatCard';

const ActiveVisitorsCard = () => {
  // Track all checkout visitors
  const { visitorCount, visitors } = useCheckoutPresence();
  
  return (
    <StatCard 
      title="Visitantes Ativos no Checkout" 
      value={visitorCount}
      description={`Em tempo real`}
      icon={Users}
      color="bg-amber-100 text-amber-700"
    />
  );
};

export default ActiveVisitorsCard;
