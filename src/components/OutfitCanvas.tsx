import { useDrop } from 'react-dnd';
import type { ClothingItemData } from './ClothingItem';
import { PlacedClothingItem } from './PlacedClothingItem';
export interface PlacedItem {
  id: string;
  itemData: ClothingItemData;
  x: number;
  y: number;
}
interface OutfitCanvasProps {
  placedItems: PlacedItem[];
  onAddItem: (item: PlacedItem) => void;
  onRemoveItem: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
}
export function OutfitCanvas({ placedItems, onAddItem, onRemoveItem, onUpdatePosition }: OutfitCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['CLOTHING_ITEM', 'PLACED_ITEM'],
    drop: (item: ClothingItemData | PlacedItem, monitor) => {
      const itemType = monitor.getItemType();
      const offset = monitor.getClientOffset();
      const canvas = document.getElementById('outfit-canvas');
      
      if (offset && canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const x = offset.x - canvasRect.left - 60; // Center the item
        const y = offset.y - canvasRect.top - 60;
        const constrainedX = Math.max(0, Math.min(x, canvasRect.width - 120));
        const constrainedY = Math.max(0, Math.min(y, canvasRect.height - 120));
        
        if (itemType === 'CLOTHING_ITEM') {
          // Adding a new item from the closet
          onAddItem({
            id: `placed-${Date.now()}-${Math.random()}`,
            itemData: item as ClothingItemData,
            x: constrainedX,
            y: constrainedY,
          });
        } else if (itemType === 'PLACED_ITEM') {
          // Repositioning an existing item on the canvas
          const placedItem = item as PlacedItem;
          onUpdatePosition(placedItem.id, constrainedX, constrainedY);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [onAddItem, onUpdatePosition]);
  return (
    <div
      id="outfit-canvas"
      ref={drop as any}
      className={`relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {placedItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p className="text-lg">Drag clothing items here to create an outfit</p>
        </div>
      )}
      
      {placedItems.map((placedItem) => (
        <PlacedClothingItem
          key={placedItem.id}
          placedItem={placedItem}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}