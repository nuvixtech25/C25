
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Code, FileCode } from 'lucide-react';

export const SupabaseInfoContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Supabase</CardTitle>
          <CardDescription>
            Como o Supabase está configurado no projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-md">
              <h3 className="font-medium flex items-center"><Code className="h-4 w-4 mr-2" /> Cliente Supabase</h3>
              <p className="text-sm text-muted-foreground mt-1">
                O cliente Supabase é inicializado em <code>src/integrations/supabase/client.ts</code>
              </p>
              <pre className="bg-black/90 text-white p-3 rounded-md text-xs mt-2 overflow-auto">
{`// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);`}
              </pre>
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
                    <TableCell className="font-mono text-xs">src/hooks/admin/webhook/useWebhookData.ts</TableCell>
                    <TableCell>useWebhookData</TableCell>
                    <TableCell>Query de pedidos no Supabase</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">src/services/asaasService.ts</TableCell>
                    <TableCell>generatePixPayment</TableCell>
                    <TableCell>Consulta de configuração Asaas</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">src/hooks/useCheckoutOrder.ts</TableCell>
                    <TableCell>createOrder</TableCell>
                    <TableCell>Inserção de pedidos e dados de cartão</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">src/pages/api/webhook-simulator.ts</TableCell>
                    <TableCell>handler</TableCell>
                    <TableCell>Atualização de status de pedidos</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supabase nas Funções Netlify</CardTitle>
          <CardDescription>
            Como o Supabase é utilizado nas funções serverless
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-md">
              <h3 className="font-medium">Configuração nas Variáveis de Ambiente</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Nas funções Netlify, o Supabase precisa ser configurado através de variáveis de ambiente:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li><code>SUPABASE_URL</code> - URL do projeto Supabase</li>
                <li><code>SUPABASE_SERVICE_KEY</code> - Chave de serviço do Supabase (não a chave anon/pública)</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800">⚠️ Atenção</h3>
              <p className="text-sm text-amber-700 mt-1">
                Sempre verifique se as variáveis de ambiente estão sendo utilizadas corretamente nas funções Netlify. 
                Utilize validação para garantir que as variáveis estejam definidas antes de usar.
              </p>
              <pre className="bg-black/90 text-white p-3 rounded-md text-xs mt-2 overflow-auto">
{`// Exemplo de validação em função Netlify
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  return {
    statusCode: 500,
    body: JSON.stringify({ 
      error: "Configuração do Supabase ausente" 
    })
  };
}

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
