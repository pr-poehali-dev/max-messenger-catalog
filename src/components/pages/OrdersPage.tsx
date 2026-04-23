import Icon from "@/components/ui/icon";

const ORDERS = [
  { id: "ORD-2841", date: "22 апр 2026", status: "В пути", statusColor: "bg-blue-50 text-blue-600", items: ["Беспроводные наушники", "Умные часы"], total: 23980 },
  { id: "ORD-2739", date: "18 апр 2026", status: "Доставлен", statusColor: "bg-green-50 text-green-600", items: ["Льняная рубашка"], total: 3290 },
  { id: "ORD-2601", date: "10 апр 2026", status: "Отменён", statusColor: "bg-red-50 text-red-500", items: ["Диффузор аромата", "Пледик шерстяной"], total: 6780 },
];

const OrdersPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-black mb-2">Заказы</h1>
      <p className="text-gray-400 text-sm mb-8">Текущие и недавние заказы</p>

      {ORDERS.length === 0 ? (
        <div className="text-center py-24 text-gray-300">
          <Icon name="Package" size={48} className="mx-auto mb-4" />
          <p>Заказов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ORDERS.map(order => (
            <div key={order.id} className="border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-black">{order.id}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{order.date}</p>
                </div>
                <span className="font-semibold text-black">{order.total.toLocaleString("ru")} ₽</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {order.items.map(item => (
                  <span key={item} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-lg">{item}</span>
                ))}
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                <button className="text-sm text-black font-medium hover:underline">Подробнее</button>
                {order.status === "В пути" && (
                  <button className="text-sm text-gray-400 hover:text-black transition-colors">Отследить</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
