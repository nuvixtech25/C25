
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface PixCopyPasteProps {
  copyPasteKey: string;
}

export const PixCopyPaste: React.FC<PixCopyPasteProps> = ({ copyPasteKey }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyPasteKey).then(
      () => {
        setCopied(true);
        toast({
          title: "Código PIX copiado!",
          description: "Cole no app do seu banco para pagar",
          variant: "default",
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
      <div className="bg-gray-50 border-b border-gray-200 px-2 sm:px-3 py-2 flex items-center">
        <ClipboardCopy className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-500 mr-1.5 sm:mr-2" />
        <span className="text-xs font-medium text-gray-700">Código PIX</span>
      </div>
      <div className="p-2 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
        <div className="text-xs truncate flex-1 mr-0 sm:mr-2 font-mono bg-gray-50 p-2 rounded border border-gray-200 break-all max-h-16 sm:max-h-20 overflow-y-auto">
          {copyPasteKey}
        </div>
        <Button 
          size={isMobile ? "sm" : "default"}
          variant={copied ? "outline" : "default"}
          onClick={copyToClipboard}
          className={`min-w-[90px] sm:min-w-[100px] ${copied ? 'bg-green-50 border-green-200 text-green-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {copied ? (
            <>
              <Check className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1" />
              Copiar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
