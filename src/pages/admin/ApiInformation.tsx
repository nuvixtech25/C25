
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, KeyRound, Folder } from 'lucide-react';
import { SupabaseInfoContent } from '@/components/admin/api-info/SupabaseInfoContent';
import { AsaasInfoContent } from '@/components/admin/api-info/AsaasInfoContent';
import { ProjectStructureContent } from '@/components/admin/api-info/ProjectStructureContent';

const ApiInformation = () => {
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

        <TabsContent value="supabase">
          <SupabaseInfoContent />
        </TabsContent>

        <TabsContent value="asaas">
          <AsaasInfoContent />
        </TabsContent>

        <TabsContent value="estructura">
          <ProjectStructureContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiInformation;
