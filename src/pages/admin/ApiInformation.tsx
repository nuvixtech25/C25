
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, KeyRound, Code, FileCode, GitBranch, Folder, Server, RefreshCw, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ApiInformation = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsUpdating(true);
    
    // Simulando uma atualização que leva tempo
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsUpdating(false);
      
      toast({
        title: "Informações atualizadas",
        description: "A estrutura do projeto foi atualizada com sucesso.",
        variant: "default",
      });
    }, 1000);
  };

  const formatLastUpdated = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Informações de API</h1>
        <p className="text-muted-foreground">
          Veja como as APIs estão configuradas e conheça a estrutura do projeto.
        </p>
      </div>

      <Tabs defaultValue="supabase">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="supabase">
            <Database className="h-4 w-4 mr-2" />
            Supabase
          </TabsTrigger>
          <TabsTrigger value="asaas">
            <KeyRound className="h-4 w-4 mr-2" />
            Asaas
          </TabsTrigger>
          <TabsTrigger value="estructura">
            <Folder className="h-4 w-4 mr-2" />
            Estrutura do Projeto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supabase" className="space-y-4">
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

const SUPABASE_URL = "https://onysoawoiffinwewtsex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);`}
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
        </TabsContent>

        <TabsContent value="asaas" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="estructura" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Estrutura do Projeto</CardTitle>
                <CardDescription>
                  Organização de diretórios e arquivos principais
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  size="sm"
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Atualizar Estrutura
                    </>
                  )}
                </Button>
                <div className="text-xs text-muted-foreground flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Atualizado em: {formatLastUpdated(lastUpdated)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-medium">
                    <Folder className="h-4 w-4 mr-2 inline" /> Estrutura de Diretórios
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-primary/5 rounded-md font-mono text-xs">
                      <p>📁 src/</p>
                      <p className="ml-4">📁 components/ - Componentes reutilizáveis</p>
                      <p className="ml-8">📁 ui/ - Componentes base da UI (shadcn)</p>
                      <p className="ml-8">📁 checkout/ - Componentes do checkout</p>
                      <p className="ml-8">📁 admin/ - Componentes do painel admin</p>
                      <p className="ml-4">📁 contexts/ - Contextos React</p>
                      <p className="ml-4">📁 hooks/ - Hooks customizados</p>
                      <p className="ml-8">📁 admin/ - Hooks do painel admin</p>
                      <p className="ml-4">📁 integrations/ - Integrações com serviços externos</p>
                      <p className="ml-8">📁 supabase/ - Integração com Supabase</p>
                      <p className="ml-4">📁 layouts/ - Layouts de página</p>
                      <p className="ml-4">📁 lib/ - Utilitários e helpers</p>
                      <p className="ml-4">📁 pages/ - Páginas da aplicação</p>
                      <p className="ml-8">📁 admin/ - Páginas do painel admin</p>
                      <p className="ml-8">📁 api/ - Endpoints da API cliente</p>
                      <p className="ml-4">📁 services/ - Serviços para comunicação com APIs</p>
                      <p className="ml-4">📁 types/ - Definições de tipos TypeScript</p>
                      <p className="ml-4">📁 utils/ - Funções utilitárias</p>
                      <p>📁 netlify/</p>
                      <p className="ml-4">📁 functions/ - Funções serverless da Netlify</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="font-medium">
                    <Server className="h-4 w-4 mr-2 inline" /> Funções Netlify
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome da Função</TableHead>
                          <TableHead>Propósito</TableHead>
                          <TableHead>Dependências</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-mono text-xs">create-asaas-customer.ts</TableCell>
                          <TableCell>Criar cliente e pagamento no Asaas</TableCell>
                          <TableCell>Supabase, Asaas API</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono text-xs">check-payment-status.ts</TableCell>
                          <TableCell>Verificar status de pagamento no Asaas</TableCell>
                          <TableCell>Supabase, Asaas API</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-mono text-xs">asaas-webhook.ts</TableCell>
                          <TableCell>Receber notificações do Asaas</TableCell>
                          <TableCell>Supabase</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mt-4">
                      <h3 className="font-medium text-amber-800">⚠️ Dica de Implementação</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Todas as funções Netlify devem seguir um padrão de validação de entradas, tratamento de erros 
                        e resposta padronizada. Veja o exemplo:
                      </p>
                      <pre className="bg-black/90 text-white p-3 rounded-md text-xs mt-2 overflow-auto">
{`// Padrão para funções Netlify
export const handler = async (event, context) => {
  // 1. Validar método HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  // 2. Validar variáveis de ambiente
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuração Supabase incompleta' })
    };
  }

  // 3. Inicializar clientes
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 4. Processar a requisição
    const payload = JSON.parse(event.body);
    
    // 5. Validar payload
    if (!payload.campo_obrigatorio) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Campo obrigatório ausente' })
      };
    }
    
    // 6. Lógica principal
    const resultado = await processarLogica(payload, supabase);
    
    // 7. Retornar resposta de sucesso
    return {
      statusCode: 200,
      body: JSON.stringify(resultado)
    };
  } catch (error) {
    // 8. Tratar erros
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erro interno no servidor',
        detail: error.message
      })
    };
  }
};`}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="font-medium">
                    <GitBranch className="h-4 w-4 mr-2 inline" /> Commits e Controle de Versão
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-primary/5 rounded-md space-y-3">
                      <h3 className="font-medium">Padrão de Commits</h3>
                      <p className="text-sm text-muted-foreground">
                        Nossos commits seguem um padrão para facilitar a compreensão do histórico:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-2">
                        <li><strong>feat:</strong> Nova funcionalidade (ex: <code>feat: adicionado simulador de webhook</code>)</li>
                        <li><strong>fix:</strong> Correção de bugs (ex: <code>fix: corrigido erro na validação do cartão</code>)</li>
                        <li><strong>refactor:</strong> Refatoração de código (ex: <code>refactor: reorganizado hooks do checkout</code>)</li>
                        <li><strong>style:</strong> Mudanças na formatação (ex: <code>style: ajustado espaçamento no checkout</code>)</li>
                        <li><strong>docs:</strong> Documentação (ex: <code>docs: adicionado comentários nas funções Netlify</code>)</li>
                        <li><strong>test:</strong> Testes (ex: <code>test: adicionado testes para o checkout</code>)</li>
                        <li><strong>chore:</strong> Manutenção (ex: <code>chore: atualizado dependências</code>)</li>
                      </ul>
                      
                      <h3 className="font-medium mt-4">Exemplos de Commits Recentes</h3>
                      <div className="bg-black/90 text-white p-3 rounded-md text-xs overflow-auto">
                        <p><code>feat: implementado simulador de webhook para testes de pagamento</code></p>
                        <p><code>fix: corrigido erro na integração com Asaas nas funções Netlify</code></p>
                        <p><code>refactor: modularizado hooks do admin para melhor reutilização</code></p>
                        <p><code>docs: documentado estrutura de APIs e informações do projeto</code></p>
                        <p><code>chore: atualizado versões dos componentes shadcn/ui</code></p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Boas Práticas do Projeto</CardTitle>
              <CardDescription>
                Diretrizes para o desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-md">
                  <h3 className="font-medium">Padrões de Codificação</h3>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-2">
                    <li><strong>Organização:</strong> Componentes pequenos e focados em uma responsabilidade</li>
                    <li><strong>TypeScript:</strong> Usar tipagem forte para todos os componentes e funções</li>
                    <li><strong>Hooks:</strong> Extrair lógica complexa para hooks customizados</li>
                    <li><strong>Context API:</strong> Usar para estado global quando necessário</li>
                    <li><strong>Funções Netlify:</strong> Validar entradas e tratar erros consistentemente</li>
                    <li><strong>Segurança:</strong> Nunca expor chaves de API no frontend</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-medium text-green-800">✅ Checklist de Segurança</h3>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-green-700">
                    <li>Chaves de API do Asaas armazenadas no Supabase ou variáveis de ambiente da Netlify</li>
                    <li>Chave de serviço do Supabase só usada nas funções Netlify, nunca no frontend</li>
                    <li>Validação de dados de entrada em todas as funções serverless</li>
                    <li>Tratamento adequado de erros sem expor detalhes sensíveis ao usuário</li>
                    <li>Políticas de segurança (RLS) configuradas no Supabase para acesso às tabelas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiInformation;
