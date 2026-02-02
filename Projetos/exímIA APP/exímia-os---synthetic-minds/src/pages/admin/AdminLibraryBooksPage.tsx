import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLibraryBooks } from '../../../components/pages/AdminLibraryBooks';

export const AdminLibraryBooksPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLibraryBooks
      onBack={() => navigate('/admin')}
      onNavigate={(pageId) => {
        const routeMap: Record<string, string> = {
          'biblioteca': '/biblioteca',
          'admin-authors': '/admin/library/authors',
        };
        navigate(routeMap[pageId] || '/admin/library/books');
      }}
      onEditSummary={(summaryId) => navigate(`/admin/summaries/${summaryId}/edit`)}
    />
  );
};

export default AdminLibraryBooksPage;
