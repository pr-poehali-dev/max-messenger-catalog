import { useState } from "react";
import { Category } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface AdminPageProps {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
}

const COLORS = ["#111111", "#374151", "#6B7280", "#9CA3AF", "#1D4ED8", "#059669", "#DC2626", "#D97706", "#7C3AED"];

const AdminPage = ({ categories, setCategories }: AdminPageProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", color: "#111111" });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newCat: Category = {
      id: Date.now(),
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description,
      color: form.color,
    };
    setCategories([...categories, newCat]);
    setForm({ name: "", slug: "", description: "", color: "#111111" });
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, color: cat.color });
  };

  const handleSaveEdit = () => {
    setCategories(categories.map(c =>
      c.id === editingId ? { ...c, ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") } : c
    ));
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", color: "#111111" });
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-black mb-2">Админ-панель</h1>
          <p className="text-gray-400 text-sm">Управление категориями товаров</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: "", slug: "", description: "", color: "#111111" }); }}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Icon name={showForm ? "X" : "Plus"} size={16} />
          {showForm ? "Отмена" : "Добавить категорию"}
        </button>
      </div>

      {(showForm || editingId !== null) && (
        <div className="border border-gray-200 rounded-2xl p-6 mb-6 animate-fade-in">
          <h2 className="font-semibold text-black mb-4">{editingId ? "Редактировать категорию" : "Новая категория"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Название *</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Например: Спорт"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Slug (URL)</label>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="sport (генерируется автоматически)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1.5 block">Описание</label>
              <input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Краткое описание категории"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="text-xs text-gray-500 mb-2 block">Цвет акцента</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setForm(f => ({ ...f, color }))}
                  className={`w-8 h-8 rounded-lg transition-all ${form.color === color ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={editingId ? handleSaveEdit : handleAdd}
              disabled={!form.name.trim()}
              className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {editingId ? "Сохранить" : "Создать"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: "", slug: "", description: "", color: "#111111" }); }}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:text-black transition-colors border border-gray-200"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className={`border rounded-2xl p-5 transition-all duration-200 ${editingId === cat.id ? "border-black" : "border-gray-100 hover:border-gray-200"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color }}>
                <Icon name="Tag" size={16} className="text-white" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(cat)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Pencil" size={14} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(cat.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-black mb-0.5">{cat.name}</h3>
            <p className="text-xs text-gray-400 mb-2">{cat.description}</p>
            <code className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">/{cat.slug}</code>

            {deleteConfirm === cat.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Удалить категорию «{cat.name}»?</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(cat.id)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                    Удалить
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors">
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-300">
            <Icon name="FolderOpen" size={48} className="mx-auto mb-3" />
            <p>Категорий пока нет</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
