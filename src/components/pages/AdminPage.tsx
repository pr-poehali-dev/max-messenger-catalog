import { useState, useRef } from "react";
import { Category, Product } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface AdminPageProps {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  onLogout: () => void;
}

const COLORS = ["#111111", "#374151", "#6B7280", "#9CA3AF", "#1D4ED8", "#059669", "#DC2626", "#D97706", "#7C3AED"];

const emptyProductForm = () => ({
  name: "", price: "", stock: "", description: "", category: "", images: [] as string[],
});

const AdminPage = ({ categories, setCategories, products, setProducts, onLogout }: AdminPageProps) => {
  const [tab, setTab] = useState<"products" | "categories">("products");

  // Products state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm());
  const [deleteProductConfirm, setDeleteProductConfirm] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Categories state
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", slug: "", description: "", color: "#111111" });
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<number | null>(null);

  // --- Product handlers ---
  const openAddProduct = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm());
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({ name: p.name, price: String(p.price), stock: String(p.stock), description: p.description, category: p.category, images: [...p.images] });
    setShowProductForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setProductForm(f => ({ ...f, images: [...f.images, ev.target?.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setProductForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSaveProduct = () => {
    if (!productForm.name.trim() || !productForm.category) return;
    const price = parseFloat(productForm.price) || 0;
    const stock = parseInt(productForm.stock) || 0;
    if (editingProductId !== null) {
      setProducts(products.map(p => p.id === editingProductId
        ? { ...p, name: productForm.name, price, stock, description: productForm.description, category: productForm.category, images: productForm.images.length ? productForm.images : p.images }
        : p
      ));
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: productForm.name,
        price,
        stock,
        description: productForm.description,
        category: productForm.category,
        images: productForm.images.length ? productForm.images : ["📦"],
      };
      setProducts([...products, newProduct]);
    }
    setShowProductForm(false);
    setEditingProductId(null);
    setProductForm(emptyProductForm());
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteProductConfirm(null);
  };

  // --- Category handlers ---
  const handleAddCat = () => {
    if (!catForm.name.trim()) return;
    setCategories([...categories, {
      id: Date.now(), name: catForm.name,
      slug: catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, "-"),
      description: catForm.description, color: catForm.color,
    }]);
    setCatForm({ name: "", slug: "", description: "", color: "#111111" });
    setShowCatForm(false);
  };

  const handleEditCat = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatForm({ name: cat.name, slug: cat.slug, description: cat.description, color: cat.color });
  };

  const handleSaveCat = () => {
    setCategories(categories.map(c =>
      c.id === editingCatId ? { ...c, ...catForm, slug: catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, "-") } : c
    ));
    setEditingCatId(null);
    setCatForm({ name: "", slug: "", description: "", color: "#111111" });
  };

  const handleDeleteCat = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    setDeleteCatConfirm(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-black mb-2">Админ-панель</h1>
          <p className="text-gray-400 text-sm">Управление товарами и категориями</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-8">
        {(["products", "categories"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
          >
            {t === "products" ? `Товары (${products.length})` : `Категории (${categories.length})`}
          </button>
        ))}
      </div>

      {/* ===== PRODUCTS TAB ===== */}
      {tab === "products" && (
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-400">{products.length} товаров</p>
            <button
              onClick={openAddProduct}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Icon name="Plus" size={16} />
              Добавить товар
            </button>
          </div>

          {showProductForm && (
            <div className="border border-gray-200 rounded-2xl p-6 mb-6 animate-fade-in">
              <h2 className="font-semibold text-black mb-5">{editingProductId ? "Редактировать товар" : "Новый товар"}</h2>

              {/* Photos */}
              <div className="mb-5">
                <label className="text-xs text-gray-500 mb-2 block">Фотографии товара</label>
                <div className="flex gap-3 flex-wrap">
                  {productForm.images.map((img, idx) => {
                    const isEmoji = img.length <= 4;
                    return (
                      <div key={idx} className="relative w-20 h-20 border border-gray-200 rounded-xl overflow-hidden group">
                        {isEmoji ? (
                          <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-50">{img}</div>
                        ) : (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="X" size={10} />
                        </button>
                        {idx === 0 && <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1 rounded">Главное</span>}
                      </div>
                    );
                  })}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors gap-1"
                  >
                    <Icon name="ImagePlus" size={20} />
                    <span className="text-xs">Фото</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Название *</label>
                  <input
                    value={productForm.name}
                    onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Название товара"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Категория *</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors bg-white"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Цена, ₽ *</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.price}
                    onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Остаток на складе</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.stock}
                    onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1.5 block">Описание</label>
                  <textarea
                    value={productForm.description}
                    onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Описание товара..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProduct}
                  disabled={!productForm.name.trim() || !productForm.category}
                  className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingProductId ? "Сохранить" : "Добавить товар"}
                </button>
                <button
                  onClick={() => { setShowProductForm(false); setEditingProductId(null); setProductForm(emptyProductForm()); }}
                  className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:text-black border border-gray-200 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {products.map(product => {
              const cat = categories.find(c => c.slug === product.category);
              const mainImg = product.images[0];
              const isEmoji = mainImg && mainImg.length <= 4;
              return (
                <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {isEmoji ? <span className="text-2xl">{mainImg}</span> : <img src={mainImg} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-black text-sm truncate">{product.name}</h3>
                      {cat && <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg flex-shrink-0">{cat.name}</span>}
                    </div>
                    <p className="text-xs text-gray-400">{product.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="font-semibold text-black text-sm">{product.price.toLocaleString("ru")} ₽</p>
                    <p className={`text-xs mt-0.5 ${product.stock === 0 ? "text-red-400" : product.stock <= 5 ? "text-amber-500" : "text-gray-400"}`}>
                      {product.stock} шт
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditProduct(product)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      <Icon name="Pencil" size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteProductConfirm(product.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                  {deleteProductConfirm === product.id && (
                    <div className="absolute right-4 bg-white border border-gray-200 rounded-xl p-3 shadow-lg z-10 flex gap-2 items-center">
                      <span className="text-xs text-gray-600">Удалить?</span>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg">Да</button>
                      <button onClick={() => setDeleteProductConfirm(null)} className="text-xs border border-gray-200 px-2 py-1 rounded-lg">Нет</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ===== CATEGORIES TAB ===== */}
      {tab === "categories" && (
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-400">{categories.length} категорий</p>
            <button
              onClick={() => { setShowCatForm(!showCatForm); setEditingCatId(null); setCatForm({ name: "", slug: "", description: "", color: "#111111" }); }}
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Icon name={showCatForm ? "X" : "Plus"} size={16} />
              {showCatForm ? "Отмена" : "Добавить категорию"}
            </button>
          </div>

          {(showCatForm || editingCatId !== null) && (
            <div className="border border-gray-200 rounded-2xl p-6 mb-6 animate-fade-in">
              <h2 className="font-semibold text-black mb-4">{editingCatId ? "Редактировать" : "Новая категория"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Название *</label>
                  <input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="Название" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Slug</label>
                  <input value={catForm.slug} onChange={e => setCatForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1.5 block">Описание</label>
                  <input value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Описание категории" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors" />
                </div>
              </div>
              <div className="mb-5">
                <label className="text-xs text-gray-500 mb-2 block">Цвет</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(color => (
                    <button key={color} onClick={() => setCatForm(f => ({ ...f, color }))} className={`w-8 h-8 rounded-lg transition-all ${catForm.color === color ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"}`} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={editingCatId ? handleSaveCat : handleAddCat} disabled={!catForm.name.trim()} className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {editingCatId ? "Сохранить" : "Создать"}
                </button>
                <button onClick={() => { setShowCatForm(false); setEditingCatId(null); setCatForm({ name: "", slug: "", description: "", color: "#111111" }); }} className="px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:text-black border border-gray-200 transition-colors">
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className={`border rounded-2xl p-5 transition-all duration-200 ${editingCatId === cat.id ? "border-black" : "border-gray-100 hover:border-gray-200"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color }}>
                    <Icon name="Tag" size={16} className="text-white" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditCat(cat)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"><Icon name="Pencil" size={14} /></button>
                    <button onClick={() => setDeleteCatConfirm(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Icon name="Trash2" size={14} /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-black mb-0.5">{cat.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <code className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">/{cat.slug}</code>
                  <span className="text-xs text-gray-400">{products.filter(p => p.category === cat.slug).length} тов.</span>
                </div>
                {deleteCatConfirm === cat.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Удалить «{cat.name}»?</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleDeleteCat(cat.id)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">Удалить</button>
                      <button onClick={() => setDeleteCatConfirm(null)} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:border-black transition-colors">Отмена</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
