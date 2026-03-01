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
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
        <Plus size={16} /> Add Clothing Item
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">Add New Clothing Item</h2>

            <div>
              <label className="text-sm font-medium block mb-1">Item Name</label>
              <input value={itemName} onChange={e => setItemName(e.target.value)}
                placeholder="e.g., White T-Shirt" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Image</label>
              <div className="flex gap-2 mb-2">
                <button onClick={() => setTab('upload')}
                  className={`flex-1 py-1 text-sm rounded-lg border ${tab === 'upload' ? 'bg-gray-100 font-medium' : ''}`}>
                  Upload
                </button>
                <button onClick={() => setTab('url')}
                  className={`flex-1 py-1 text-sm rounded-lg border ${tab === 'url' ? 'bg-gray-100 font-medium' : ''}`}>
                  URL
                </button>
              </div>

              {tab === 'upload' ? (
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />
              ) : (
                <input value={itemImageUrl} onChange={e => { setItemImageUrl(e.target.value); setImagePreview(e.target.value); }}
                  placeholder="https://example.com/image.jpg" className="w-full border rounded-lg px-3 py-2 text-sm" />
              )}

              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-lg" />}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Folder</label>
              <select value={selectedCategoryId} onChange={e => setSelectedCategoryId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select a folder</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="flex-1 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleAdd}
                disabled={!itemName.trim() || !itemImageUrl.trim() || !selectedCategoryId}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}