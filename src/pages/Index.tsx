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

const Index = () => {
  const [activePage, setActivePage] = useState<Page>("catalog");
  const [cart, setCart] = useState<CartItem[]>([]);
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

  return (
    <div className="min-h-screen bg-white font-golos">
      <Navbar activePage={activePage} setActivePage={setActivePage} cartCount={cartCount} />
      <main className="pt-20">
        {activePage === "catalog" && <CatalogPage categories={categories} addToCart={addToCart} cart={cart} />}
        {activePage === "cart" && <CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} setActivePage={setActivePage} />}
        {activePage === "orders" && <OrdersPage />}
        {activePage === "history" && <HistoryPage />}
        {activePage === "admin" && <AdminPage categories={categories} setCategories={setCategories} />}
        {activePage === "profile" && <ProfilePage setActivePage={setActivePage} />}
      </main>
    </div>
  );
};

export default Index;
