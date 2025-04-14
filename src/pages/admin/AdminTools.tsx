
import React from "react";
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
    </div>
  );
};

export default AdminTools;
