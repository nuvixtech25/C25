
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppearanceTab from "./components/customization/AppearanceTab";
import ContentTab from "./components/customization/ContentTab";
import TimerTab from "./components/customization/TimerTab";
import ProductTab from "./components/customization/ProductTab";
import AdminToolsHeader from "./components/AdminToolsHeader";
import AdminToolsTabs from "./components/AdminToolsTabs";
import { useAdminToolsState } from "./hooks/useAdminToolsState";

const AdminTools: React.FC = () => {
  const {
    settings,
    handleChange,
    handleSwitchChange,
    handleColorChange,
    handleSave,
  } = useAdminToolsState();

  return (
    <div className="space-y-6">
      <AdminToolsHeader onSave={handleSave} />
      <AdminToolsTabs />

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="timer">Temporizador</TabsTrigger>
          <TabsTrigger value="product">Produto</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <AppearanceTab
            settings={settings}
            onColorChange={handleColorChange}
            onSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab settings={settings} onChange={handleChange} />
        </TabsContent>

        <TabsContent value="timer">
          <TimerTab
            settings={settings}
            onChange={handleChange}
            onSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="product">
          <ProductTab
            settings={settings}
            onChange={handleChange}
            onSwitchChange={handleSwitchChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTools;
