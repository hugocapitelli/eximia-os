import React from 'react';
import { AcademyCourse } from '../../types';
import { Badge } from '../atoms/Badge';
import { Clock, Book, Play, Lock, Heart, PlayCircle, Code, Users, TrendingUp, Sparkles, Terminal, Box } from 'lucide-react';
import { Button } from '../atoms/Button';

interface AcademyCourseCardProps {
  course: AcademyCourse;
  onClick: () => void;
}

export const AcademyCourseCard: React.FC<AcademyCourseCardProps> = ({ course, onClick }) => {
  // Logic to determine icon and style based on category/title to match the screenshots
  const isVibecoding = course.title.toLowerCase().includes('vibecoding');
  const isSales = course.category === 'Vendas';
  const isAI = course.category === 'AI';

  const getIcon = () => {
      if (isVibecoding) return <Box className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />;
      if (isSales) return <TrendingUp className="w-12 h-12 text-amber-200 drop-shadow-[0_0_10px_rgba(253,186,116,0.5)]" />;
      if (isAI) return <Sparkles className="w-12 h-12 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />;
      return <Users className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />;
  };

  const getGradient = () => {
      if (isVibecoding) return 'bg-gradient-to-br from-cyan-900/40 via-blue-900/20 to-transparent';
      if (isSales) return 'bg-gradient-to-br from-amber-900/40 via-orange-900/20 to-transparent';
      if (isAI) return 'bg-gradient-to-br from-purple-900/40 via-fuchsia-900/20 to-transparent';
      return 'bg-gradient-to-br from-emerald-900/40 via-teal-900/20 to-transparent';
  };

  return (
    <div 
        onClick={onClick}
        className="group relative flex flex-col bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl overflow-hidden cursor-pointer h-full hover:border-zinc-700 transition-all duration-300"
    >
      {/* Cover / Icon Area */}
      <div className={`h-40 w-full relative flex items-center justify-center overflow-hidden`}>
         {/* Background Glow */}
         <div className={`absolute inset-0 ${getGradient()} opacity-50 group-hover:opacity-70 transition-opacity`} />
         
         {/* 3D-like Icon Centered */}
         <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
             {getIcon()}
         </div>

         {/* Heart Icon top left */}
         <div className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 text-zinc-500 hover:text-white transition-colors">
             <Heart className="w-4 h-4" />
         </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative z-10">
        <div className="mb-4">
             <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 mb-2 block">
                 {course.category}
             </span>
             <h3 className="font-bold text-lg text-white leading-tight group-hover:text-zinc-200 transition-colors line-clamp-2">
                {course.title}
             </h3>
        </div>
        
        {/* Author / Metadata */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#1F1F22]">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700">
                    AN
                </div>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Alan Nicolas</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                <PlayCircle className="w-3.5 h-3.5" />
                <span>{course.lessonsCount} aulas</span>
            </div>
        </div>
      </div>
    </div>
  );
};