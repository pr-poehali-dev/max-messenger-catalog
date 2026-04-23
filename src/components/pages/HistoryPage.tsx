import Icon from "@/components/ui/icon";

const HISTORY = [
  { id: "ORD-2500", date: "15 мар 2026", items: ["Кашемировый свитер", "Кроссовки минималист"], total: 17480, rating: 5 },
  { id: "ORD-2389", date: "2 мар 2026", items: ["Набор ножей"], total: 5990, rating: 4 },
  { id: "ORD-2201", date: "18 фев 2026", items: ["Клавиатура механическая"], total: 6490, rating: 5 },
  { id: "ORD-2088", date: "5 фев 2026", items: ["Диффузор аромата", "Льняная рубашка"], total: 5780, rating: null },
];

const StarRating = ({ rating }: { rating: number | null }) => {
  if (!rating) return <span className="text-xs text-gray-300">Нет оценки</span>;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? "text-amber-400" : "text-gray-200"}>★</span>
      ))}
    </div>
  );
};

const HistoryPage = () => {
  const totalSpent = HISTORY.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-black mb-2">История</h1>
          <p className="text-gray-400 text-sm">Все выполненные заказы</p>
        </div>
        <div className="border border-gray-100 rounded-2xl px-5 py-3 text-right">
          <p className="text-xs text-gray-400">Потрачено всего</p>
          <p className="text-xl font-semibold text-black">{totalSpent.toLocaleString("ru")} ₽</p>
        </div>
      </div>

      {HISTORY.length === 0 ? (
        <div className="text-center py-24 text-gray-300">
          <Icon name="Clock" size={48} className="mx-auto mb-4" />
          <p>История пуста</p>
        </div>
      ) : (
        <div className="space-y-3">
          {HISTORY.map(order => (
            <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Icon name="CheckCircle" size={18} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-black text-sm">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <StarRating rating={order.rating} />
                  <span className="font-semibold text-black">{order.total.toLocaleString("ru")} ₽</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pl-14">
                {order.items.map(item => (
                  <span key={item} className="text-xs bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
