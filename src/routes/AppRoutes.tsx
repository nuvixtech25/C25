
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import PublicRoutes from './PublicRoutes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
