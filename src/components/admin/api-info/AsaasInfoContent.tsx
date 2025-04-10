
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileCode } from 'lucide-react';

export const AsaasInfoContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Asaas</CardTitle>
          <CardDescription>
            Como o Asaas está configurado no projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-md">
              <h3 className="font-medium">Armazenamento das Chaves Asaas</h3>
              <p className="text-sm text-muted-foreground mt-1">
                As chaves da API Asaas são armazenadas na tabela <code>asaas_config</code> do Supabase:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li><code>sandbox_key</code> - Chave da API do ambiente Sandbox</li>
                <li><code>production_key</code> - Chave da API do ambiente de Produção</li>
                <li><code>sandbox</code> - Flag que indica se está usando o ambiente Sandbox (boolean)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center"><FileCode className="h-4 w-4 mr-2" /> Uso no Projeto</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Função/Hook</TableHead>
                    <TableHead>Modo de Uso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">src/hooks/useAsaasSettings.ts</TableCell>
                    <TableCell>useAsaasSettings</TableCell>
                    <TableCell>Gerenciamento de configurações do Asaas</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">src/services/asaasService.ts</TableCell>
                    <TableCell>generatePixPayment</TableCell>
                    <TableCell>Geração de pagamentos PIX</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">netlify/functions/create-asaas-customer.ts</TableCell>
                    <TableCell>handler</TableCell>
                    <TableCell>Criação de cliente e pagamento no Asaas</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asaas nas Funções Netlify</CardTitle>
          <CardDescription>
            Como o Asaas é utilizado nas funções serverless
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-md">
              <h3 className="font-medium">Configuração nas Variáveis de Ambiente</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Nas funções Netlify, o Asaas precisa das seguintes variáveis:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li><code>ASAAS_API_KEY</code> - Chave da API do Asaas (pode ser sandbox ou produção)</li>
                <li><code>ASAAS_API_URL</code> - URL da API (https://sandbox.asaas.com/api/v3 ou https://www.asaas.com/api/v3)</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800">⚠️ Atenção</h3>
              <p className="text-sm text-amber-700 mt-1">
                A chave Asaas é obtida da tabela <code>asaas_config</code> do Supabase na função serverless. 
                Certifique-se de ter inicializado corretamente o cliente Supabase antes de tentar acessar essa configuração.
              </p>
              <pre className="bg-black/90 text-white p-3 rounded-md text-xs mt-2 overflow-auto">
{`// Exemplo em função Netlify
async function getAsaasConfig(supabase) {
  if (!supabase) {
    throw new Error("Cliente Supabase não inicializado");
  }
  
  const { data, error } = await supabase
    .from('asaas_config')
    .select('*')
    .single();
    
  if (error) {
    throw new Error(\`Erro ao buscar configuração Asaas: \${error.message}\`);
  }
  
  if (!data) {
    throw new Error("Configuração Asaas não encontrada");
  }
  
  return {
    apiKey: data.sandbox ? data.sandbox_key : data.production_key,
    apiUrl: data.sandbox 
      ? "https://sandbox.asaas.com/api/v3" 
      : "https://www.asaas.com/api/v3",
    isSandbox: data.sandbox
  };
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
