import { useState } from "react";
import { Category, CartItem } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Беспроводные наушники", price: 8990, image: "🎧", category: "electronics", description: "Активное шумоподавление, 30ч работы" },
  { id: 2, name: "Умные часы", price: 14990, image: "⌚", category: "electronics", description: "AMOLED дисплей, пульсометр, GPS" },
  { id: 3, name: "Клавиатура механическая", price: 6490, image: "⌨️", category: "electronics", description: "Cherry MX Red, RGB подсветка" },
  { id: 4, name: "Льняная рубашка", price: 3290, image: "👔", category: "clothing", description: "100% лён, свободный крой" },
  { id: 5, name: "Кроссовки минималист", price: 7990, image: "👟", category: "clothing", description: "Кожа, подошва EVA" },
  { id: 6, name: "Кашемировый свитер", price: 9490, image: "🧥", category: "clothing", description: "100% кашемир, базовые цвета" },
  { id: 7, name: "Диффузор аромата", price: 2490, image: "🕯️", category: "home", description: "Бамбук и вулканические камни" },
  { id: 8, name: "Набор ножей", price: 5990, image: "🔪", category: "home", description: "Японская сталь, деревянная рукоять" },
  { id: 9, name: "Пледик шерстяной", price: 4290, image: "🛋️", category: "home", description: "Мериносовая шерсть, 140×200 см" },
];

interface CatalogPageProps {
  categories: Category[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  cart: CartItem[];
}

const CatalogPage = ({ categories, addToCart, cart }: CatalogPageProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<number | null>(null);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1000);
  };

  const inCart = (id: number) => cart.find(i => i.id === id);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-black mb-2">Каталог</h1>
        <p className="text-gray-400 text-sm">{filtered.length} товаров</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Найти товар..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            Все
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat.slug ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(product => (
          <div key={product.id} className="group border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
            <div className="text-5xl mb-4 h-16 flex items-center">{product.image}</div>
            <div className="mb-1">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {categories.find(c => c.slug === product.category)?.name}
              </span>
            </div>
            <h3 className="font-semibold text-black mb-1">{product.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-black">{product.price.toLocaleString("ru")} ₽</span>
              <button
                onClick={() => handleAdd(product)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  added === product.id
                    ? "bg-green-500 text-white"
                    : inCart(product.id)
                    ? "bg-gray-100 text-gray-600 hover:bg-black hover:text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <Icon name={added === product.id ? "Check" : inCart(product.id) ? "ShoppingCart" : "Plus"} size={14} />
                {added === product.id ? "Добавлено" : inCart(product.id) ? `В корзине (${inCart(product.id)?.quantity})` : "В корзину"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-gray-300">
          <Icon name="Search" size={48} className="mx-auto mb-4" />
          <p className="text-lg">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
