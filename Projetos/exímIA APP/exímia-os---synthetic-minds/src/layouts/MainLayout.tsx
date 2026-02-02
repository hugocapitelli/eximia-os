import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/organisms/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-amber-500/30 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 ease-in-out ml-20 md:ml-64">
        <Outlet />
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
