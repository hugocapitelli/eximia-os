import React from 'react';
import { Outlet } from 'react-router-dom';

export const FullscreenLayout: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-zinc-200 font-sans selection:bg-amber-500/30 selection:text-white">
      <Outlet />

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
