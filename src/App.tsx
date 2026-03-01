import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Category } from './components/CategoryManager';
import type { ClothingItemData } from './components/ClothingItem';
import type { PlacedItem } from './components/OutfitCanvas';
import { CategoryManager } from './components/CategoryManager';
import { ClothingItem } from './components/ClothingItem';
import { OutfitCanvas } from './components/OutfitCanvas';
import { AddItemDialog } from './components/AddItemDialog';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';
import { Trash2, Shirt, Sparkles, Plus, X } from 'lucide-react';

export default function App() {
  const { user, loading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<ClothingItemData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
  const [isItemsSheetOpen, setIsItemsSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'closet' | 'outfit'>('closet')
  const [dbLoading, setDbLoading] = useState(true)

  // Load data from Supabase
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
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  if (!user) return <AuthPage />

  const handleAddCategory = async (name: string, color: string) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, color, user_id: user.id })
      .select().single()
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
      .from('items')
      .insert({ name, image_url: imageUrl, category_id: categoryId, user_id: user.id })
      .select().single()
    if (!error && data) setItems([...items, { id: data.id, name: data.name, imageUrl: data.image_url, categoryId: data.category_id }])
  }

  const handleDeleteItem = async (id: string) => {
    await supabase.from('items').delete().eq('id', id)
    setItems(items.filter(item => item.id !== id))
  }

  const handleAddPlacedItem = (placedItem: PlacedItem) => setPlacedItems([...placedItems, placedItem])
  const handleRemovePlacedItem = (id: string) => setPlacedItems(placedItems.filter(item => item.id !== id))
  const handleUpdatePlacedItemPosition = (id: string, x: number, y: number) =>
    setPlacedItems(placedItems.map(item => item.id === id ? { ...item, x, y } : item))

  const filteredItems = selectedCategory ? items.filter(item => item.categoryId === selectedCategory) : items

  const tabBtn = (tab: 'closet' | 'outfit') =>
    `flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`

  if (dbLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading your closet...</p>
    </div>
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="size-full flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex-1 text-center">My Closet</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white border-b border-gray-200 px-4 flex">
          <button className={tabBtn('closet')} onClick={() => setActiveTab('closet')}>
            <Shirt size={16} /> Closet
          </button>
          <button className={tabBtn('outfit')} onClick={() => setActiveTab('outfit')}>
            <Sparkles size={16} /> Outfit Builder
          </button>
        </div>

        {activeTab === 'closet' && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 bg-white border-b border-gray-200">
              <CategoryManager
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Items'}
                </h2>
                <AddItemDialog categories={categories} onAddItem={handleAddItem} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredItems.map(item => (
                  <ClothingItem key={item.id} item={item} onDelete={handleDeleteItem} />
                ))}
              </div>
              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No items in this folder yet.</p>
                  <p className="text-sm mt-2">Add your first clothing item to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'outfit' && (
          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Your Outfit</h2>
              <div className="flex gap-2">
                <button onClick={() => setIsItemsSheetOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
                  <Plus size={14} /> Add Items
                </button>
                <button onClick={() => setPlacedItems([])} disabled={placedItems.length === 0}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-40">
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <OutfitCanvas
                placedItems={placedItems}
                onAddItem={handleAddPlacedItem}
                onRemoveItem={handleRemovePlacedItem}
                onUpdatePosition={handleUpdatePlacedItemPosition}
              />
            </div>
          </div>
        )}

        {isItemsSheetOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsItemsSheetOpen(false)} />
            <div className="relative w-[85vw] sm:w-96 bg-white h-full overflow-y-auto shadow-xl p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold">Your Clothing Items</h2>
                  <p className="text-sm text-gray-500">Drag items onto the canvas</p>
                </div>
                <button onClick={() => setIsItemsSheetOpen(false)} className="p-1 rounded hover:bg-gray-100">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-6 mb-4">
                <CategoryManager
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pb-4">
                {filteredItems.map(item => (
                  <ClothingItem key={item.id} item={item} onDelete={handleDeleteItem} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}