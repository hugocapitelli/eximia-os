import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAcademyStudio } from '../../../components/pages/AdminAcademyStudio';

export const AdminAcademyStudioPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminAcademyStudio
      onBack={() => navigate('/academy')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'academy-editor': '/academy',
          'admin-tracks': '/admin/academy/tracks',
          'admin-carousel': '/admin/academy/carousel',
        };
        navigate(routeMap[pageId] || '/admin/academy');
      }}
    />
  );
};

export default AdminAcademyStudioPage;
