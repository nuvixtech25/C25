
import React from 'react';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { useAdminToolsState } from './hooks/useAdminToolsState';
import { AdminToolsHeader } from './components/AdminToolsHeader';
import { AdminToolsTabs } from './components/AdminToolsTabs';

const AdminTools: React.FC = () => {
  const customization = useCheckoutCustomization();
  const {
    settings,
    handleChange,
    handleSwitchChange,
    handleColorChange,
    handleSave,
    handlePreview
  } = useAdminToolsState(customization);

  return (
    <div className="space-y-6">
      <AdminToolsHeader 
        onSave={handleSave}
        onPreview={handlePreview}
      />
      
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

