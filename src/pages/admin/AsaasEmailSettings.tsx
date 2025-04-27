import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { asaasEmailConfigService } from "@/services/asaasEmailConfigService";
import AccessDeniedCard from "./components/AccessDeniedCard";

const AsaasEmailSettings = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [useTempEmail, setUseTempEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await asaasEmailConfigService.getEmailConfig();
    if (config) {
      setUseTempEmail(config.use_temp_email);
      setTempEmail(config.temp_email || "");
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await asaasEmailConfigService.updateEmailConfig({
        use_temp_email: useTempEmail,
        temp_email: tempEmail || null,
      });

      if (success) {
        toast({
          title: "Configurações salvas",
          description:
            "As configurações de email foram atualizadas com sucesso.",
        });
      } else {
        throw new Error("Falha ao salvar configurações");
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações de email.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <AccessDeniedCard
        title="Configurações de Email do Asaas"
        description="Você não tem permissão para acessar esta página."
      />
    );
  }

  if (isLoading) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Configurações de Email do Asaas
        </h1>
        <p className="text-muted-foreground">
          Configure o uso de email temporário para pedidos no Asaas.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={useTempEmail}
            onCheckedChange={setUseTempEmail}
            id="use-temp-email"
          />
          <label htmlFor="use-temp-email">
            Usar email temporário para pedidos no Asaas
          </label>
        </div>

        {useTempEmail && (
          <div className="space-y-2">
            <label htmlFor="temp-email" className="text-sm font-medium">
              Email Temporário
            </label>
            <Input
              id="temp-email"
              type="email"
              placeholder="Digite o email temporário"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
            />
          </div>
        )}

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default AsaasEmailSettings;
