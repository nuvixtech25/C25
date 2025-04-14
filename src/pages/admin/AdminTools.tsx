
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceTab } from "./components/customization/AppearanceTab";
import { ContentTab } from "./components/customization/ContentTab";
import { TimerTab } from "./components/customization/TimerTab";
import { ProductTab } from "./components/customization/ProductTab";
import AdminToolsHeader from "./components/AdminToolsHeader";
import { AdminToolsTabs } from "./components/AdminToolsTabs";
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
      <AdminToolsTabs 
        settings={settings}
        handleChange={handleChange}
        handleColorChange={handleColorChange}
        handleSwitchChange={handleSwitchChange}
      />

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
            handleChange={handleChange}
            handleColorChange={handleColorChange}
          />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab settings={settings} handleChange={handleChange} />
        </TabsContent>

        <TabsContent value="timer">
          <TimerTab
            settings={settings}
            handleChange={handleChange}
          />
        </TabsContent>

        <TabsContent value="product">
          <ProductTab
            settings={settings}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTools;
