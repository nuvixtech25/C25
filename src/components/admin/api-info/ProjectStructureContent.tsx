
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Folder, GitBranch, Server, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjectStructureUpdate } from '@/hooks/admin/useProjectStructureUpdate';

export const ProjectStructureContent: React.FC = () => {
  const { lastUpdated, isUpdating, handleRefresh, formatLastUpdated } = useProjectStructureUpdate();

  return (
    <div className="space-y-4">
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
    </div>
  );
};
