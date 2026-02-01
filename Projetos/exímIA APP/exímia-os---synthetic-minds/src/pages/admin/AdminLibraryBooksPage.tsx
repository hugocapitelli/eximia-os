import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLibraryBooks } from '../../../components/pages/AdminLibraryBooks';

export const AdminLibraryBooksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLibraryBooks
      onBack={() => navigate('/biblioteca')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'biblioteca': '/biblioteca',
          'admin-authors': '/admin/library/authors',
        };
        navigate(routeMap[pageId] || '/admin/library/books');
      }}
    />
  );
};

export default AdminLibraryBooksPage;
