import { useState } from "react";
import { CartItem, Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart?: () => void;
  setActivePage: (page: Page) => void;
}

interface OrderForm {
  name: string;
  phone: string;
  comment: string;
}

const CartPage = ({ cart, removeFromCart, updateQuantity, clearCart, setActivePage }: CartPageProps) => {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const [step, setStep] = useState<"cart" | "order" | "success">("cart");
  const [form, setForm] = useState<OrderForm>({ name: "", phone: "", comment: "" });
  const [errors, setErrors] = useState<Partial<OrderForm>>({});

  const setField = (field: keyof OrderForm, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<OrderForm> = {};
    if (!form.name.trim()) e.name = "Введите имя";
    if (!form.phone.trim()) e.phone = "Введите номер телефона";
    else if (form.phone.replace(/[\d\s+\-()]/g, "").length > 0 || form.phone.length < 7) e.phone = "Некорректный номер";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep("success");
    if (clearCart) setTimeout(clearCart, 1500);
  };

  const handleQtyInput = (id: number, val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) updateQuantity(id, num);
  };

  // ---- Empty ----
  if (cart.length === 0 && step !== "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-400 mb-6 text-lg">Корзина пуста</p>
        <button onClick={() => setActivePage("catalog")} className="bg-black text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-gray-800 transition-colors">
          В каталог
        </button>
      </div>
    );
  }

  // ---- Success ----
  if (step === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <Icon name="Check" size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">Заказ оформлен!</h2>
        <p className="text-gray-400 mb-2">Спасибо, <span className="font-medium text-black">{form.name}</span>!</p>
        <p className="text-gray-400 text-sm mb-8">Мы свяжемся с вами по номеру <span className="font-medium text-black">{form.phone}</span></p>
        <button onClick={() => { setStep("cart"); setActivePage("catalog"); }} className="bg-black text-white px-8 py-3.5 rounded-2xl font-medium hover:bg-gray-800 transition-colors">
          Вернуться в каталог
        </button>
      </div>
    );
  }

  // ---- Order form ----
  if (step === "order") {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep("cart")} className="text-gray-400 hover:text-black transition-colors">
            <Icon name="ArrowLeft" size={22} />
          </button>
          <h1 className="text-2xl font-semibold text-black">Оформление заказа</h1>
        </div>

        {/* Order summary */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-5">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Ваши товары</p>
          <div className="space-y-2">
            {cart.map(item => {
              const isEmoji = item.image?.length <= 4;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                    {isEmoji ? <span className="text-xl">{item.image}</span> : <img src={item.image} className="w-full h-full object-cover rounded-xl" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.quantity} шт × {item.price.toLocaleString("ru")} ₽</p>
                  </div>
                  <p className="text-sm font-semibold text-black flex-shrink-0">{(item.price * item.quantity).toLocaleString("ru")} ₽</p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
            <span className="font-semibold text-black">Итого</span>
            <span className="font-bold text-black text-lg">{total.toLocaleString("ru")} ₽</span>
          </div>
        </div>

        {/* Contact form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-black mb-1.5 block">Ваше имя *</label>
            <input
              value={form.name}
              onChange={e => setField("name", e.target.value)}
              placeholder="Иван Иванов"
              className={`w-full px-4 py-3.5 border rounded-2xl text-base focus:outline-none transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-black"}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-black mb-1.5 block">Номер телефона *</label>
            <input
              value={form.phone}
              onChange={e => setField("phone", e.target.value)}
              placeholder="+7 900 000 00 00"
              type="tel"
              className={`w-full px-4 py-3.5 border rounded-2xl text-base focus:outline-none transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-black"}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-black mb-1.5 block">Комментарий к заказу</label>
            <textarea
              value={form.comment}
              onChange={e => setField("comment", e.target.value)}
              placeholder="Адрес доставки, удобное время, пожелания..."
              rows={3}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-base focus:outline-none focus:border-black transition-colors resize-none placeholder:text-gray-300"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-base hover:bg-gray-800 active:scale-95 transition-all"
        >
          Подтвердить заказ на {total.toLocaleString("ru")} ₽
        </button>
      </div>
    );
  }

  // ---- Cart ----
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-black mb-5">Корзина <span className="text-gray-400 font-normal text-base">{cart.length}</span></h1>

      <div className="space-y-3 mb-5">
        {cart.map(item => {
          const isEmoji = item.image?.length <= 4;
          return (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-3 flex gap-3 items-center hover:border-gray-200 transition-colors">
              {/* Фото */}
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {isEmoji
                  ? <span className="text-3xl">{item.image}</span>
                  : <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                }
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black truncate">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.price.toLocaleString("ru")} ₽ / шт</p>
                <p className="text-sm font-bold text-black mt-1">{(item.price * item.quantity).toLocaleString("ru")} ₽</p>
              </div>
              {/* Qty + delete */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Icon name="X" size={16} />
                </button>
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-0.5">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                    <Icon name="Minus" size={12} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => handleQtyInput(item.id, e.target.value)}
                    className="w-8 text-center text-sm font-semibold bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                    <Icon name="Plus" size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total + CTA */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Итого</span>
          <span className="text-2xl font-bold text-black">{total.toLocaleString("ru")} ₽</span>
        </div>
        <button
          onClick={() => setStep("order")}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold text-base hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Icon name="CreditCard" size={20} />
          Оформить заказ
        </button>
      </div>

      <button onClick={() => setActivePage("catalog")} className="w-full py-3 text-sm text-gray-400 hover:text-black transition-colors">
        Продолжить покупки
      </button>
    </div>
  );
};

export default CartPage;