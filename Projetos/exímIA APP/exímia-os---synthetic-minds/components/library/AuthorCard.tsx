import React from 'react';
import { BookOpen, ChevronRight, Brain } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  specialty?: string;
  booksCount: number;
  avatar?: string;
  hasMind?: boolean;
}

interface AuthorCardProps {
  author: Author;
  onClick: (authorId: string) => void;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, onClick }) => {
  // Generate initials from author name
  const initials = author.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={() => onClick(author.id)}
      className="
        group bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6
        hover:border-zinc-700 transition-all duration-300 cursor-pointer
      "
    >
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className="relative">
          <div
            className="
              w-16 h-16 rounded-full bg-gradient-to-br from-amber-900/30 to-amber-600/10
              border border-amber-500/30 flex items-center justify-center
              text-amber-400 text-xl font-bold
              group-hover:border-amber-500/50 transition-colors
            "
          >
            {author.avatar || initials}
          </div>

          {/* Mind Badge */}
          {author.hasMind && (
            <div
              className="
                absolute -bottom-1 -right-1 w-6 h-6 rounded-full
                bg-gradient-to-br from-violet-600 to-violet-500
                border-2 border-[#0A0A0A] flex items-center justify-center
              "
              title="Este autor possui uma Mind"
            >
              <Brain className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors truncate">
            {author.name}
          </h3>
          {author.specialty && (
            <p className="text-xs text-zinc-500 uppercase tracking-wider truncate">
              {author.specialty}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1F1F22]">
        <span className="text-sm text-zinc-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-zinc-600" />
          {author.booksCount} livros
        </span>
        <span className="flex items-center gap-1 text-xs text-amber-500 group-hover:text-amber-400 font-bold uppercase tracking-wider">
          Ver Perfil <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default AuthorCard;
