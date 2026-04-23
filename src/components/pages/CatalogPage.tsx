import { Category, CartItem, Product } from "@/pages/Index";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface CatalogPageProps {
  categories: Category[];
  products: Product[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  cart: CartItem[];
  activeCategory: string | null;
  setActiveCategory: (slug: string | null) => void;
}

const CatalogPage = ({ categories, products, addToCart, cart, activeCategory, setActiveCategory }: CatalogPageProps) => {
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<number | null>(null);

  const currentCategory = activeCategory ? categories.find(c => c.slug === activeCategory) : null;

  const filtered = products.filter(p => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
    });
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1000);
  };

  const inCart = (id: number) => cart.find(i => i.id === id);

  if (!activeCategory) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-black mb-2">Каталог</h1>
          <p className="text-gray-400 text-sm">Выберите категорию</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className="group text-left border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon name="Tag" size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-black text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{count} товаров</span>
                  <div className="w-7 h-7 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-200">
                    <Icon name="ArrowRight" size={14} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-black mb-6">Все товары</h2>
          <div className="relative mb-6 max-w-md">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти товар..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <ProductGrid products={filtered} categories={categories} cart={cart} added={added} onAdd={handleAdd} inCart={inCart} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors"
        >
          <Icon name="ArrowLeft" size={16} />
          Каталог
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm font-medium text-black">{currentCategory?.name}</span>
      </div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: currentCategory?.color }}>
              <Icon name="Tag" size={16} className="text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-black">{currentCategory?.name}</h1>
          </div>
          <p className="text-gray-400 text-sm">{filtered.length} товаров</p>
        </div>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <ProductGrid products={filtered} categories={categories} cart={cart} added={added} onAdd={handleAdd} inCart={inCart} />
    </div>
  );
};

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  added: number | null;
  onAdd: (p: Product) => void;
  inCart: (id: number) => CartItem | undefined;
}

const ProductGrid = ({ products, categories, cart: _cart, added, onAdd, inCart }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-gray-300">
        <Icon name="Search" size={48} className="mx-auto mb-4" />
        <p className="text-lg">Ничего не найдено</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map(product => {
        const isEmoji = product.images[0] && product.images[0].length <= 4;
        const cartItem = inCart(product.id);
        return (
          <div key={product.id} className="group border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="mb-4 h-20 flex items-center">
              {isEmoji ? (
                <span className="text-5xl">{product.images[0]}</span>
              ) : (
                <img src={product.images[0]} alt={product.name} className="h-full w-auto object-contain rounded-xl" />
              )}
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {categories.find(c => c.slug === product.category)?.name}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-xs text-amber-500 font-medium">Осталось {product.stock} шт</span>
              )}
              {product.stock === 0 && (
                <span className="text-xs text-red-400 font-medium">Нет в наличии</span>
              )}
            </div>
            <h3 className="font-semibold text-black mb-1">{product.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-black">{product.price.toLocaleString("ru")} ₽</span>
              <button
                onClick={() => onAdd(product)}
                disabled={product.stock === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  product.stock === 0
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : added === product.id
                    ? "bg-green-500 text-white"
                    : cartItem
                    ? "bg-gray-100 text-gray-600 hover:bg-black hover:text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <Icon name={added === product.id ? "Check" : cartItem ? "ShoppingCart" : "Plus"} size={14} />
                {product.stock === 0 ? "Нет в наличии" : added === product.id ? "Добавлено" : cartItem ? `В корзине (${cartItem.quantity})` : "В корзину"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CatalogPage;
