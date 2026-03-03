import { useDrop } from 'react-dnd';
import type { ClothingItemData } from './ClothingItem';
import { PlacedClothingItem } from './PlacedClothingItem';
import { PlacedTextItem } from './PlacedTextItem';
import type { PlacedText } from './PlacedTextItem';
import { Type } from 'lucide-react';

export interface PlacedItem {
  id: string;
  itemData: ClothingItemData;
  x: number;
  y: number;
}

interface OutfitCanvasProps {
  placedItems: PlacedItem[];
  placedTexts: PlacedText[];
  onAddItem: (item: PlacedItem) => void;
  onRemoveItem: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onAddText: (text: PlacedText) => void;
  onRemoveText: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onUpdateTextPosition: (id: string, x: number, y: number) => void;
}

export function OutfitCanvas({
  placedItems, placedTexts,
  onAddItem, onRemoveItem, onUpdatePosition,
  onAddText, onRemoveText, onUpdateText, onUpdateTextPosition,
}: OutfitCanvasProps) {

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['CLOTHING_ITEM', 'PLACED_ITEM', 'PLACED_TEXT'],
    drop: (item: any, monitor) => {
      const itemType = monitor.getItemType();
      const offset = monitor.getClientOffset();
      const canvas = document.getElementById('outfit-canvas');
      if (offset && canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(offset.x - rect.left - 60, rect.width - 120));
        const y = Math.max(0, Math.min(offset.y - rect.top - 60, rect.height - 120));

        if (itemType === 'CLOTHING_ITEM') {
          onAddItem({ id: `placed-${Date.now()}-${Math.random()}`, itemData: item as ClothingItemData, x, y });
        } else if (itemType === 'PLACED_ITEM') {
          onUpdatePosition(item.id, x, y);
        } else if (itemType === 'PLACED_TEXT') {
          onUpdateTextPosition(item.id, x, y);
        }
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [onAddItem, onUpdatePosition, onUpdateTextPosition]);

  const handleAddText = () => {
    const canvas = document.getElementById('outfit-canvas');
    const rect = canvas?.getBoundingClientRect();
    onAddText({
      id: `text-${Date.now()}`,
      text: '',
      x: rect ? rect.width / 2 - 70 : 100,
      y: rect ? rect.height / 2 - 20 : 100,
    });
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleAddText}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body tracking-widest uppercase border border-blush rounded-full hover:border-gold hover:text-gold text-bistre/50 transition-colors"
        >
          <Type size={11} /> Add Text
        </button>
        <p className="font-body text-xs text-bistre/25 tracking-widest uppercase">Double-click text to edit</p>
      </div>

      {/* Canvas */}
      <div
        id="outfit-canvas"
        ref={drop as any}
        className={`relative flex-1 rounded-2xl border-2 border-dashed transition-colors ${
          isOver ? 'border-salmon bg-blush/10' : 'border-blush bg-white/60'
        }`}
      >
        {placedItems.length === 0 && placedTexts.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
            <p className="font-display text-2xl text-bistre/15 font-light italic">Drop pieces here</p>
            <p className="font-body text-xs text-bistre/20 tracking-widest uppercase">to build your outfit</p>
          </div>
        )}

        {placedItems.map(placedItem => (
          <PlacedClothingItem key={placedItem.id} placedItem={placedItem} onRemove={onRemoveItem} />
        ))}

        {placedTexts.map(pt => (
          <PlacedTextItem
            key={pt.id}
            placedText={pt}
            onRemove={onRemoveText}
            onUpdateText={onUpdateText}
          />
        ))}
      </div>
    </div>
  );
}