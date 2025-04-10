
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PixCopyPasteFieldProps {
  copyPasteKey: string;
}

export const PixCopyPasteField: React.FC<PixCopyPasteFieldProps> = ({ copyPasteKey }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyPasteKey).then(
      () => {
        setCopied(true);
        toast({
          title: "Código PIX copiado!",
          description: "Cole no app do seu banco para pagar",
        });
        
        setTimeout(() => setCopied(false), 3000);
      },
      () => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código",
          variant: "destructive",
        });
      }
    );
  };
  
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded border">
      <div className="text-xs truncate flex-1 mr-2 font-mono">
        {copyPasteKey}
      </div>
      <Button 
        size="sm" 
        variant="outline"
        onClick={copyToClipboard}
        className="min-w-[100px]"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Copiado
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </>
        )}
      </Button>
    </div>
  );
};
