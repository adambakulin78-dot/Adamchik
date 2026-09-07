import { BlueLockCharacter } from '../types';

export const BLUE_LOCK_CHARACTERS: Record<string, BlueLockCharacter> = {
  ego: {
    id: 'ego',
    nameRu: 'Джинпачи Эго',
    nameEn: 'Jinpachi Ego',
    title: 'Архитектор & Главный Тренер Blue Lock',
    specialty: 'Метавидение, Анатомия, PNF-протоколы & Биомеханический Расчет',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/j/ji/Jinpachi_Ego.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/11/488204.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/j/ji/Jinpachi_Ego.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/j/ji/Jinpachi_Ego.png/revision/latest',
    accentColor: '#06b6d4', // Cyan
    glowColor: 'rgba(6, 182, 212, 0.4)',
    quote: 'Растяжка без понимания кинетической цепи — пустая трата времени. Контролируй каждый сустав.',
    quoteContext: 'Аналитический разбор гибкости задней цепи и ТБС',
    keyBiomechanicalFocus: 'Связочный аппарат, тазобедренные суставы, баланс проприоцепторов',
  },
  isagi: {
    id: 'isagi',
    nameRu: 'Исаги Йоичи',
    nameEn: 'Yoichi Isagi',
    title: 'Мастер Пространственного Восприятия & Метавидения',
    specialty: 'Динамический Баланс, Проприоцепция & Быстрая Адаптация',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/y/yo/Yoichi_Isagi.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/16/488203.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/y/yo/Yoichi_Isagi.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/y/yo/Yoichi_Isagi.png/revision/latest',
    accentColor: '#10b981', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.4)',
    quote: 'Я вижу поле на 360 градусов. Мое тело должно двигаться без малейшей задержки и инерции.',
    quoteContext: 'Тренировка вестибулярного аппарата и стабильности на одной ноге',
    keyBiomechanicalFocus: 'Глубокие мышцы-ротаторы, стопы, проприоцепция',
  },
  bachira: {
    id: 'bachira',
    nameRu: 'Мегуру Бачира',
    nameEn: 'Meguru Bachira',
    title: 'Гений Эластичности & Непредсказуемого Дриблинга',
    specialty: 'Экстремальная Подвижность Голеностопа & Растяжка Приводящих Мышц',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/m/me/Meguru_Bachira.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/12/488205.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/m/me/Meguru_Bachira.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/m/me/Meguru_Bachira.png/revision/latest',
    accentColor: '#f59e0b', // Amber / Gold
    glowColor: 'rgba(245, 158, 11, 0.4)',
    quote: 'Слушай своего внутреннего монстра! Твое тело должно быть как жидкость — гибким и свободным.',
    quoteContext: 'Лягушка, поперечный шпагат и раскрытие таза',
    keyBiomechanicalFocus: 'Аддукторы, подвздошно-поясничная мышца, гибкость стоп',
  },
  rin: {
    id: 'rin',
    nameRu: 'Итоши Рин',
    nameEn: 'Rin Itoshi',
    title: 'Номер 1 в Blue Lock • Абсолютный Кинетический Контроль',
    specialty: 'Изометрическая Сила в Крайних Точках & Идеальная Осанка',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/r/ri/Rin_Itoshi.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/10/488207.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/r/ri/Rin_Itoshi.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/r/ri/Rin_Itoshi.png/revision/latest',
    accentColor: '#0284c7', // Deep Teal/Blue
    glowColor: 'rgba(2, 132, 199, 0.4)',
    quote: 'Я уничтожу любую слабость в своем теле. Либо ты контролируешь баланс, либо падаешь.',
    quoteContext: 'Сложные удержания планки, ласточка и PNF задней поверхности бедра',
    keyBiomechanicalFocus: 'Квадратная мышца поясницы, бицепс бедра, стабилизаторы лопаток',
  },
  nagi: {
    id: 'nagi',
    nameRu: 'Сейширо Наги',
    nameEn: 'Seishiro Nagi',
    title: 'Гений Мягкого Приема & Пластичности Суставов',
    specialty: 'Декомпрессия Позвоночника, Амортизация & Мягкое Растяжение',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/s/se/Seishiro_Nagi.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/7/488206.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/s/se/Seishiro_Nagi.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/s/se/Seishiro_Nagi.png/revision/latest',
    accentColor: '#94a3b8', // Slate / Silver
    glowColor: 'rgba(148, 163, 184, 0.4)',
    quote: 'Тянуться лень... Но когда суставы свободны, тело ловит мяч само по себе без усилий.',
    quoteContext: 'Поза кобры, бабочка с наклоном и растяжка грудного отдела',
    keyBiomechanicalFocus: 'Позвоночный столб, грудная клетка, фасции шеи и плеч',
  },
  chigiri: {
    id: 'chigiri',
    nameRu: 'Хёма Чигири',
    nameEn: 'Hyoma Chigiri',
    title: 'Красная Пантера • Взрывная Скорость & Защита Коленей',
    specialty: 'Укрепление Связок Колена (ПКС) & Эластичность Квадрицепсов',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/h/hy/Hyoma_Chigiri.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/13/488208.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/h/hy/Hyoma_Chigiri.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/h/hy/Hyoma_Chigiri.png/revision/latest',
    accentColor: '#f43f5e', // Rose / Red
    glowColor: 'rgba(244, 63, 94, 0.4)',
    quote: 'Я больше не боюсь травм. Мои связки готовы к любой скорости и нагрузке.',
    quoteContext: 'Глубокий выпад воина, растяжка передней поверхности бедра и ахилла',
    keyBiomechanicalFocus: 'Крестообразные связки, четырехглавая мышца бедра, ахиллово сухожилие',
  },
  barou: {
    id: 'barou',
    nameRu: 'Шоэй Баро',
    nameEn: 'Shoei Barou',
    title: 'Король Поля • Мощный Кор & Железная Стабильность',
    specialty: 'Мощность Мышц Кора, Раскрытие Плечевого Пояса & Мобильность Груди',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/s/sh/Shoei_Barou.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/15/488209.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/s/sh/Shoei_Barou.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/s/sh/Shoei_Barou.png/revision/latest',
    accentColor: '#a855f7', // Purple
    glowColor: 'rgba(168, 85, 247, 0.4)',
    quote: 'Дисциплина — это закон. Ни сантиметра люфта в осанке!',
    quoteContext: 'Поза верблюда, собака мордой вниз с фиксацией и планка на одной руке',
    keyBiomechanicalFocus: 'Широчайшие мышцы спины, прямая мышца живота, дельты',
  },
  kaiser: {
    id: 'kaiser',
    nameRu: 'Михаэль Кайзер',
    nameEn: 'Michael Kaiser',
    title: 'Император Bastard München • Сверхзвуковой Удар Кайзера',
    specialty: 'Предельная Амплитуда Замаха, Ротация Таза & Мгновенная Стабилизация',
    avatarUrl: 'https://static.wikia.nocookie.net/bluelock/images/m/mi/Michael_Kaiser.png/revision/latest',
    fallbackAvatarUrls: [
      'https://cdn.myanimelist.net/images/characters/4/521456.jpg',
      'https://static.wikia.nocookie.net/bluelock/images/m/mi/Michael_Kaiser.png',
    ],
    bannerUrl: 'https://static.wikia.nocookie.net/bluelock/images/m/mi/Michael_Kaiser.png/revision/latest',
    accentColor: '#38bdf8', // Sky Blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
    quote: 'Невозможное становится тривиальным, когда каждый миллиметр движения выверен до совершенства.',
    quoteContext: 'Динамическая ротация таза и стретчинг с перекрестными махами',
    keyBiomechanicalFocus: 'Косые мышцы живота, ягодичные связки, ротаторы бедра',
  },
  kunigami: {
    id: 'kunigami',
    nameRu: 'Ренске Кунигами',
    nameEn: 'Rensuke Kunigami',
    title: 'Киборг-Герой • Силовая Мобильность & Несокрушимый Каркас',
    specialty: 'Мощная Эластичность Мышц Бедра & Декомпрессия Позвоночника',
    avatarUrl: 'https://cdn.myanimelist.net/images/characters/15/488209.jpg',
    fallbackAvatarUrls: [
      'https://static.wikia.nocookie.net/bluelock/images/c/c5/Rensuke_Kunigami.png',
    ],
    bannerUrl: 'https://cdn.myanimelist.net/images/characters/15/488209.jpg',
    accentColor: '#ea580c', // Orange
    glowColor: 'rgba(234, 88, 12, 0.4)',
    quote: 'Чистая физическая мощь бессмысленна без идеальной гибкости суставов.',
    quoteContext: 'Глубокий PNF-стретчинг квадрицепсов и грудного отдела',
    keyBiomechanicalFocus: 'Квадрицепсы, грудной отдел позвоночника, тазовый пояс',
  },
  sae: {
    id: 'sae',
    nameRu: 'Итоши Саэ',
    nameEn: 'Sae Itoshi',
    title: 'Мировой Плеймейкер • Анатомическая Элегантность & Баланс',
    specialty: 'Хирургическая Точность Движений & Безупречный Центр Тяжести',
    avatarUrl: 'https://cdn.myanimelist.net/images/characters/10/488207.jpg',
    fallbackAvatarUrls: [
      'https://static.wikia.nocookie.net/bluelock/images/7/7b/Sae_Itoshi.png',
    ],
    bannerUrl: 'https://cdn.myanimelist.net/images/characters/10/488207.jpg',
    accentColor: '#14b8a6', // Teal
    glowColor: 'rgba(20, 184, 166, 0.4)',
    quote: 'Контроль мяча начинается с микробаланса кончиков пальцев ног.',
    quoteContext: 'Проприоцептивные стойки на одной ноге и баланс с закрытыми глазами',
    keyBiomechanicalFocus: 'Связки голеностопа, вестибулярный центр, фасции стопы',
  },
};

