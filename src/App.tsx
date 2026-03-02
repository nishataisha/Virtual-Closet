import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Category } from './components/CategoryManager';
import type { ClothingItemData } from './components/ClothingItem';
import type { PlacedItem } from './components/OutfitCanvas';
import type { PlacedText } from './components/PlacedTextItem';
import { CategoryManager } from './components/CategoryManager';
import { ClothingItem } from './components/ClothingItem';
import { CollapsibleCategories } from './components/CollapsibleCategories';
import { OutfitCanvas } from './components/OutfitCanvas';
import { AddItemDialog } from './components/AddItemDialog';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';
import { Trash2, Shirt, Sparkles } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<ClothingItemData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [placedTexts, setPlacedTexts] = useState<PlacedText[]>([])
  const [activeTab, setActiveTab] = useState<'closet' | 'outfit'>('closet')
  const [dbLoading, setDbLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      setDbLoading(true)
      const [{ data: cats }, { data: its }] = await Promise.all([
        supabase.from('categories').select('*').order('created_at'),
        supabase.from('items').select('*').order('created_at'),
      ])
      setCategories(cats?.map(c => ({ id: c.id, name: c.name, color: c.color })) ?? [])
      setItems(its?.map(i => ({ id: i.id, name: i.name, imageUrl: i.image_url, categoryId: i.category_id })) ?? [])
      setDbLoading(false)
    }
    loadData()
  }, [user])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="font-display text-2xl text-bistre/40 font-light">Loading...</p>
    </div>
  )

  if (!user) return <AuthPage />

  const handleAddCategory = async (name: string, color: string) => {
    const { data, error } = await supabase
      .from('categories').insert({ name, color, user_id: user.id }).select().single()
    if (!error && data) setCategories([...categories, { id: data.id, name: data.name, color: data.color }])
  }

  const handleUpdateCategory = async (id: string, name: string, color: string) => {
    await supabase.from('categories').update({ name, color }).eq('id', id)
    setCategories(categories.map(cat => cat.id === id ? { ...cat, name, color } : cat))
  }

  const handleDeleteCategory = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id)
    setCategories(categories.filter(cat => cat.id !== id))
    setItems(items.filter(item => item.categoryId !== id))
    if (selectedCategory === id) setSelectedCategory(null)
  }

  const handleAddItem = async (name: string, imageUrl: string, categoryId: string) => {
    const { data, error } = await supabase
      .from('items').insert({ name, image_url: imageUrl, category_id: categoryId, user_id: user.id }).select().single()
    if (!error && data) setItems([...items, { id: data.id, name: data.name, imageUrl: data.image_url, categoryId: data.category_id }])
  }

  const handleEditItem = async (id: string, name: string, imageUrl: string, categoryId: string) => {
    await supabase.from('items').update({ name, image_url: imageUrl, category_id: categoryId }).eq('id', id)
    setItems(items.map(item => item.id === id ? { ...item, name, imageUrl, categoryId } : item))
  }

  const handleDeleteItem = async (id: string) => {
    await supabase.from('items').delete().eq('id', id)
    setItems(items.filter(item => item.id !== id))
  }

  // Placed items
  const handleAddPlacedItem = (placedItem: PlacedItem) => setPlacedItems([...placedItems, placedItem])
  const handleRemovePlacedItem = (id: string) => setPlacedItems(placedItems.filter(item => item.id !== id))
  const handleUpdatePlacedItemPosition = (id: string, x: number, y: number) =>
    setPlacedItems(placedItems.map(item => item.id === id ? { ...item, x, y } : item))

  // Placed texts
  const handleAddText = (text: PlacedText) => setPlacedTexts([...placedTexts, text])
  const handleRemoveText = (id: string) => setPlacedTexts(placedTexts.filter(t => t.id !== id))
  const handleUpdateText = (id: string, text: string) =>
    setPlacedTexts(placedTexts.map(t => t.id === id ? { ...t, text } : t))
  const handleUpdateTextPosition = (id: string, x: number, y: number) =>
    setPlacedTexts(placedTexts.map(t => t.id === id ? { ...t, x, y } : t))

  const filteredItems = selectedCategory ? items.filter(item => item.categoryId === selectedCategory) : items

  const tabBtn = (tab: 'closet' | 'outfit') =>
    `flex-1 flex items-center justify-center gap-2 py-3 text-xs font-body tracking-widest uppercase transition-all border-b-2 ${
      activeTab === tab ? 'border-garnet text-garnet' : 'border-transparent text-bistre/40 hover:text-bistre'
    }`

  if (dbLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="font-display text-2xl text-bistre/40 font-light italic">Loading your closet...</p>
    </div>
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="size-full flex flex-col bg-cream">

        {/* Header */}
        <div className="bg-cream border-b border-blush px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gold text-xs">✦</span>
            <h1 className="font-display text-3xl font-light text-bistre tracking-tight">My Closet</h1>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="font-body text-xs tracking-widest uppercase text-bistre/40 hover:text-garnet transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-cream border-b border-blush px-6 flex">
          <button className={tabBtn('closet')} onClick={() => setActiveTab('closet')}>
            <Shirt size={13} /> Closet
          </button>
          <button className={tabBtn('outfit')} onClick={() => setActiveTab('outfit')}>
            <Sparkles size={13} /> Outfit Builder
          </button>
        </div>

        {/* Closet Tab */}
        {activeTab === 'closet' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 bg-white border-b border-blush">
              <CategoryManager
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-2xl text-bistre font-light">
                    {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Items'}
                  </h2>
                  <p className="font-body text-xs text-bistre/40 tracking-widest uppercase mt-0.5">
                    {filteredItems.length} {filteredItems.length === 1 ? 'piece' : 'pieces'}
                  </p>
                </div>
                <AddItemDialog categories={categories} onAddItem={handleAddItem} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredItems.map(item => (
                  <ClothingItem key={item.id} item={item} onDelete={handleDeleteItem} onEdit={handleEditItem} categories={categories} />
                ))}
              </div>
              {filteredItems.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-display text-3xl text-bistre/20 font-light italic">Empty</p>
                  <p className="font-body text-xs text-bistre/30 tracking-widest uppercase mt-2">Add your first piece to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Outfit Builder Tab */}
        {activeTab === 'outfit' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left: collapsible folders */}
            <div className="w-64 shrink-0 border-r border-blush bg-white overflow-y-auto p-4">
              <h3 className="font-display text-xl text-bistre font-light mb-1">
                <span className="text-gold text-xs mr-1">✦</span> Your Pieces
              </h3>
              <p className="font-body text-xs text-bistre/30 tracking-widest uppercase mb-4">Click folder to browse</p>
              <CollapsibleCategories
                categories={categories}
                items={items}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
              />
            </div>

            {/* Right: canvas */}
            <div className="flex-1 p-5 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl text-bistre font-light">Outfit Builder</h2>
                  <p className="font-body text-xs text-bistre/40 tracking-widest uppercase mt-0.5">Drag pieces onto the canvas</p>
                </div>
                <button
                  onClick={() => { setPlacedItems([]); setPlacedTexts([]); }}
                  disabled={placedItems.length === 0 && placedTexts.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-body tracking-widest uppercase border border-blush rounded-full hover:border-paprika text-bistre/60 hover:text-paprika transition-colors disabled:opacity-30"
                >
                  <Trash2 size={11} /> Clear
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <OutfitCanvas
                  placedItems={placedItems}
                  placedTexts={placedTexts}
                  onAddItem={handleAddPlacedItem}
                  onRemoveItem={handleRemovePlacedItem}
                  onUpdatePosition={handleUpdatePlacedItemPosition}
                  onAddText={handleAddText}
                  onRemoveText={handleRemoveText}
                  onUpdateText={handleUpdateText}
                  onUpdateTextPosition={handleUpdateTextPosition}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}