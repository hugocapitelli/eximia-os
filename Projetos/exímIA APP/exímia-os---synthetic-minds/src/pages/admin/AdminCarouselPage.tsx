import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminHeroCarouselEditor } from '../../../components/pages/AdminHeroCarouselEditor';

export const AdminCarouselPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminHeroCarouselEditor
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

export default AdminCarouselPage;
