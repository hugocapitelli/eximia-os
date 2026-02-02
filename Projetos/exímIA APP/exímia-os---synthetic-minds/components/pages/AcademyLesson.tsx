import React from 'react';
import { ACADEMY_COURSES, ACADEMY_LESSONS } from '../../constants';
import { SocraticChat } from '../academy/SocraticChat';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { ChevronLeft, CheckCircle2, Lock, Unlock, PlayCircle } from 'lucide-react';

interface AcademyLessonProps {
    courseId: string;
    onBack: () => void;
}

export const AcademyLesson: React.FC<AcademyLessonProps> = ({ courseId, onBack }) => {
  const course = ACADEMY_COURSES.find(c => c.id === courseId);
  // Defaulting to lesson 2 (unlocked/in progress) for demo
  const currentLesson = ACADEMY_LESSONS.find(l => l.courseId === courseId && l.status === 'unlocked') || ACADEMY_LESSONS[0];
  const allLessons = ACADEMY_LESSONS.filter(l => l.courseId === courseId).sort((a,b) => a.order - b.order);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#09090B] overflow-hidden">
        {/* Left Sidebar: Syllabus */}
        <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] flex flex-col shrink-0">
             <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                 <button onClick={onBack} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                     <ChevronLeft className="w-5 h-5 text-zinc-500" />
                 </button>
                 <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{course.title}</span>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-1">
                 {allLessons.map(lesson => (
                     <button 
                        key={lesson.id}
                        disabled={lesson.status === 'locked'}
                        className={`
                            w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors
                            ${lesson.id === currentLesson.id 
                                ? 'bg-eximia-50 dark:bg-eximia-900/10 border border-eximia-200 dark:border-eximia-800/30' 
                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent'}
                            ${lesson.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                     >
                         <div className="mt-0.5">
                             {lesson.status === 'completed' ? (
                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             ) : lesson.status === 'locked' ? (
                                 <Lock className="w-4 h-4 text-zinc-400" />
                             ) : (
                                 <PlayCircle className="w-4 h-4 text-eximia-500" />
                             )}
                         </div>
                         <div>
                             <p className={`text-sm font-medium ${lesson.id === currentLesson.id ? 'text-eximia-700 dark:text-eximia-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                 {lesson.order}. {lesson.title}
                             </p>
                             <p className="text-xs text-zinc-500 mt-0.5">{lesson.durationMinutes} min</p>
                         </div>
                     </button>
                 ))}
             </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
            {/* Content (Text/Video) */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar max-w-3xl mx-auto">
                 <div className="mb-6">
                     <Badge variant="outline" className="mb-2">Lição {currentLesson.order}</Badge>
                     <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 font-serif mb-4">{currentLesson.title}</h1>
                 </div>

                 <div className="prose dark:prose-invert prose-zinc max-w-none font-serif leading-relaxed">
                     {/* Rendering pseudo-markdown manually for demo */}
                     {currentLesson.content.split('\n').map((line, idx) => {
                         if (line.trim().startsWith('# ')) return <h1 key={idx} className="text-2xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
                         if (line.trim().startsWith('## ')) return <h2 key={idx} className="text-xl font-bold mt-6 mb-3 text-zinc-800 dark:text-zinc-200">{line.replace('## ', '')}</h2>;
                         if (line.trim().startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-eximia-400 pl-4 italic text-zinc-600 dark:text-zinc-400 my-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-r-lg">{line.replace('> ', '')}</blockquote>;
                         if (line.trim().startsWith('1. ')) return <li key={idx} className="ml-4 list-decimal marker:text-eximia-500">{line.replace('1. ', '')}</li>;
                         return <p key={idx} className="mb-4 text-lg">{line}</p>;
                     })}
                 </div>

                 <div className="mt-12 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                     <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">Próximo Passo</h3>
                     <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                         Para concluir esta lição e desbloquear a próxima, você precisa completar a Sessão Socrática ao lado. A IA irá testar sua compreensão dos conceitos de "Job to be Done".
                     </p>
                 </div>
            </div>

            {/* Right Sidebar: Socratic Chat */}
            <div className="w-[400px] border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090B] p-4 flex flex-col">
                 <SocraticChat 
                    initialMessage="Baseado no que você leu sobre Jobs to be Done, por que você acha que as pessoas compram milkshakes pela manhã? (Pense no 'trabalho' que o milkshake faz)"
                    onComplete={() => alert("Lição Concluída! Próxima lição desbloqueada.")}
                 />
            </div>
        </div>
    </div>
  );
};