
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { listApiKeys, addApiKey, toggleKeyStatus } from '@/services/asaasKeyService';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ApiKey {
  id: number;
  key_name: string;
  api_key: string;
  is_active: boolean;
  priority: number;
  is_sandbox: boolean;
}

const ApiKeyManager = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Carrega as chaves ao montar o componente
  React.useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const allKeys = await listApiKeys(false);
      console.log('Chaves carregadas:', allKeys);
      setKeys(allKeys);
    } catch (error) {
      console.error('Erro ao carregar chaves:', error);
      toast({
        title: 'Erro ao carregar chaves',
        description: 'Não foi possível carregar as chaves de API.',
        variant: 'destructive',
      });
    }
  };

  const handleAddKey = async () => {
    if (!newKeyName || !newApiKey) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o nome e a chave API.',
        variant: 'destructive',
      });
      return;
    }

    const productionKeys = keys.filter(k => !k.is_sandbox);
    if (productionKeys.length >= 5) {
      toast({
        title: 'Limite atingido',
        description: 'Você já atingiu o limite máximo de 5 chaves de produção.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await addApiKey(
        newKeyName,
        newApiKey,
        false,
        productionKeys.length + 1
      );
      
      setNewKeyName('');
      setNewApiKey('');
      await loadKeys();
      
      toast({
        title: 'Chave adicionada',
        description: 'A chave de API foi adicionada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao adicionar chave:', error);
      toast({
        title: 'Erro ao adicionar chave',
        description: 'Não foi possível adicionar a chave de API.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (keyId: number, currentStatus: boolean) => {
    try {
      await toggleKeyStatus(keyId, !currentStatus);
      await loadKeys();
      
      toast({
        title: 'Status atualizado',
        description: `A chave foi ${!currentStatus ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro ao alterar status',
        description: 'Não foi possível alterar o status da chave.',
        variant: 'destructive',
      });
    }
  };

  const sandboxKey = keys.find(key => key.is_sandbox);
  const productionKeys = keys
    .filter(key => !key.is_sandbox)
    .sort((a, b) => a.priority - b.priority);

  return (
    <Tabs defaultValue="production" className="space-y-4">
      <TabsList>
        <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
        <TabsTrigger value="production">Produção</TabsTrigger>
      </TabsList>

      <TabsContent value="sandbox" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Chave de Sandbox</CardTitle>
            <CardDescription>
              Chave para testes em ambiente de desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sandboxKey ? (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{sandboxKey.key_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {sandboxKey.api_key}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={sandboxKey.is_active ? "default" : "secondary"}>
                      {sandboxKey.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={sandboxKey.is_active}
                  onCheckedChange={() => handleToggleStatus(sandboxKey.id, sandboxKey.is_active)}
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma chave de sandbox cadastrada
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="production">
        <Card>
          <CardHeader>
            <CardTitle>Chaves de API de Produção</CardTitle>
            <CardDescription>
              Gerencie suas chaves de API do Asaas (máximo 5 chaves)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                {productionKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{key.key_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {key.api_key}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Prioridade: {key.priority}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={key.is_active}
                      onCheckedChange={() => handleToggleStatus(key.id, key.is_active)}
                    />
                  </div>
                ))}
              </div>

              {productionKeys.length < 5 && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Nome da Chave</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Ex: Chave Principal"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">Chave API</Label>
                    <Input
                      id="apiKey"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="$aas_..."
                      type="password"
                    />
                  </div>

                  <Button 
                    onClick={handleAddKey} 
                    disabled={isLoading || !newKeyName || !newApiKey}
                    className="w-full"
                  >
                    {isLoading ? 'Adicionando...' : 'Adicionar Nova Chave'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ApiKeyManager;