export function getCharacterByTheme(charKey?: string): BlueLockCharacter {
  if (!charKey) return BLUE_LOCK_CHARACTERS.ego;
  const key = charKey.toLowerCase().trim();

  // 1. Direct key/id match
  if (BLUE_LOCK_CHARACTERS[key]) {
    return BLUE_LOCK_CHARACTERS[key];
  }

  // 2. Exact alias maps
  if (key.includes('исаги') || key.includes('isagi') || key.includes('йоичи') || key.includes('yoichi')) {
    return BLUE_LOCK_CHARACTERS.isagi;
  }
  if (key.includes('бачир') || key.includes('bachira') || key.includes('мегуру') || key.includes('meguru')) {
    return BLUE_LOCK_CHARACTERS.bachira;
  }
  if (key.includes('чигир') || key.includes('chigiri') || key.includes('хёма') || key.includes('hyoma')) {
    return BLUE_LOCK_CHARACTERS.chigiri;
  }
  if (key.includes('кунигам') || key.includes('kunigami') || key.includes('ренске') || key.includes('rensuke')) {
    return BLUE_LOCK_CHARACTERS.kunigami;
  }
  if (key.includes('наги') || key.includes('nagi') || key.includes('сейширо') || key.includes('seishiro')) {
    return BLUE_LOCK_CHARACTERS.nagi;
  }
  if (key.includes('рин') || key.includes('rin') || key.includes('итоши') && (key.includes('рин') || !key.includes('саэ'))) {
    return BLUE_LOCK_CHARACTERS.rin;
  }
  if (key.includes('баро') || key.includes('baro') || key.includes('barou') || key.includes('шоэй') || key.includes('shoei')) {
    return BLUE_LOCK_CHARACTERS.barou;
  }
  if (key.includes('кайзер') || key.includes('kaiser') || key.includes('михаэль') || key.includes('michael')) {
    return BLUE_LOCK_CHARACTERS.kaiser;
  }
  if (key.includes('саэ') || key.includes('sae') || key.includes('сае')) {
    return BLUE_LOCK_CHARACTERS.sae;
  }
  if (key.includes('эго') || key.includes('ego') || key.includes('джинпачи') || key.includes('jinpachi')) {
    return BLUE_LOCK_CHARACTERS.ego;
  }

  // 3. Fallback scan
  for (const [k, char] of Object.entries(BLUE_LOCK_CHARACTERS)) {
    if (char) {
      const ru = (char.nameRu || '').toLowerCase();
      const en = (char.nameEn || '').toLowerCase();
      if (key.includes(k) || ru.includes(key) || en.includes(key) || key.includes(ru) || key.includes(en)) {
        return char;
      }
    }
  }

  return BLUE_LOCK_CHARACTERS.ego;
}
