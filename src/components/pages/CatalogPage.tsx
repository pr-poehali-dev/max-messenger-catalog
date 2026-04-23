import { useState } from "react";
import { Category, CartItem, Product, Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface CatalogPageProps {
  categories: Category[];
  products: Product[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  cart: CartItem[];
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
  setActivePage?: (page: Page) => void;
}

const CatalogPage = ({ categories, products, addToCart, cart, activeCategory, setActiveCategory, setActivePage }: CatalogPageProps) => {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const getQty = (id: number) => quantities[id] ?? 1;
  const setQty = (id: number, val: number) => setQuantities(q => ({ ...q, [id]: Math.max(1, val) }));

  const getCartQty = (id: number) => cart.find(i => i.id === id)?.quantity ?? 0;

  const handleAdd = (product: Product) => {
    const qty = getQty(product.id);
    for (let i = 0; i < qty; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], category: product.category });
    }
  };

  const currentCategory = activeCategory ? categories.find(c => c.slug === activeCategory) : null;
  const filtered = products.filter(p => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotal = cart.reduce((s, i) => s + i.quantity, 0);

  // ---- Category list ----
  if (!activeCategory) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-5">
        <h1 className="text-2xl font-semibold text-black mb-5">Каталог</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className="group text-left bg-white rounded-2xl p-4 hover:shadow-md transition-all duration-200 border border-gray-100 active:scale-95"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform" style={{ backgroundColor: cat.color }}>
                  <Icon name="Tag" size={20} className="text-white" />
                </div>
                <p className="font-semibold text-black">{cat.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{count} товаров</p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">Все товары</h2>
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black bg-white transition-colors w-40" />
          </div>
        </div>

        <ProductGrid products={filtered} categories={categories} getQty={getQty} setQty={setQty} getCartQty={getCartQty} onAdd={handleAdd} />

        {cartTotal > 0 && setActivePage && (
          <div className="fixed bottom-20 md:bottom-6 left-0 right-0 flex justify-center px-4 z-40">
            <button onClick={() => setActivePage("cart")} className="bg-black text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-2xl flex items-center gap-3 hover:bg-gray-800 transition-colors active:scale-95">
              <Icon name="ShoppingCart" size={22} />
              Корзина · {cartTotal} шт
            </button>
          </div>
        )}
      </div>
    );
  }

  // ---- Category page ----
  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setActiveCategory(null)} className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-colors">
          <Icon name="ArrowLeft" size={20} />
          <span className="text-sm">Каталог</span>
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm font-semibold text-black">{currentCategory?.name}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-black">{currentCategory?.name} <span className="text-gray-400 font-normal text-base">{filtered.length}</span></h1>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black bg-white transition-colors w-36" />
        </div>
      </div>

      <ProductGrid products={filtered} categories={categories} getQty={getQty} setQty={setQty} getCartQty={getCartQty} onAdd={handleAdd} />

      {cartTotal > 0 && setActivePage && (
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 flex justify-center px-4 z-40">
          <button onClick={() => setActivePage("cart")} className="bg-black text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-2xl flex items-center gap-3 hover:bg-gray-800 transition-colors active:scale-95">
            <Icon name="ShoppingCart" size={22} />
            Корзина · {cartTotal} шт
          </button>
        </div>
      )}
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  getQty: (id: number) => number;
  setQty: (id: number, val: number) => void;
  getCartQty: (id: number) => number;
  onAdd: (p: Product) => void;
}

const ProductGrid = ({ products, categories, getQty, setQty, getCartQty, onAdd }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-300">
        <Icon name="SearchX" size={44} className="mx-auto mb-3" />
        <p>Ничего не найдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-32 md:pb-8">
      {products.map(product => {
        const isEmoji = product.images[0]?.length <= 4;
        const qty = getQty(product.id);
        const inCart = getCartQty(product.id) > 0;

        return (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col">

            {/* БОЛЬШОЕ ФОТО как на Озоне */}
            <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center relative overflow-hidden">
              {isEmoji ? (
                <span className="text-8xl">{product.images[0]}</span>
              ) : (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                  <span className="text-xs text-gray-400 font-medium bg-white px-3 py-1 rounded-full border border-gray-200">Нет в наличии</span>
                </div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="absolute top-2 left-2 bg-amber-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
                  Осталось {product.stock}
                </span>
              )}
              {inCart && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Icon name="Check" size={10} />
                  В корзине
                </span>
              )}
            </div>

            {/* Мини-инфо */}
            <div className="p-2.5 flex flex-col flex-1">
              <p className="text-base font-bold text-black mb-0.5">{product.price.toLocaleString("ru")} ₽</p>
              <p className="text-xs text-gray-500 leading-snug line-clamp-2 mb-2.5 flex-1">{product.name}</p>

              {/* Выбор кол-ва + кнопка */}
              {product.stock > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <button onClick={() => setQty(product.id, qty - 1)} className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                      <Icon name="Minus" size={12} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stock}
                      value={qty}
                      onChange={e => setQty(product.id, parseInt(e.target.value) || 1)}
                      className="w-7 text-center text-xs font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button onClick={() => setQty(product.id, Math.min(qty + 1, product.stock))} className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors">
                      <Icon name="Plus" size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => onAdd(product)}
                    className="flex-1 bg-black text-white py-1.5 rounded-xl text-xs font-semibold hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <Icon name="ShoppingCart" size={12} />
                    В корзину
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CatalogPage;
