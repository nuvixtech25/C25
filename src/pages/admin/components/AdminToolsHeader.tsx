
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AdminToolsHeaderProps {
  onSave: () => void;
}

export const AdminToolsHeader: React.FC<AdminToolsHeaderProps> = ({ onSave }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Personalização do Checkout</h2>
          <p className="text-muted-foreground">
            Personalize a aparência e comportamento da sua página de checkout.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSave}>Salvar Alterações</Button>
        </div>
      </div>
      
      <Separator />
    </>
  );
};
