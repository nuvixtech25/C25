
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminTools from '@/pages/admin/AdminTools';

const AdminRoutes: React.FC = () => {
  return (
    <>
      <Route 
        path="/admin/tools" 
        element={
          <ProtectedRoute>
            <AdminTools />
          </ProtectedRoute>
        } 
      />
    </>
  );
};

export default AdminRoutes;
