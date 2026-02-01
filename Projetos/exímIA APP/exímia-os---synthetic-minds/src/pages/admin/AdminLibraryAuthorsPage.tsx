import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLibraryAuthors } from '../../../components/pages/AdminLibraryAuthors';

export const AdminLibraryAuthorsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLibraryAuthors
      onBack={() => navigate('/biblioteca')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'biblioteca': '/biblioteca',
          'admin-books': '/admin/library/books',
        };
        navigate(routeMap[pageId] || '/admin/library/authors');
      }}
    />
  );
};

export default AdminLibraryAuthorsPage;
