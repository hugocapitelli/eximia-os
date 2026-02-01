import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDSTokens } from '../../../components/pages/AdminDSTokens';

export const AdminDSTokensPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminDSTokens
      onBack={() => navigate('/design-system')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'ds-library': '/design-system',
          'admin-components': '/admin/ds/components',
        };
        navigate(routeMap[pageId] || '/admin/ds/tokens');
      }}
    />
  );
};

export default AdminDSTokensPage;
