
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export interface AdminToolsHeaderProps {
  onSave: () => Promise<void>;
}

const AdminToolsHeader: React.FC<AdminToolsHeaderProps> = ({ onSave }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Personalização do Checkout</h1>
      <div className="flex space-x-2">
        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default AdminToolsHeader;
