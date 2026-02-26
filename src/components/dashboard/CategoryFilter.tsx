import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  color?: string;
}

const defaultCategories: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'devtools', label: 'DevTools' },
  { id: 'web3', label: 'Web3' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'experimental', label: 'Experimental' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'trending-today', label: 'Trending Today' },
];

interface CategoryFilterProps {
  className?: string;
  selectedCategories: string[];
  categories?: Category[];
  onCategoryChange: (categories: string[]) => void;
}

export function CategoryFilter({
  className,
  selectedCategories,
  categories = defaultCategories,
  onCategoryChange,
}: CategoryFilterProps) {
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      onCategoryChange(['all']);
      return;
    }

    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories.filter(id => id !== 'all'), categoryId];

    onCategoryChange(newSelection.length > 0 ? newSelection : ['all']);
  };

  const handleRemoveCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleCategoryClick(categoryId);
  };

  const getActiveCategories = () => {
    if (selectedCategories.includes('all') || selectedCategories.length === 0) {
      return ['all'];
    }
    return selectedCategories;
  };

  const activeCategories = getActiveCategories();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((category) => {
          const isActive = activeCategories.includes(category.id);
          const showRemove = isActive && category.id !== 'all' && activeCategories.length > 1;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors whitespace-nowrap',
                'hover:bg-surface',
                isActive
                  ? 'bg-surface border-blue text-primary'
                  : 'border-border text-secondary hover:text-primary',
                'focus:outline-none focus:ring-2 focus:ring-blue'
              )}
            >
              <span className="text-sm font-medium">{category.label}</span>
              {showRemove && (
                <X
                  className="w-3 h-3 text-secondary hover:text-primary"
                  onClick={(e) => handleRemoveCategory(category.id, e)}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {activeCategories.length > 1 && (
        <button
          onClick={() => onCategoryChange(['all'])}
          className="text-xs text-secondary hover:text-primary transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
