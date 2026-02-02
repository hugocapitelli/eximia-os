import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminTrackManager } from '../../../components/pages/AdminTrackManager';

export const AdminTrackManagerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminTrackManager
      onBack={() => navigate('/admin/academy')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'admin-academy-studio': '/admin/academy',
        };
        navigate(routeMap[pageId] || '/admin/academy');
      }}
    />
  );
};

export default AdminTrackManagerPage;
