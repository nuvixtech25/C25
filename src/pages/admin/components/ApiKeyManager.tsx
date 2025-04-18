
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { listApiKeys, addApiKey, toggleKeyStatus } from '@/services/asaasKeyService';
import { Badge } from '@/components/ui/badge';

interface ApiKey {
  id: number;
  key_name: string;
  api_key: string;
  is_active: boolean;
  priority: number;
}

const ApiKeyManager = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      const productionKeys = await listApiKeys(false); // false para chaves de produção
      setKeys(productionKeys);
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

    if (keys.length >= 5) {
      toast({
        title: 'Limite atingido',
        description: 'Você já atingiu o limite máximo de 5 chaves.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await addApiKey(
        newKeyName,
        newApiKey,
        false, // false para produção
        keys.length + 1 // prioridade baseada na quantidade atual de chaves
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chaves de API de Produção</CardTitle>
        <CardDescription>
          Gerencie suas chaves de API do Asaas (máximo 5 chaves)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Lista de chaves existentes */}
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{key.key_name}</p>
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

          {/* Formulário para adicionar nova chave */}
          {keys.length < 5 && (
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
  );
};

export default ApiKeyManager;

