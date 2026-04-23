import { CartItem, Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  setActivePage: (page: Page) => void;
}

const CartPage = ({ cart, removeFromCart, updateQuantity, setActivePage }: CartPageProps) => {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-black mb-8">Корзина</h1>
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-400 mb-6">Корзина пуста</p>
          <button
            onClick={() => setActivePage("catalog")}
            className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-black mb-8">Корзина</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
              <div className="text-3xl w-12 text-center">{item.image}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-black text-sm truncate">{item.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{item.price.toLocaleString("ru")} ₽ / шт</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                >
                  <Icon name="Minus" size={12} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
                >
                  <Icon name="Plus" size={12} />
                </button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-semibold text-black text-sm">{(item.price * item.quantity).toLocaleString("ru")} ₽</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:w-80">
          <div className="border border-gray-100 rounded-2xl p-6 sticky top-24">
            <h2 className="font-semibold text-black mb-4">Итого</h2>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-500">
                  <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="whitespace-nowrap">{(item.price * item.quantity).toLocaleString("ru")} ₽</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-semibold text-black">
                <span>Сумма</span>
                <span>{total.toLocaleString("ru")} ₽</span>
              </div>
            </div>
            <button className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors">
              Оформить заказ
            </button>
            <button
              onClick={() => setActivePage("catalog")}
              className="w-full mt-2 py-3 text-sm text-gray-400 hover:text-black transition-colors"
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
