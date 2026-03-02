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
  '#571310', '#A72913', '#FAA994', '#FCD3C5',
  '#E8AF59', '#E6A341', '#210100', '#8C0902',
  '#3b82f6', '#10b981', '#8b5cf6', '#ec4899',
];

function Modal({ open, onClose, title, description, children }: {
  open: boolean; onClose: () => void; title: string; description: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-bistre/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-cream border border-blush rounded-2xl p-6 w-full max-w-md shadow-xl space-y-5">
        <div>
          <h2 className="font-display text-2xl text-bistre font-light">{title}</h2>
          <p className="font-body text-xs tracking-widest uppercase text-salmon mt-1">{description}</p>
        </div>
        {children}
        <button onClick={onClose} className="font-body text-xs text-bistre/40 hover:text-garnet transition-colors w-full text-center tracking-widest uppercase">
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
          className={`w-9 h-9 rounded-full transition-all ${value === color ? 'ring-2 ring-offset-2 ring-garnet scale-110' : 'hover:scale-105'}`}
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

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-bistre font-light tracking-wide">
          <span className="text-gold text-sm mr-1">✦</span> Folders
        </h2>
        <button onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-body tracking-widest uppercase border border-blush rounded-full hover:border-salmon hover:text-garnet transition-colors text-bistre/60">
          <Plus size={11} /> New
        </button>
      </div>

      <button onClick={() => onSelectCategory(null)}
        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-body transition-all flex items-center gap-2 ${
          selectedCategory === null
            ? 'bg-garnet text-cream'
            : 'hover:bg-blush/40 text-bistre'
        }`}>
        {selectedCategory === null && <span className="text-gold text-xs">✦</span>}
        All Items
      </button>

      {categories.map(category => (
        <div key={category.id} className="group relative">
          <button onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-body transition-all flex items-center gap-2 pr-16 ${
              selectedCategory === category.id
                ? 'bg-garnet text-cream'
                : 'hover:bg-blush/40 text-bistre'
            }`}>
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
            {category.name}
          </button>
          <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
            <button onClick={() => startEdit(category)} className="p-1.5 rounded-lg hover:bg-blush/60">
              <Edit2 size={11} className="text-bistre/50" />
            </button>
            <button onClick={() => onDeleteCategory(category.id)} className="p-1.5 rounded-lg hover:bg-blush/60">
              <Trash2 size={11} className="text-paprika" />
            </button>
          </div>
        </div>
      ))}

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Folder" description="Organize your collection">
        <div className="space-y-4">
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-1.5">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Tops, Shoes, Dresses"
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors" />
          </div>
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-2">Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
          <button onClick={handleAdd} className="w-full py-2.5 bg-garnet text-cream rounded-xl text-xs font-body tracking-widest uppercase hover:bg-bistre transition-colors">
            Create Folder
          </button>
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Folder" description="Update your collection">
        <div className="space-y-4">
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-1.5">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEdit()}
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:border-salmon transition-colors" />
          </div>
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-bistre/50 block mb-2">Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
          <button onClick={handleEdit} className="w-full py-2.5 bg-garnet text-cream rounded-xl text-xs font-body tracking-widest uppercase hover:bg-bistre transition-colors">
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
}
