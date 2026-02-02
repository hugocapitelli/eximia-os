import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAccessControl } from '../../../components/pages/AdminAccessControl';

export const AdminAccessControlPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminAccessControl
      onBack={() => navigate('/admin/settings')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'admin-settings': '/admin/settings',
          'admin-academy-studio': '/admin/academy',
        };
        navigate(routeMap[pageId] || '/admin/settings');
      }}
    />
  );
};

export default AdminAccessControlPage;
