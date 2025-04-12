
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTools from '@/pages/admin/AdminTools';
import DashboardPage from '@/pages/admin/dashboard';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/tools" 
        element={
          <ProtectedRoute>
            <AdminTools />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
