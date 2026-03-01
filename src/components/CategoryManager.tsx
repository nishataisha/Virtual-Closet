import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string, color: string) => void;
  onUpdateCategory: (id: string, name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f97316', '#84cc16', '#06b6d4', '#6366f1', '#d946ef'
];

function Modal({ open, onClose, title, description, children }: {
  open: boolean; onClose: () => void; title: string; description: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {children}
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 w-full text-center">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {PRESET_COLORS.map(color => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`w-10 h-10 rounded-full transition-transform ${value === color ? 'ring-2 ring-offset-2 ring-black scale-110' : ''}`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

export function CategoryManager({
  categories, onAddCategory, onUpdateCategory, onDeleteCategory, selectedCategory, onSelectCategory,
}: CategoryManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    if (name.trim()) {
      onAddCategory(name.trim(), color);
      setName(''); setColor(PRESET_COLORS[0]); setIsAddOpen(false);
    }
  };

  const handleEdit = () => {
    if (editingCategory && name.trim()) {
      onUpdateCategory(editingCategory.id, name.trim(), color);
      setEditingCategory(null); setName(''); setColor(PRESET_COLORS[0]); setIsEditOpen(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category); setName(category.name); setColor(category.color); setIsEditOpen(true);
  };

  const btnBase = 'w-full text-left px-3 py-2 rounded-lg text-sm flex items-center transition-colors';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Folders</h2>
        <button onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
          <Plus size={14} /> New Folder
        </button>
      </div>

      <button onClick={() => onSelectCategory(null)}
        className={`${btnBase} ${selectedCategory === null ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
        All Items
      </button>

      {categories.map(category => (
        <div key={category.id} className="group relative">
          <button onClick={() => onSelectCategory(category.id)}
            className={`${btnBase} pr-16 ${selectedCategory === category.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>
            <div className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: category.color }} />
            {category.name}
          </button>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button onClick={() => startEdit(category)} className="p-1.5 rounded hover:bg-gray-200">
              <Edit2 size={12} />
            </button>
            <button onClick={() => onDeleteCategory(category.id)} className="p-1.5 rounded hover:bg-gray-200">
              <Trash2 size={12} className="text-red-500" />
            </button>
          </div>
        </div>
      ))}

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Folder" description="Create a custom folder to organize your clothing items">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Folder Name</label>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g., Tops, Bottoms, Shoes" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
          <button onClick={handleAdd} className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm">Create Folder</button>
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Folder" description="Update the name and color of this folder">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Folder Name</label>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEdit()}
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
          <button onClick={handleEdit} className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}