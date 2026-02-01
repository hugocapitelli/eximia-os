import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminUsers } from '../../../components/pages/AdminUsers';

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminUsers
      onBack={() => navigate('/admin/settings')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'admin-settings': '/admin/settings',
        };
        navigate(routeMap[pageId] || '/admin/settings');
      }}
    />
  );
};

export default AdminUsersPage;
