import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  icon: string;
  bookCount: number;
}

interface CollectionCardProps {
  collection: Collection;
  onClick: (collectionId: string) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(collection.id)}
      className="
        group flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#1F1F22]
        rounded-xl cursor-pointer transition-all duration-300
        hover:border-amber-500/30 hover:bg-amber-500/5
      "
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
        {collection.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white group-hover:text-amber-50 transition-colors truncate">
          {collection.name}
        </h4>
        <p className="text-xs text-zinc-500 mt-0.5">
          {collection.bookCount} livros
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors flex-shrink-0" />
    </div>
  );
};

export default CollectionCard;
