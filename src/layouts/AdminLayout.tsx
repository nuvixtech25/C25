
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, CreditCard, Settings, CreditCard as AsaasIcon, Webhook, ShoppingCart, CreditCard as CreditCardIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/admin/products" className="font-bold text-xl text-primary">
            Painel Administrativo
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="bg-white shadow-sm rounded-md overflow-hidden">
            <div className="p-4 bg-primary/5 border-b border-border">
              <h3 className="font-medium">Menu</h3>
            </div>
            <ul className="p-2">
              <li>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Produtos</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Pedidos</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/credit-cards"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  <span>Cartões de Crédito</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/pix-settings"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Configurações PIX</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/asaas-settings"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <AsaasIcon className="h-4 w-4" />
                  <span>Configurações Asaas</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/webhook-simulator"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <Webhook className="h-4 w-4" />
                  <span>Simulador de Webhook</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/tools"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/5 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Ferramentas</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
