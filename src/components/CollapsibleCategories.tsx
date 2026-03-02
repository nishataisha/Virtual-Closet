import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Category } from './CategoryManager';
import type { ClothingItemData } from './ClothingItem';
import { ClothingItem } from './ClothingItem';

interface CollapsibleCategoriesProps {
  categories: Category[];
  items: ClothingItemData[];
  onDelete: (id: string) => void;
  onEdit?: (id: string, name: string, imageUrl: string, categoryId: string) => void;
}

export function CollapsibleCategories({ categories, items, onDelete, onEdit }: CollapsibleCategoriesProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const uncategorized = items.filter(item => !categories.find(c => c.id === item.categoryId));

  return (
    <div className="space-y-1">
      {categories.map(category => {
        const folderItems = items.filter(item => item.categoryId === category.id);
        const isOpen = openFolders.has(category.id);

        return (
          <div key={category.id}>
            <button
              onClick={() => toggle(category.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blush/30 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                <span className="font-body text-sm text-bistre">{category.name}</span>
                <span className="font-body text-xs text-bistre/30">({folderItems.length})</span>
              </div>
              {isOpen
                ? <ChevronDown size={13} className="text-bistre/40" />
                : <ChevronRight size={13} className="text-bistre/40" />
              }
            </button>

            {isOpen && (
              <div className="grid grid-cols-2 gap-2 px-2 pb-2 pt-1">
                {folderItems.length === 0 ? (
                  <p className="col-span-2 text-center font-body text-xs text-bistre/30 tracking-widest uppercase py-4">Empty folder</p>
                ) : (
                  folderItems.map(item => (
                    <ClothingItem key={item.id} item={item} onDelete={onDelete} onEdit={onEdit} categories={categories} />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {uncategorized.length > 0 && (
        <div>
          <button
            onClick={() => toggle('__uncategorized__')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blush/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-bistre/20 shrink-0" />
              <span className="font-body text-sm text-bistre">Uncategorized</span>
              <span className="font-body text-xs text-bistre/30">({uncategorized.length})</span>
            </div>
            {openFolders.has('__uncategorized__')
              ? <ChevronDown size={13} className="text-bistre/40" />
              : <ChevronRight size={13} className="text-bistre/40" />
            }
          </button>
          {openFolders.has('__uncategorized__') && (
            <div className="grid grid-cols-2 gap-2 px-2 pb-2 pt-1">
              {uncategorized.map(item => (
                <ClothingItem key={item.id} item={item} onDelete={onDelete} onEdit={onEdit} categories={categories} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
