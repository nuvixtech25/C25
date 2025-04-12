
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, LayoutTemplate } from 'lucide-react';
import { CheckoutCustomizationSettings } from '@/types/customization';

interface AdminToolsHeaderProps {
  onSave: () => void;
  onPreview: (openInSide?: boolean) => void;
}

export const AdminToolsHeader: React.FC<AdminToolsHeaderProps> = ({ onSave, onPreview }) => {
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
          <Button variant="outline" onClick={() => onPreview()}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button variant="secondary" onClick={() => onPreview(true)}>
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Visualizar ao lado
          </Button>
          <Button onClick={onSave}>Salvar Alterações</Button>
        </div>
      </div>
      
      <Separator />
    </>
  );
};

