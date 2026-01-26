import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookDetail from './pages/BookDetail';
import CategoryView from './pages/CategoryView';
import Profile from './pages/Profile';
import LabelExport from './pages/LabelExport';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddBookModal from './modals/AddBookModal';

// Contexts
export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export const SearchContext = createContext({
  searchQuery: '',
  setSearchQuery: (query: string) => {},
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-200">
      <Header />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </div>

      {/* Floating Action Button (Only on Dashboard) */}
      {location.pathname === '/' && (
        <button 
          onClick={() => setIsAddBookOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-full px-6 py-4 shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 group"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-bold text-base whitespace-nowrap hidden md:inline-block">Adicionar Novo Livro</span>
        </button>
      )}

      {isAddBookOpen && <AddBookModal onClose={() => setIsAddBookOpen(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark';
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Theme Toggler
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Ensure correct class on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/books/:id" element={<Layout><BookDetail /></Layout>} />
            <Route path="/category/:id" element={<Layout><CategoryView /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/export" element={<Layout><LabelExport /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </SearchContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;