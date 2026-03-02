import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { X, Check } from 'lucide-react';

export interface PlacedText {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface PlacedTextItemProps {
  placedText: PlacedText;
  onRemove: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
}

export function PlacedTextItem({ placedText, onRemove, onUpdateText }: PlacedTextItemProps) {
  const [isEditing, setIsEditing] = useState(placedText.text === '');
  const [value, setValue] = useState(placedText.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLACED_TEXT',
    item: { ...placedText },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const handleSave = () => {
    if (value.trim()) {
      onUpdateText(placedText.id, value.trim());
      setIsEditing(false);
    } else {
      onRemove(placedText.id);
    }
  };

  return (
    <div
      ref={drag as any}
      className={`absolute group ${isDragging ? 'opacity-40' : 'opacity-100'}`}
      style={{ left: placedText.x, top: placedText.y, zIndex: 10 }}
    >
      {isEditing ? (
        <div className="flex items-center gap-1 bg-cream border border-salmon rounded-xl px-3 py-2 shadow-md min-w-[140px]">
          <input
            ref={inputRef}
            autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Type something..."
            className="font-display text-sm text-bistre font-light bg-transparent focus:outline-none w-full placeholder:text-bistre/25 italic"
          />
          <button onClick={handleSave} className="shrink-0 p-0.5 rounded-full hover:bg-blush/60">
            <Check size={12} className="text-garnet" />
          </button>
        </div>
      ) : (
        <div
          className="cursor-move relative"
          onDoubleClick={() => setIsEditing(true)}
        >
          {/* Gold decorative line */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-gold rounded-full opacity-60" />
          <p className="font-display text-lg text-bistre font-light italic pl-2 pr-6 py-1 select-none whitespace-nowrap">
            {placedText.text}
          </p>
          <button
            onClick={() => onRemove(placedText.id)}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-garnet text-cream rounded-full p-1 h-5 w-5 flex items-center justify-center shadow-sm"
          >
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  );
}
