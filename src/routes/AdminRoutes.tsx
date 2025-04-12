
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTools from '@/pages/admin/AdminTools';

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
    </Routes>
  );
};

export default AdminRoutes;
