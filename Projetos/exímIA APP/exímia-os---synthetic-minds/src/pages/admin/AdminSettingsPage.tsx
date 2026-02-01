import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSettings } from '../../../components/pages/AdminSettings';

export const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminSettings
      onBack={() => navigate('/academy')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'admin-users': '/admin/users',
          'admin-access-control': '/admin/access-control',
          'admin-academy-studio': '/admin/academy',
          'academy-dashboard': '/academy',
        };
        navigate(routeMap[pageId] || '/admin/settings');
      }}
    />
  );
};

export default AdminSettingsPage;
