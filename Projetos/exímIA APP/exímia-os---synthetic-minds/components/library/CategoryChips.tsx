import React from 'react';

interface CategoryChipsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
              px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest
              transition-all whitespace-nowrap border
              ${isActive
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-[#0A0A0A] text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
              }
            `}
          >
            {category.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
