import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Category } from './CategoryManager';

interface AddItemDialogProps {
  categories: Category[];
  onAddItem: (name: string, imageUrl: string, categoryId: string) => void;
}

export function AddItemDialog({ categories, onAddItem }: AddItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [tab, setTab] = useState<'upload' | 'url'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setItemImageUrl(b64);
      setImagePreview(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (itemName.trim() && itemImageUrl.trim() && selectedCategoryId) {
      onAddItem(itemName.trim(), itemImageUrl.trim(), selectedCategoryId);
      setItemName(''); setItemImageUrl(''); setImagePreview(''); setSelectedCategoryId('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-garnet text-cream rounded-full text-xs font-body tracking-widest uppercase hover:bg-bistre transition-colors"
      >
        <Plus size={13} /> Add Item
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-bistre/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-cream border border-blush rounded-2xl p-6 w-full max-w-md shadow-xl space-y-5">
            <div>
              <h2 className="font-display text-2xl text-bistre font-light">Add New Item</h2>
              <p className="font-body text-xs tracking-widest uppercase text-salmon mt-1">Add to your collection</p>
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-1.5">Item Name</label>
              <input
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="e.g. White Linen Blouse"
                className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors"
              />
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-2">Image</label>
              <div className="flex gap-2 mb-3">
                {(['upload', 'url'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 text-xs font-body tracking-widest uppercase rounded-full border transition-colors ${
                      tab === t
                        ? 'bg-garnet text-cream border-garnet'
                        : 'border-blush text-bistre/50 hover:border-salmon'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {tab === 'upload' ? (
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs font-body text-bistre/60" />
              ) : (
                <input
                  value={itemImageUrl}
                  onChange={e => { setItemImageUrl(e.target.value); setImagePreview(e.target.value); }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors"
                />
              )}

              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-3 w-full h-44 object-cover rounded-xl border border-blush" />
              )}
            </div>

            <div>
              <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-1.5">Folder</label>
              <select
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
                className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors"
              >
                <option value="">Select a folder</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 border border-blush rounded-xl text-xs font-body tracking-widest uppercase text-bistre/60 hover:border-salmon transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!itemName.trim() || !itemImageUrl.trim() || !selectedCategoryId}
                className="flex-1 py-2.5 bg-garnet text-cream rounded-xl text-xs font-body tracking-widest uppercase hover:bg-bistre transition-colors disabled:opacity-40"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
