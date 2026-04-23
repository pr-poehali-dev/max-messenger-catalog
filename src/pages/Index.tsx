import { useState } from "react";
import CatalogPage from "@/components/pages/CatalogPage";
import CartPage from "@/components/pages/CartPage";
import OrdersPage from "@/components/pages/OrdersPage";
import HistoryPage from "@/components/pages/HistoryPage";
import AdminPage from "@/components/pages/AdminPage";
import ProfilePage from "@/components/pages/ProfilePage";
import Navbar from "@/components/Navbar";

export type Page = "catalog" | "cart" | "orders" | "history" | "admin" | "profile";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  stock: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Беспроводные наушники", price: 8990, images: ["🎧"], category: "electronics", description: "Активное шумоподавление, 30ч работы", stock: 15 },
  { id: 2, name: "Умные часы", price: 14990, images: ["⌚"], category: "electronics", description: "AMOLED дисплей, пульсометр, GPS", stock: 8 },
  { id: 3, name: "Клавиатура механическая", price: 6490, images: ["⌨️"], category: "electronics", description: "Cherry MX Red, RGB подсветка", stock: 22 },
  { id: 4, name: "Льняная рубашка", price: 3290, images: ["👔"], category: "clothing", description: "100% лён, свободный крой", stock: 40 },
  { id: 5, name: "Кроссовки минималист", price: 7990, images: ["👟"], category: "clothing", description: "Кожа, подошва EVA", stock: 12 },
  { id: 6, name: "Кашемировый свитер", price: 9490, images: ["🧥"], category: "clothing", description: "100% кашемир, базовые цвета", stock: 6 },
  { id: 7, name: "Диффузор аромата", price: 2490, images: ["🕯️"], category: "home", description: "Бамбук и вулканические камни", stock: 30 },
  { id: 8, name: "Набор ножей", price: 5990, images: ["🔪"], category: "home", description: "Японская сталь, деревянная рукоять", stock: 9 },
  { id: 9, name: "Пледик шерстяной", price: 4290, images: ["🛋️"], category: "home", description: "Мериносовая шерсть, 140×200 см", stock: 18 },
];

const ADMIN_PASSWORD = "admin123";

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("catalog");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPwInput, setAdminPwInput] = useState("");
  const [adminPwError, setAdminPwError] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Электроника", slug: "electronics", description: "Гаджеты и техника", color: "#111111" },
    { id: 2, name: "Одежда", slug: "clothing", description: "Стильная одежда", color: "#555555" },
    { id: 3, name: "Дом и сад", slug: "home", description: "Для дома и уюта", color: "#888888" },
  ]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleAdminNav = () => {
    if (adminAuth) {
      setActivePage("admin");
    } else {
      setActivePage("admin");
    }
  };

  const handleAdminLogin = () => {
    if (adminPwInput === ADMIN_PASSWORD) {
      setAdminAuth(true);
      setAdminPwError(false);
      setAdminPwInput("");
    } else {
      setAdminPwError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white font-golos">
      <Navbar activePage={activePage} setActivePage={setActivePage} cartCount={cartCount} />
      <main className="pt-20">
        {activePage === "catalog" && (
          <CatalogPage
            categories={categories}
            products={products}
            addToCart={addToCart}
            cart={cart}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        )}
        {activePage === "cart" && (
          <CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} setActivePage={setActivePage} />
        )}
        {activePage === "orders" && <OrdersPage />}
        {activePage === "history" && <HistoryPage />}
        {activePage === "admin" && !adminAuth && (
          <div className="max-w-sm mx-auto px-6 py-24">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔐</span>
              </div>
              <h1 className="text-2xl font-semibold text-black mb-1">Вход в админку</h1>
              <p className="text-gray-400 text-sm">Введите пароль для доступа</p>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={adminPwInput}
                onChange={e => { setAdminPwInput(e.target.value); setAdminPwError(false); }}
                onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                placeholder="Пароль"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${adminPwError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-black"}`}
              />
              {adminPwError && <p className="text-red-500 text-xs">Неверный пароль</p>}
              <button
                onClick={handleAdminLogin}
                className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Войти
              </button>
              <button
                onClick={() => setActivePage("catalog")}
                className="w-full py-2.5 text-sm text-gray-400 hover:text-black transition-colors"
              >
                Назад в каталог
              </button>
            </div>
          </div>
        )}
        {activePage === "admin" && adminAuth && (
          <AdminPage
            categories={categories}
            setCategories={setCategories}
            products={products}
            setProducts={setProducts}
            onLogout={() => { setAdminAuth(false); setActivePage("catalog"); }}
          />
        )}
        {activePage === "profile" && <ProfilePage setActivePage={setActivePage} />}
      </main>
    </div>
  );
};

export default Index;
