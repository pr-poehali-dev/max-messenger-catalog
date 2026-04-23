import { Page } from "@/pages/Index";
import Icon from "@/components/ui/icon";

interface ProfilePageProps {
  setActivePage: (page: Page) => void;
}

const ProfilePage = ({ setActivePage }: ProfilePageProps) => {
  const stats = [
    { label: "Заказов", value: "7", icon: "Package" },
    { label: "Потрачено", value: "45 790 ₽", icon: "CreditCard" },
    { label: "Бонусов", value: "458", icon: "Star" },
  ];

  const menuItems = [
    { label: "Мои заказы", icon: "Package", page: "orders" as Page },
    { label: "История покупок", icon: "Clock", page: "history" as Page },
    { label: "Адреса доставки", icon: "MapPin", page: null },
    { label: "Способы оплаты", icon: "CreditCard", page: null },
    { label: "Уведомления", icon: "Bell", page: null },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-black mb-8">Профиль</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80 space-y-4">
          <div className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">АИ</span>
              </div>
              <div>
                <h2 className="font-semibold text-black">Алексей Иванов</h2>
                <p className="text-sm text-gray-400">alexey@mail.ru</p>
              </div>
            </div>
            <button className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:border-black hover:text-black transition-colors">
              Редактировать профиль
            </button>
          </div>

          <div className="border border-gray-100 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-3">
              {stats.map(stat => (
                <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-black text-sm">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            {menuItems.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => item.page && setActivePage(item.page)}
                className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left ${idx > 0 ? "border-t border-gray-50" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Icon name={item.icon} size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-black">{item.label}</span>
                </div>
                <Icon name="ChevronRight" size={16} className="text-gray-300" />
              </button>
            ))}
          </div>

          <div className="mt-4 border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black text-sm">Бонусная программа</p>
                <p className="text-xs text-gray-400 mt-0.5">458 бонусов • скоро истекают 50</p>
              </div>
              <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-xs font-medium">
                Серебро
              </div>
            </div>
            <div className="mt-3 bg-gray-100 rounded-full h-1.5">
              <div className="bg-black h-1.5 rounded-full" style={{ width: "46%" }} />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">542 бонуса до статуса «Золото»</p>
          </div>

          <button className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-red-400 hover:text-red-600 transition-colors">
            <Icon name="LogOut" size={16} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
