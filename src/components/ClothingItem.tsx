import { useDrag } from 'react-dnd';
import { Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import type { Category } from './CategoryManager';

export interface ClothingItemData {
  id: string;
  name: string;
  imageUrl: string;
  categoryId: string;
}

interface ClothingItemProps {
  item: ClothingItemData;
  onDelete: (id: string) => void;
  onEdit?: (id: string, name: string, imageUrl: string, categoryId: string) => void;
  categories?: Category[];
}

export function ClothingItem({ item, onDelete, onEdit, categories = [] }: ClothingItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [imagePreview, setImagePreview] = useState(item.imageUrl);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [tab, setTab] = useState<'upload' | 'url'>('url');

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CLOTHING_ITEM',
    item: { ...item },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setImageUrl(b64);
      setImagePreview(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (name.trim() && imageUrl.trim() && categoryId && onEdit) {
      onEdit(item.id, name.trim(), imageUrl.trim(), categoryId);
      setIsEditOpen(false);
    }
  };

  return (
    <>
      <div
        ref={drag as any}
        className={`item-card relative group cursor-move bg-white rounded-2xl border border-blush overflow-hidden hover:border-salmon hover:shadow-md transition-all ${
          isDragging ? 'opacity-40 scale-95' : 'opacity-100'
        }`}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="px-3 py-2.5 bg-white">
          <p className="font-body text-xs text-bistre truncate tracking-wide">{item.name}</p>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {onEdit && (
            <button
              className="bg-cream/90 hover:bg-cream p-1.5 rounded-full shadow-sm"
              onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
            >
              <Pencil size={12} className="text-bistre/60" />
            </button>
          )}
          <button
            className="bg-cream/90 hover:bg-cream p-1.5 rounded-full shadow-sm"
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          >
            <Trash2 size={12} className="text-paprika" />
          </button>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 bg-bistre/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-cream border border-blush rounded-2xl p-6 w-full max-w-md shadow-xl space-y-5">
            <div>
              <h2 className="font-display text-2xl text-bistre font-light">Edit Item</h2>
              <p className="font-body text-xs tracking-widest uppercase text-salmon mt-1">Update your piece</p>
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-1.5">Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-2">Image</label>
              <div className="flex gap-2 mb-3">
                {(['url', 'upload'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-xs font-body tracking-widest uppercase rounded-full border transition-colors ${
                      tab === t ? 'bg-garnet text-cream border-garnet' : 'border-blush text-bistre/50 hover:border-salmon'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
              {tab === 'url' ? (
                <input
                  value={imageUrl}
                  onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors"
                />
              ) : (
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs font-body text-bistre/60" />
              )}
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-xl border border-blush" />
              )}
            </div>

            {categories.length > 0 && (
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-1.5">Folder</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex-1 py-2.5 border border-blush rounded-xl text-xs font-body tracking-widest uppercase text-bistre/60 hover:border-salmon transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-garnet text-cream rounded-xl text-xs font-body tracking-widest uppercase hover:bg-bistre transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}