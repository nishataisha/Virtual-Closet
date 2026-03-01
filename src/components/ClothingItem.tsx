import { useDrag } from 'react-dnd';
import { Trash2 } from 'lucide-react';

export interface ClothingItemData {
  id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
}

interface ClothingItemProps {
  item: ClothingItemData;
  onDelete: (id: string) => void;
}

export function ClothingItem({ item, onDelete }: ClothingItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CLOTHING_ITEM',
    item: { ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`relative group cursor-move bg-white rounded-lg border-2 border-gray-200 overflow-hidden transition-all hover:border-blue-400 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="aspect-square">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-2 bg-white">
        <p className="text-sm truncate">{item.name}</p>
      </div>
      <button
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white p-1 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        <Trash2 size={16} className="text-red-500" />
      </button>
    </div>
  );
}