import { Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface NavbarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  cartCount: number;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "catalog", label: "Каталог", icon: "Grid3X3" },
  { id: "cart", label: "Корзина", icon: "ShoppingCart" },
  { id: "orders", label: "Заказы", icon: "Package" },
  { id: "admin", label: "Админ", icon: "Settings" },
];

const Navbar = ({ activePage, setActivePage, cartCount }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-black">Магазин</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activePage === item.id
                  ? "bg-black text-white"
                  : "text-gray-500 hover:text-black hover:bg-gray-50"
              }`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
              {item.id === "cart" && cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${activePage === "cart" ? "bg-white text-black" : "bg-black text-white"}`}>
                  {cartCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <nav className="flex md:hidden items-center gap-1 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-50">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center gap-1 flex-1 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                activePage === item.id ? "text-black" : "text-gray-400"
              }`}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
              {item.id === "cart" && cartCount > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-black text-white rounded-full text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;