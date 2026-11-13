// База данных товаров. Редактируется в админ-панели;
// изменения сохраняются в localStorage через контекст товаров.

export const defaultProducts = [
  {
    id: 1,
    name: 'Смартфон XPhone 15',
    category: 'smartphones',
    price: 79990,
    oldPrice: 89990,
    emoji: '📱',
    image: '/img/smartphone.webp',
    description: 'Флагманский смартфон с ярким OLED-дисплеем, мощным процессором и продвинутой камерой. Работает целый день без подзарядки и делает отличные снимки при любом освещении.',
    specs: [
      ['Дисплей', '6,1" OLED, 120 Гц'],
      ['Процессор', 'XPhone A17'],
      ['Память', '256 ГБ'],
      ['Камера', '48 Мп + 12 Мп'],
      ['Батарея', 'до 29 часов'],
      ['ОС', 'XOS 18']
    ]
  },
  {
    id: 2,
    name: 'Смартфон Pixel Nova',
    category: 'smartphones',
    price: 64990,
    oldPrice: 0,
    emoji: '📲',
    image: '',
    description: 'Сбалансированный смартфон с отличной камерой и чистым Android. Идеален для повседневных задач, соцсетей и съёмки.',
    specs: [
      ['Дисплей', '6,3" OLED'],
      ['Процессор', 'Nova 8 Gen'],
      ['Память', '128 ГБ'],
      ['Камера', '50 Мп'],
      ['ОС', 'Android 14']
    ]
  },
  {
    id: 3,
    name: 'Ноутбук AirBook 13',
    category: 'laptops',
    price: 119990,
    oldPrice: 0,
    emoji: '💻',
    image: '',
    description: 'Лёгкий ультрабук с дисплеем 2,8К и длительной автономностью. Подходит для работы, учёбы и путешествий.',
    specs: [
      ['Дисплей', '13" 2,8К'],
      ['Процессор', 'Core i5-13'],
      ['Память', '16 ГБ / 512 ГБ SSD'],
      ['Вес', '1,2 кг'],
      ['ОС', 'Windows 11']
    ]
  },
  {
    id: 4,
    name: 'Ноутбук ProBook 16',
    category: 'laptops',
    price: 149990,
    oldPrice: 0,
    emoji: '🖥️',
    image: '',
    description: 'Производительный ноутбук для задач с высокой нагрузкой: программирования, монтажа и дизайна.',
    specs: [
      ['Дисплей', '16" QHD'],
      ['Процессор', 'Core i7-14'],
      ['Память', '32 ГБ / 1 ТБ SSD'],
      ['Видеокарта', 'RTX 4070'],
      ['ОС', 'Windows 11']
    ]
  },
  {
    id: 5,
    name: 'Наушники AirSound Pro',
    category: 'audio',
    price: 12990,
    oldPrice: 17990,
    emoji: '🎧',
    image: '',
    description: 'Беспроводные наушники с активным шумоподавлением и объёмным звуком. Держат заряд до 30 часов.',
    specs: [
      ['Тип', 'Полноразмерные'],
      ['Шумоподавление', 'Активное'],
      ['Автономность', 'до 30 часов'],
      ['Bluetooth', '5.3'],
      ['Вес', '250 г']
    ]
  },
  {
    id: 6,
    name: 'Колонка Mini Boom',
    category: 'audio',
    price: 4990,
    oldPrice: 6990,
    emoji: '🔊',
    image: '',
    description: 'Портативная колонка с ярким басом и защитой от влаги. Берёте с собой куда угодно.',
    specs: [
      ['Мощность', '20 Вт'],
      ['Защита', 'IPX7'],
      ['Автономность', 'до 12 часов'],
      ['Bluetooth', '5.0']
    ]
  },
  {
    id: 7,
    name: 'Смарт-часы Watch X',
    category: 'appliances',
    price: 22990,
    oldPrice: 0,
    emoji: '⌚',
    image: '',
    description: 'Умные часы с отслеживанием здоровья, спортом и уведомлениями. Водозащита и две недели автономной работы.',
    specs: [
      ['Экран', 'AMOLED 1,4"'],
      ['Защита', '5 ATM'],
      ['Автономность', '14 дней'],
      ['Датчики', 'Пульс, SpO2, сон']
    ]
  },
  {
    id: 8,
    name: 'Телевизор Vision 55',
    category: 'appliances',
    price: 45990,
    oldPrice: 54990,
    emoji: '📺',
    image: '',
    description: 'Телевизор 4K-разрешения с HDR и встроенным смарт-модулем. Открывает доступ к стриминговым сервисам.',
    specs: [
      ['Диагональ', '55"'],
      ['Разрешение', '4K Ultra HD'],
      ['HDR', 'HDR10+'],
      ['Smart TV', 'Да'],
      ['Интерфейсы', 'HDMI ×3, USB ×2']
    ]
  }
];

export const categoryNames = {
  smartphones: 'Смартфоны',
  laptops: 'Ноутбуки',
  audio: 'Аудио',
  appliances: 'Техника'
};

export function formatPrice(v) {
  return Number(v || 0).toLocaleString('ru-RU') + ' ₽';
}

export function formatNumberInput(v) {
  return parseInt(String(v).replace(/\s|₽/g, ''), 10) || 0;
}