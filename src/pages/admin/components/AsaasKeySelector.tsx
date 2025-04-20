
import React from 'react';
import { useAsaasKeyManager } from '@/hooks/useAsaasKeyManager';
import { AsaasEnvironment } from '@/config/asaas';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const AsaasKeySelector: React.FC = () => {
  const {
    environment,
    keys,
    activeKeyId,
    isLoading,
    changeEnvironment,
    setActiveKey
  } = useAsaasKeyManager();
  
  const handleEnvironmentChange = (value: string) => {
    if (value === AsaasEnvironment.PRODUCTION || value === AsaasEnvironment.SANDBOX) {
      changeEnvironment(value as AsaasEnvironment);
    }
  };
  
  const handleKeyChange = (value: string) => {
    setActiveKey(parseInt(value, 10));
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seletor de Chave Asaas</CardTitle>
          <CardDescription>Carregando configurações...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingSpinner size="md" />
        </CardContent>
      </Card>
    );
  }
  
  // Filtra as chaves ativas para o ambiente atual
  const activeKeys = keys.filter(key => key.is_active);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seletor de Chave Asaas</CardTitle>
        <CardDescription>
          Selecione o ambiente e a chave que deseja utilizar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Ambiente</Label>
          <ToggleGroup 
            type="single" 
            variant="outline"
            value={environment}
            onValueChange={handleEnvironmentChange}
            className="justify-start"
          >
            <ToggleGroupItem value={AsaasEnvironment.PRODUCTION}>
              Produção
            </ToggleGroupItem>
            <ToggleGroupItem value={AsaasEnvironment.SANDBOX}>
              Sandbox
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Chave Ativa</Label>
          {activeKeys.length > 0 ? (
            <Select onValueChange={handleKeyChange} value={activeKeyId?.toString() || undefined}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma chave" />
              </SelectTrigger>
              <SelectContent>
                {activeKeys.map((key) => (
                  <SelectItem key={key.id} value={key.id.toString()}>
                    {key.key_name} {' '}
                    <span className="text-xs text-muted-foreground">
                      (Prioridade: {key.priority})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 border rounded-md bg-muted/20">
              <p className="text-sm text-muted-foreground text-center">
                {`Nenhuma chave ${environment === AsaasEnvironment.SANDBOX ? 'sandbox' : 'produção'} ativa disponível`}
              </p>
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Chave em uso:</p>
          {activeKeyId ? (
            <div className="p-3 border rounded-md bg-primary/5 border-primary/20">
              {activeKeys.find(k => k.id === activeKeyId)?.key_name || 'Chave não encontrada'}
              <Badge variant="outline" className="ml-2">Ativa</Badge>
            </div>
          ) : (
            <div className="p-3 border rounded-md bg-amber-50 border-amber-200">
              <p className="text-sm text-amber-600">
                Nenhuma chave ativa selecionada
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AsaasKeySelector;
