
import React from 'react';
import { useAdminToolsState } from './hooks/useAdminToolsState';
import AdminToolsHeader from './components/AdminToolsHeader';
import { AdminToolsTabs } from './components/AdminToolsTabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminTools = () => {
  const {
    settings,
    handleChange,
    handleSwitchChange,
    handleColorChange,
    handleSave,
  } = useAdminToolsState();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <AdminToolsHeader onSave={handleSave} />
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <AdminToolsTabs
                settings={settings}
                handleChange={handleChange}
                handleColorChange={handleColorChange}
                handleSwitchChange={handleSwitchChange}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Pré-visualização</h3>
              <p className="text-gray-500 mb-4">
                Visualize suas alterações em tempo real em uma versão de demonstração do checkout.
              </p>
              <Link to="/admin/preview" target="_blank">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  Abrir Preview
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;
