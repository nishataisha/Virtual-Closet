import { useDrag } from 'react-dnd';
import { X } from 'lucide-react';
import type { PlacedItem } from './OutfitCanvas';

interface PlacedClothingItemProps {
  placedItem: PlacedItem;
  onRemove: (id: string) => void;
}

export function PlacedClothingItem({ placedItem, onRemove }: PlacedClothingItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLACED_ITEM',
    item: { ...placedItem },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`absolute cursor-move group ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ left: `${placedItem.x}px`, top: `${placedItem.y}px`, width: '120px', height: '120px' }}
    >
      <img
        src={placedItem.itemData.imageUrl}
        alt={placedItem.itemData.name}
        className="w-full h-full object-cover rounded-lg border-2 border-white shadow-lg"
      />
      <button
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center"
        onClick={() => onRemove(placedItem.id)}
      >
        <X size={14} />
      </button>
    </div>
  );
}