import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDSComponents } from '../../../components/pages/AdminDSComponents';

export const AdminDSComponentsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminDSComponents
      onBack={() => navigate('/design-system')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'ds-library': '/design-system',
          'admin-tokens': '/admin/ds/tokens',
        };
        navigate(routeMap[pageId] || '/admin/ds/components');
      }}
    />
  );
};

export default AdminDSComponentsPage;
