import { Exercise } from '../types';

export interface ExerciseTechniqueGuide {
  id: string;
  nameRu: string;
  category: 'flexibility' | 'balance' | 'pnf' | 'warmup' | 'cooldown';
  targetAnatomy: {
    primaryMuscles: string[];
    secondaryMuscles: string[];
    fascialTrain: string; // Thomas Myers Anatomy Trains
    jointAction: string;
  };
  videoSearchQuery: string;
  youtubeUrl: string;
  phases: {
    phase: string;
    description: string;
    cue: string;
  }[];
  sensoryFocus: {
    shouldFeel: string;
    shouldNOTFeel: string;
  };
  criticalMistakes: string[];
  progression: string;
  regression: string;
  egoCoachNote: string;
}

export const EXERCISE_TECHNIQUES: Record<string, ExerciseTechniqueGuide> = {
  // PNF Hamstrings
  'd1-m1': {
    id: 'd1-m1',
    nameRu: 'PNF-растяжка подколенных сухожилий (Hamstrings Protocol)',
    category: 'pnf',
    targetAnatomy: {
      primaryMuscles: ['Двуглавая мышца бедра (Biceps femoris)', 'Полусухожильная', 'Полуперепончатая'],
      secondaryMuscles: ['Икроножная мышца', 'Большая ягодичная', 'Плантарная фасция'],
      fascialTrain: 'Поверхностная задняя линия (Superficial Back Line)',
      jointAction: 'Сгибание в тазобедренном суставе при фиксированном разгибании колена',
    },
    videoSearchQuery: 'PNF hamstring stretch technique tutorial physical therapy',
    youtubeUrl: 'https://www.youtube.com/results?search_query=PNF+hamstring+stretch+technique+tutorial',
    phases: [
      {
        phase: '1. Исходная позиция',
        description: 'Ляг на спину на ровную поверхность. Подними рабочую ногу вверх под углом 90° (или максимально доступным). Накинь эластичную ленту, ремень или зафиксируй голень руками.',
        cue: 'Крестец и поясница плотно прижаты к полу, противоположная нога выпрямлена.',
      },
      {
        phase: '2. Фаза изометрического сокращения (5 сек)',
        description: 'На вдохе упрись стопой/пяткой в ремень или руки с усилием 30-40% от максимума, пытаясь опустить ногу вниз. Колено абсолютно прямое.',
        cue: 'Включай рецепторы Гольджи: не допускай судороги, держи ровное давление.',
      },
      {
        phase: '3. Фаза глубокого расслабления и углубления (10-15 сек)',
        description: 'Сделай мощный длинный выдох через рот. Полностью расслабь заднюю поверхность бедра и аккуратно подтяни ногу на 2-4 см ближе к голове.',
        cue: 'Растяжение должно увеличиваться за счет расслабления нервной системы, а не рывка руками.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Глубокое, теплое, равномерное натяжение в центре задней поверхности бедра.',
      shouldNOTFeel: 'Острую стреляющую боль под коленом или онемение в стопе (признак раздражения седалищного нерва).',
    },
    criticalMistakes: [
      'Сгибание колена рабочей ноги (уводит натяжение со связок)',
      'Отрыв поясницы и таза от пола для мнимого увеличения угла',
      'Задержка дыхания во время изометрического напряжения',
    ],
    progression: 'Выполнять захват за носок прямой рукой без использования ремня с наклоном корпуса.',
    regression: 'Смягчить колено на 5° и использовать более длинный ремень или петлю TRX.',
    egoCoachNote: 'Не пытайся обмануть гравитацию. Если ты сгибаешь колено, ты не развиваешь гибкость — ты просто тешишь свое эго фальшивой амплитудой.',
  },

  // Single Leg Balance Hold
  'd1-m2': {
    id: 'd1-m2',
    nameRu: 'Стойка Аиста с контролем проприоцепции (Single Leg Stork Balance)',
    category: 'balance',
    targetAnatomy: {
      primaryMuscles: ['Глубокие мышцы стопы', 'Средняя ягодичная мышца (Gluteus medius)', 'Малоберцовые мышцы'],
      secondaryMuscles: ['Поперечная мышца живота', 'Квадратная мышца поясницы', 'Икроножная'],
      fascialTrain: 'Латеральная линия & Глубинная фронтальная линия',
      jointAction: 'Стабилизация голеностопного и тазобедренного суставов в нейтрали',
    },
    videoSearchQuery: 'single leg balance proprioception training drill',
    youtubeUrl: 'https://www.youtube.com/results?search_query=single+leg+balance+proprioception+training+drill',
    phases: [
      {
        phase: '1. Формирование треноги стопы',
        description: 'Встань босиком. Распредели вес тела на 3 точки опорной стопы: основание большого пальца, основание мизинца и центр пятки.',
        cue: 'Представь, что пальцы стопы буквально впиваются в пол как корни дерева.',
      },
      {
        phase: '2. Выравнивание таза и подъем свободной ноги',
        description: 'Подними вторую ногу, согнув колено до 90 градусов. Зафиксируй гребни подвздошных костей строго на одной горизонтальной линии.',
        cue: 'Не допускай проседания таза на опорной ноге (симптом Тренделенбурга).',
      },
      {
        phase: '3. Фиксация взгляда и вестибулярный контроль',
        description: 'Зафиксируй взгляд на неподвижной точке в 2-3 метрах перед собой. Удерживай вертикальную ось тела.',
        cue: 'Дыши ровно: 4 секунды вдох носом, 4 секунды выдох.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Микросокращения в своде стопы и жжение в наружной части ягодицы опорной ноги.',
      shouldNOTFeel: 'Спастическое напряжение в шее или зажимание плеч к ушам.',
    },
    criticalMistakes: [
      'Заваливание свода стопы внутрь (гиперпронация)',
      'Смещение таза вбок для компенсации слабости ягодичной мышцы',
      'Задержка дыхания и потеря фокуса взгляда',
    ],
    progression: 'Закрыть глаза или выполнять покачивания головой влево-вправо.',
    regression: 'Касаться пальцем свободной ноги пола при потере равновесия или держаться за стену.',
    egoCoachNote: 'Без стабильной стопы любое ускорение — это потеря энергии. Стабильность рождается не в мышцах, а в способности мозга обрабатывать проприоцептивный сигнал.',
  },

  // 90/90 Hip Flow
  'd2-m1': {
    id: 'd2-m1',
    nameRu: 'Мобильность ТБС в позиции 90/90 (90/90 Hip Mobility Flow)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Грушевидная мышца', 'Внутренние и наружные ротаторы бедра', 'Капсула ТБС'],
      secondaryMuscles: ['Напрягатель широкой фасции', 'Подвздошно-поясничная'],
      fascialTrain: 'Спиральная линия (Spiral Line)',
      jointAction: 'Одновременная внутренняя ротация одного бедра и наружная ротация другого',
    },
    videoSearchQuery: '90 90 hip mobility drill physical therapy technique',
    youtubeUrl: 'https://www.youtube.com/results?search_query=90+90+hip+mobility+drill+physical+therapy',
    phases: [
      {
        phase: '1. Построение прямых углов',
        description: 'Сядь на пол. Согни переднюю ногу в колене под углом 90° перед собой, а заднюю отведи в сторону и согни назад тоже под 90°.',
        cue: 'Оба колена и обе стопы образуют углы строго 90 градусов.',
      },
      {
        phase: '2. Осевое вытяжение позвоночника',
        description: 'Выпрями спину, опусти плечи. Постарайся опустить обе седалищные кости как можно ближе к полу.',
        cue: 'Не заваливайся на опорную руку, сохраняй активный кор.',
      },
      {
        phase: '3. Осевой наклон вперед над передним бедром',
        description: 'На выдохе выполни наклон вперед от тазобедренного сустава с прямой спиной (грудь стремится к голени, а не лоб к колену).',
        cue: 'Удерживай позицию 40-60 секунд, мягко дыша в зону ягодицы.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Глубокое натяжение в задней части таза передней ноги и ощущение капсулы в задней ноге.',
      shouldNOTFeel: 'Скручивающей боли в коленном суставе.',
    },
    criticalMistakes: [
      'Скручивание колена вместо движения в тазобедренном суставе',
      'Круглая «горбатая» спина при наклоне вперед',
    ],
    progression: 'Выполнять перекаты из 90/90 в другую сторону без помощи рук.',
    regression: 'Подложить блок под ягодицу передней ноги и опираться на руки сзади.',
    egoCoachNote: 'Заблокированный таз — это приговор для скорости и удара. Разблокируй ротацию ТБС, и твои движения станут неуловимыми.',
  },

  // Pancake / Wide Straddle Fold
  'd3-m1': {
    id: 'd3-m1',
    nameRu: 'Наклон Pancake с передним наклоном таза (Pancake Straddle Stretch)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Большая приводящая мышца (Adductor magnus)', 'Длинная приводящая', 'Тонкая мышца (Gracilis)'],
      secondaryMuscles: ['Подколенные сухожилия', 'Квадратная мышца поясницы'],
      fascialTrain: 'Глубинная фронтальная линия (Deep Front Line)',
      jointAction: 'Отводение бедер с передним наклоном таза (Anterior Pelvic Tilt)',
    },
    videoSearchQuery: 'pancake stretch flexibility gymnastics tutorial',
    youtubeUrl: 'https://www.youtube.com/results?search_query=pancake+stretch+flexibility+gymnastics+tutorial',
    phases: [
      {
        phase: '1. Посадка с широким разведением ног',
        description: 'Сядь на пол, разведи прямые ноги в стороны под углом 90-120°. Колени и носки смотрят строго вверх в потолок.',
        cue: 'Проверни таз вперед, чтобы сидеть на передней части седалищных бугров.',
      },
      {
        phase: '2. Вытягивание передней линии корпуса',
        description: 'Положи ладони на пол перед собой. На вдохе вытяни позвоночник вверх.',
        cue: 'Держи поясницу нейтральной, не позволяй тазу откатываться назад.',
      },
      {
        phase: '3. Пошаговое продвижение вперед на выдохе',
        description: 'Медленно переступай пальцами рук вперед по полу, опуская живот к полу.',
        cue: 'Каждый выдох — еще 1 см продвижения вперед.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Интенсивное натяжение по внутренней поверхности бедер и под коленями.',
      shouldNOTFeel: 'Резкую тянущую боль в паховом кольце или защемление в пояснице.',
    },
    criticalMistakes: [
      'Завал стоп и коленей внутрь к полу (теряется натяжение аддукторов)',
      'Сгибание спины в грудном отделе без движения в тазобедренных суставах',
    ],
    progression: 'Касание животом и грудью пола с удержанием захвата за стопы.',
    regression: 'Сесть на сложенное полотенце или блок для йоги и согнуть колени на 10°.',
    egoCoachNote: 'Pancake — лакмусовая бумажка мобильности таза. Без него твой дриблинг всегда будет зажатым и предсказуемым.',
  },

  // Single Leg Deadlift Balance
  'd2-m2': {
    id: 'd2-m2',
    nameRu: 'Наклон ласточкой на одной ноге (Single Leg RDL Balance)',
    category: 'balance',
    targetAnatomy: {
      primaryMuscles: ['Большая ягодичная', 'Подколенные сухожилия опорной ноги', 'Глубокие ротаторы таза'],
      secondaryMuscles: ['Мышцы, выпрямляющие позвоночник', 'Средняя ягодичная', 'Стабилизаторы стопы'],
      fascialTrain: 'Поверхностная задняя линия & Спиральная линия',
      jointAction: 'Сгибание в тазобедренном суставе (Hip Hinge) при нейтральном позвоночнике',
    },
    videoSearchQuery: 'single leg romanian deadlift balance form cues',
    youtubeUrl: 'https://www.youtube.com/results?search_query=single+leg+romanian+deadlift+balance+form+cues',
    phases: [
      {
        phase: '1. Исходная стойка и активация кора',
        description: 'Встань на одну ногу, колено слегка мягкое (5°). Руки вытянуты перед собой или на поясе.',
        cue: 'Напряги пресс, зафиксируй лопатки сведенными.',
      },
      {
        phase: '2. Отводение свободной ноги назад (Hip Hinge)',
        description: 'Наклоняй прямой корпус вперед, одновременно отводя прямую свободную ногу назад как противовес.',
        cue: 'Тело от макушки до пятки задней ноги образует единую прямую линию.',
      },
      {
        phase: '3. Контроль закрытого таза',
        description: 'Опустись до параллели корпуса с полом. Не разворачивай таз в сторону свободной ноги.',
        cue: 'Носок задней ноги смотрит строго в пол.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Мощное напряжение ягодицы и натяжение задней поверхности опорной ноги.',
      shouldNOTFeel: 'Напряжение или перекос в поясничном отделе.',
    },
    criticalMistakes: [
      'Разворот таза наружу (потеря контроля ротаторов)',
      'Сгибание поясницы вместо наклона в тазобедренном суставе',
    ],
    progression: 'Выполнять с закрытыми глазами или добавить паузу 5 секунд в нижней точке.',
    regression: 'Придерживаться одной рукой за спинку стула или стену.',
    egoCoachNote: 'Умение удерживать центр тяжести при наклоне — основа баланса в борьбе корпус в корпус. Проиграл угол таза — потерял позицию.',
  },

  // Couch Stretch / Quad Psoas
  'd4-m1': {
    id: 'd4-m1',
    nameRu: 'Глубокая растяжка сгибателей бедра и квадрицепса (Couch Stretch)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Прямая мышца бедра (Rectus femoris)', 'Подвздошно-поясничная мышца (Psoas major)'],
      secondaryMuscles: ['Напрягатель широкой фасции', 'Гребенчатая мышца'],
      fascialTrain: 'Поверхностная фронтальная линия (Superficial Front Line)',
      jointAction: 'Разгибание бедра при максимальном сгибании коленного сустава',
    },
    videoSearchQuery: 'couch stretch mobilitywod technique psoas quad',
    youtubeUrl: 'https://www.youtube.com/results?search_query=couch+stretch+mobilitywod+technique+psoas+quad',
    phases: [
      {
        phase: '1. Позиция у стены',
        description: 'Встань на одно колено перед стеной. Голень задней ноги прижата вертикально к стене, носок смотрит вверх. Передняя нога стоит на стопе под углом 90°.',
        cue: 'Под колено обязательно подложи мягкий коврик или подушку.',
      },
      {
        phase: '2. Задний наклон таза (Posterior Pelvic Tilt)',
        description: 'Сожми ягодицу задней ноги и подверни таз под себя (убери прогиб в пояснице).',
        cue: 'Сжатие ягодицы мгновенно усиливает натяжение передней поверхности бедра.',
      },
      {
        phase: '3. Выпрямление корпуса',
        description: 'Медленно поднимай корпус вертикально, сохраняя сжатую ягодицу.',
        cue: 'Держи позицию 60 секунд, дыша глубоко в низ живота.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Интенсивное натяжение по всей передней поверхности бедра от колена до паха.',
      shouldNOTFeel: 'Боль в надколеннике или компрессию в пояснице.',
    },
    criticalMistakes: [
      'Сильный прогиб в пояснице (компенсация зажатости сгибателя бедра)',
      'Расслабление ягодичной мышцы',
    ],
    progression: 'Прижать спину и лопатки вплотную к стене в вертикальном положении.',
    regression: 'Отодвинуть колено на 15-20 см от стены и опираться руками на пол перед собой.',
    egoCoachNote: 'Зажатые сгибатели бедра крадут длину твоего шага и выключают ягодицы. Couch stretch возвращает таз в анатомическую нейтраль.',
  },

  // Thoracic Spine Rotation
  'd5-m1': {
    id: 'd5-m1',
    nameRu: 'Мобильность грудного отдела "Книга / Ветряная мельница" (Thoracic Windmill)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Ротаторы позвоночника', 'Межреберные мышцы', 'Большая и малая грудные'],
      secondaryMuscles: ['Широчайшая мышца спины', 'Ромбовидные мышцы'],
      fascialTrain: 'Спиральная линия & Функциональная линия',
      jointAction: 'Ротация грудного отдела позвоночника при стабилизированной пояснице',
    },
    videoSearchQuery: 'thoracic spine windmill mobility exercise tutorial',
    youtubeUrl: 'https://www.youtube.com/results?search_query=thoracic+spine+windmill+mobility+exercise',
    phases: [
      {
        phase: '1. Боковое положение с фиксацией коленей',
        description: 'Ляг на правый бок. Согни ноги в коленях и тазобедренных суставах под 90°. Вытяни обе руки перед собой.',
        cue: 'Верхнее колено должно плотно лежать на нижнем или на блоке для йоги.',
      },
      {
        phase: '2. Круговое раскрытие верхней руки',
        description: 'На вдохе веди левую руку по полу широким полукругом над головой, раскрывая грудную клетку влево.',
        cue: 'Взгляд следует за кончиками пальцев движущейся руки.',
      },
      {
        phase: '3. Фиксация лопатки на полу',
        description: 'Положи левую лопатку на пол. Сделай глубокий выдох, расслабляя ребра.',
        cue: 'Колени не должны отрываться от пола или смещаться относительно друг друга.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Приятное раскрытие в грудном отделе, межреберных промежутках и передней части плеча.',
      shouldNOTFeel: 'Скручивания или боли в пояснично-крестцовом отделе.',
    },
    criticalMistakes: [
      'Отрыв коленей от пола (уводит ротацию из грудного отдела в поясницу)',
      'Резкие рывковые движения плечом',
    ],
    progression: 'Выполнять с фиксацией легкого веса в руке (1-2 кг) для углубления ротации.',
    regression: 'Выполнять раскрытие по прямой линии (по книге) вместо кругового вращения.',
    egoCoachNote: 'Без мобильного грудного отдела твои руки и плечи зажаты, а дыхательный объем ограничен на 30%.',
  },

  // Pigeon Pose
  'pigeon-pose': {
    id: 'pigeon-pose',
    nameRu: 'Поза Голубя (Pigeon Pose / Глабеллярная декомпрессия ягодичных)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Грушевидная мышца (Piriformis)', 'Большая и средняя ягодичные', 'Близнецовые мышцы'],
      secondaryMuscles: ['Подвздошно-поясничная мышца задней ноги', 'Квадратная мышца поясницы'],
      fascialTrain: 'Спиральная & Латеральная линии (Spiral & Lateral Lines)',
      jointAction: 'Глубокая наружная ротация и сгибание бедра передней ноги',
    },
    videoSearchQuery: 'pigeon pose yoga form cues physical therapy piriformis',
    youtubeUrl: 'https://www.youtube.com/results?search_query=pigeon+pose+form+cues+physical+therapy',
    phases: [
      {
        phase: '1. Исходная позиция и выравнивание таза',
        description: 'Из упора на четвереньках или планки выведи правое колено к правому запястью, а стопу направь к левому бедру. Заднюю ногу вытяни строго назад.',
        cue: 'Оба гребня подвздошных костей должны быть направлены строго вперед к полу, без перекоса таза.',
      },
      {
        phase: '2. Декомпрессия позвоночника',
        description: 'На вдохе упрись ладонями в пол, вытяни позвоночник вверх и опусти плечи от ушей.',
        cue: 'Не заваливайся на правое бедро — сохраняй центрированный вес.',
      },
      {
        phase: '3. Опускание корпуса на выдохе',
        description: 'Медленно опустись на предплечья или полностью опусти грудь на пол перед собой.',
        cue: 'Дыши ровно: выдох направляй в глубину ягодичной мышцы.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Глубокое приятное натяжение в центре ягодицы передней ноги и растяжение сгибателя задней ноги.',
      shouldNOTFeel: 'Скручивающей или колющей боли в колене передней ноги.',
    },
    criticalMistakes: [
      'Заваливание таза вбок на ягодицу (снимает целевую нагрузку)',
      'Скручивание коленного сустава при недостаточной подвижности ТБС',
      'Задержка дыхания при дискомфорте',
    ],
    progression: 'Увеличить угол в колене передней ноги до 90 градусов (голень параллельна переднему краю коврика).',
    regression: 'Подложить блок для йоги или свернутое полотенце под ягодицу передней ноги, либо выполнять фигуру «4» лежа на спине.',
    egoCoachNote: 'Зажатая грушевидная мышца пережимает седалищный нерв и крадет до 20% мощности отталкивания. Освободи бедро.',
  },

  // Frog Stretch (Поза Лягушки)
  'frog-stretch': {
    id: 'frog-stretch',
    nameRu: 'Поза Лягушки (Frog Stretch / Раскрытие аддукторов)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Комплекс приводящих мышц (Adductors)', 'Тонкая мышца (Gracilis)', 'Гребенчатая мышца'],
      secondaryMuscles: ['Тазовое дно', 'Глубокие ротаторы тазобедренного сустава'],
      fascialTrain: 'Глубинная фронтальная линия (Deep Front Line)',
      jointAction: 'Максимальное отведение бедер с наружной ротацией в ТБС',
    },
    videoSearchQuery: 'frog stretch hip mobility cues physical therapy',
    youtubeUrl: 'https://www.youtube.com/results?search_query=frog+stretch+hip+mobility+cues',
    phases: [
      {
        phase: '1. Исходная позиция на коленях',
        description: 'Встань на четвереньки на мягком коврике. Разведи колени максимально широко в стороны. Стопы разверни наружу так, чтобы внутренние края стоп лежали на полу.',
        cue: 'Голени строго параллельны друг другу, стопы направлены в стороны.',
      },
      {
        phase: '2. Опора на предплечья и фиксация нейтрали',
        description: 'Опустись на локти и предплечья. Сохраняй естественный прогиб в пояснице.',
        cue: 'Таз находится на одной линии с коленями, не уводи его слишком вперед.',
      },
      {
        phase: '3. Медленное смещение таза назад на выдохе',
        description: 'На глубоком длинном выдохе плавно смести таз на 2-4 см назад к пяткам.',
        cue: 'Почувствуй мощное, но контролируемое натяжение по внутренним поверхностям бедер.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Интенсивное симметричное натяжение по всей внутренней поверхности обоих бедер.',
      shouldNOTFeel: 'Острой боли в коленных суставах или сдавливания в паху.',
    },
    criticalMistakes: [
      'Уход таза далеко вперед от линии коленей (облегчает упражнение, теряя пользу)',
      'Сведение стоп вместе позади себя',
      'Сильное скругление спины горбом',
    ],
    progression: 'Поочередный подъем стоп от пола для динамической внутренней ротации ТБС.',
    regression: 'Уменьшить расстояние между коленями и подложить подушки под колени.',
    egoCoachNote: 'Поза лягушки открывает ворота к поперечному шпагату. Терпи натяжение фасций — здесь куется твоя амплитуда.',
  },

  // Butterfly PNF (Бабочка)
  'butterfly-stretch': {
    id: 'butterfly-stretch',
    nameRu: 'Бабочка с PNF-активацией (Butterfly Adductor Flow)',
    category: 'pnf',
    targetAnatomy: {
      primaryMuscles: ['Короткая и длинная приводящие мышцы', 'Гребенчатая мышца', 'Капсула ТБС'],
      secondaryMuscles: ['Плантарная фасция стопы', 'Квадратная мышца поясницы'],
      fascialTrain: 'Глубинная фронтальная линия (Deep Front Line)',
      jointAction: 'Сгибание и наружная ротация бедер в положении сидя',
    },
    videoSearchQuery: 'PNF butterfly stretch hip mobility tutorial',
    youtubeUrl: 'https://www.youtube.com/results?search_query=butterfly+stretch+mobility+cues',
    phases: [
      {
        phase: '1. Соединение стоп и прямая спина',
        description: 'Сядь на пол, соедини подошвы стоп вместе перед собой и подтяни пятки ближе к паху. Обхвати стопы руками.',
        cue: 'Вытяни макушку вверх, раскрой грудную клетку.',
      },
      {
        phase: '2. Фаза изометрического сокращения (5 сек)',
        description: 'Положи ладони или локти на колени. Пытайся сжать колени навстречу друг другу, оказывая руками сопротивление 40%.',
        cue: 'Включай рецепторы Гольджи: держи статическое давление 5 секунд.',
      },
      {
        phase: '3. Фаза расслабления и углубления (15 сек)',
        description: 'Сделай мощный выдох, расслабь бедра и плавно опусти колени еще ближе к полу за счет расслабления.',
        cue: 'Опускай колени силой мышц-антагонистов (ягодичных).',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Раскрытие в паховой зоне и постепенное приближение коленей к полу.',
      shouldNOTFeel: 'Боли в голеностопных суставах.',
    },
    criticalMistakes: [
      'Судорожные резкие подпрыгивания коленями («махи бабочки» без контроля)',
      'Сутулая спина и опущенная голова',
    ],
    progression: 'Наклон прямого корпуса вперед с касанием грудью стоп.',
    regression: 'Отодвинуть стопы дальше от паха (форма ромба) или сесть на возвышение.',
    egoCoachNote: 'Рывки в бабочке травмируют суставную губу. Только PNF и осознанное дыхание расширяют диапазон.',
  },

  // Ankle Dorsiflexion Wall Drill (Мобильность голеностопа)
  'ankle-dorsiflexion': {
    id: 'ankle-dorsiflexion',
    nameRu: 'Мобильность голеностопа у стены (Ankle Dorsiflexion Wall Knee-Drive)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Камбаловидная мышца (Soleus)', 'Икроножная мышца', 'Передняя большеберцовая'],
      secondaryMuscles: ['Ахиллово сухожилие', 'Плантарный апоневроз стопы'],
      fascialTrain: 'Поверхностная задняя линия & Глубинная фронтальная линия',
      jointAction: 'Дорсифлексия (тыльное сгибание) в голеностопном суставе',
    },
    videoSearchQuery: 'knee to wall ankle dorsiflexion test physical therapy',
    youtubeUrl: 'https://www.youtube.com/results?search_query=knee+to+wall+ankle+mobility+exercise',
    phases: [
      {
        phase: '1. Исходное положение у стены',
        description: 'Встань лицом к стене в положении выпада. Носок передней ноги поставь на расстоянии 5-10 см от стены.',
        cue: 'Пятка передней ноги должна быть намертво приклеена к полу.',
      },
      {
        phase: '2. Направление колена к стене',
        description: 'Медленно подавай колено вперед, стремясь коснуться стены по траектории строго над вторым пальцем стопы.',
        cue: 'Не допускай завала колена внутрь или отрыва пятки от пола.',
      },
      {
        phase: '3. Удержание в крайней точке (3-5 сек)',
        description: 'Зафиксируй максимальное тыльное сгибание, удерживая пятку на полу, затем плавно вернись назад.',
        cue: 'Почувствуй растяжение в глубокой камбаловидной мышце над пяткой.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Глубокое упругое натяжение в нижней части икры и ахилловом сухожилии.',
      shouldNOTFeel: 'Острого защемления спереди в суставе (признак костного импиджмента).',
    },
    criticalMistakes: [
      'Отрыв пятки от пола для мнимого касания стены',
      'Завал свода стопы и колена внутрь (вальгус)',
    ],
    progression: 'Отодвигать носок дальше от стены (10-15 см) или использовать возвышение под носок.',
    regression: 'Поставить носок ближе к стене (3-5 см).',
    egoCoachNote: 'Без угла голеностопа хотя бы в 35-40 градусов ты никогда не сможешь сесть в глубокий присед и теряешь взрывной старт.',
  },

  // Lizard Lunge (Выпад Ящерица)
  'lizard-lunge': {
    id: 'lizard-lunge',
    nameRu: 'Глубокий выпад "Ящерица" (Lizard Lunge Hip Opener)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Подвздошно-поясничная мышца', 'Приводящие мышцы', 'Глубокая капсула ТБС'],
      secondaryMuscles: ['Прямая мышца бедра', 'Большая ягодичная мышца'],
      fascialTrain: 'Глубинная фронтальная линия (Deep Front Line)',
      jointAction: 'Глубокое сгибание одного ТБС с переразгибанием другого',
    },
    videoSearchQuery: 'lizard pose hip mobility stretch yoga tutorial',
    youtubeUrl: 'https://www.youtube.com/results?search_query=lizard+pose+hip+mobility+stretch',
    phases: [
      {
        phase: '1. Широкий шаг вперед',
        description: 'Сделай широкий выпад правой ногой вперед. Поставь обе ладони на пол с внутренней стороны правой стопы.',
        cue: 'Правая пятка строго под коленом или чуть впереди, пальцы стопы направлены вперед.',
      },
      {
        phase: '2. Провисание таза к полу',
        description: 'Опусти заднее колено на пол и вытяни подъем задней стопы. Позволь тазу под собственным весом провиснуть вниз и вперед.',
        cue: 'Не зажимай плечи к ушам, держи грудную клетку расправленной.',
      },
      {
        phase: '3. Опускание на предплечья (по готовности)',
        description: 'На длинном выдохе опустись сначала на левый локоть, затем на правый. Мягко дыши в зону паха 40-60 секунд.',
        cue: 'Каждый выдох — расслабление связок таза.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Интенсивное, глубокое растяжение в передней поверхности бедра сзади и в паху спереди.',
      shouldNOTFeel: 'Острой боли в коленной чашечке задней ноги (подложи мягкий коврик).',
    },
    criticalMistakes: [
      'Острый угол в колене передней ноги с выходом колена далеко за носок',
      'Круглая горбатая спина с зажатой шеей',
    ],
    progression: 'Оторвать колено задней ноги от пола и удерживать прямую заднюю ногу.',
    regression: 'Оставаться на прямых руках или использовать йога-блоки под ладони.',
    egoCoachNote: 'Выпад ящерицы раскрепощает заблокированный таз, увеличивая длину шага на 15-20 см.',
  },

  // CARs Hip (Вращения бедром)
  'cars-hip': {
    id: 'cars-hip',
    nameRu: 'Суставные ротации ТБС (Hip CARs FRC Protocol)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Внутренние и наружные ротаторы бедра', 'Отводящие мышцы', 'Глубокая капсула ТБС'],
      secondaryMuscles: ['Мышцы кора', 'Квадратная мышца поясницы'],
      fascialTrain: 'Спиральная линия & Глубинная фронтальная линия',
      jointAction: 'Изолированная 360-градусная циркумдукция в тазобедренном суставе',
    },
    videoSearchQuery: 'hip cars functional range conditioning tutorial',
    youtubeUrl: 'https://www.youtube.com/results?search_query=hip+cars+frc+tutorial',
    phases: [
      {
        phase: '1. Жесткая база на четвереньках',
        description: 'Встань на четвереньки, ладони под плечами, колени под тазом. Напряги пресс на 50%, заблокируй поясницу от прогибов.',
        cue: 'Двигаться должен ТОЛЬКО тазобедренный сустав, корпус монолитен.',
      },
      {
        phase: '2. Сгибание и отведение',
        description: 'Подтяни правое согнутое колено к груди, затем медленно отведи его в сторону на максимальную высоту без смещения таза.',
        cue: 'Веди движение медленно, преодолевая воображаемое сопротивление плотной воды.',
      },
      {
        phase: '3. Внутренняя ротация и увод назад',
        description: 'Разверни стопу вверх к потолку (пятка выше колена) и уведи бедро назад, совершая полный круг.',
        cue: 'Не прогибай поясницу в крайней точке увода назад.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Глубокую работу мышц вокруг тазобедренного сустава и легкое тепло в капсуле.',
      shouldNOTFeel: 'Хруста с острой болью или перекоса в поясничном отделе.',
    },
    criticalMistakes: [
      'Компенсация движением поясницы и наклоном корпуса вбок',
      'Слишком быстрое бесконтрольное вращение по инерции',
    ],
    progression: 'Выполнять стоя с фиксацией одной рукой за опору.',
    regression: 'Уменьшить радиус описываемого круга колена.',
    egoCoachNote: 'CARs обновляет синовиальную жидкость сустава. Если ты не используешь полную амплитуду, мозг ее удаляет.',
  },

  // Dancer Pose / Balance
  'dancer-pose': {
    id: 'dancer-pose',
    nameRu: 'Баланс в позе Танцора (Nagi Dynamic Dancer Balance)',
    category: 'balance',
    targetAnatomy: {
      primaryMuscles: ['Глубокие стабилизаторы стопы', 'Квадрицепс и сгибатель поднятой ноги', 'Ягодичная опорной ноги'],
      secondaryMuscles: ['Широчайшая мышца спины', 'Грудные мышцы', 'Пресс'],
      fascialTrain: 'Поверхностная фронтальная линия & Спиральная линия',
      jointAction: 'Разгибание бедра и плеча с удержанием унилатерального баланса',
    },
    videoSearchQuery: 'dancer pose yoga balance cues tutorial',
    youtubeUrl: 'https://www.youtube.com/results?search_query=dancer+pose+yoga+balance+cues',
    phases: [
      {
        phase: '1. Захват стопы',
        description: 'Встань на правую ногу. Согни левую ногу назад и захвати левую щиколотку изнутри левой рукой.',
        cue: 'Опорная стопа активна: большой палец, мизинец и пятка прижаты к полу.',
      },
      {
        phase: '2. Вытягивание оси',
        description: 'Вытяни правую руку вперед и вверх, направляя взгляд на кончики пальцев или точку перед собой.',
        cue: 'Не зажимай шею, дыши ровно через нос.',
      },
      {
        phase: '3. Наклон с отталкиванием стопой',
        description: 'На выдохе наклоняй корпус вперед, одновременно с силой толкая левую стопу назад и вверх в ладонь.',
        cue: 'Прогиб формируется за счет натяжения стопы в руке и раскрытия груди.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Стабильность в опорной стопе и натяжение передней поверхности поднятого бедра и груди.',
      shouldNOTFeel: 'Острой компрессии в поясничных позвонках.',
    },
    criticalMistakes: [
      'Разворот таза вбок (держи обе подвздошные кости направленными вперед)',
      'Сгибание опорного колена до дрожи',
    ],
    progression: 'Наклон до параллели корпуса с полом с закрытыми глазами на 5 секунд.',
    regression: 'Придерживаться свободной рукой за стену или спинку стула.',
    egoCoachNote: 'Поза танцора объединяет эластичность связок и вестибулярный контроль в единый кинетический взрыв.',
  },

  // Camel Pose (Поза Верблюда)
  'camel-pose': {
    id: 'camel-pose',
    nameRu: 'Поза Верблюда для раскрытия передней цепи (Ustrasana Camel Pose)',
    category: 'flexibility',
    targetAnatomy: {
      primaryMuscles: ['Грудные мышцы', 'Прямая мышца живота', 'Квадрицепсы', 'Подвздошно-поясничные'],
      secondaryMuscles: ['Передняя дельтовидная', 'Разгибатели позвоночника'],
      fascialTrain: 'Поверхностная фронтальная линия (Superficial Front Line)',
      jointAction: 'Разгибание позвоночника и тазобедренных суставов',
    },
    videoSearchQuery: 'camel pose yoga physical therapy thoracic spine',
    youtubeUrl: 'https://www.youtube.com/results?search_query=camel+pose+yoga+form+cues',
    phases: [
      {
        phase: '1. Исходная стойка на коленях',
        description: 'Встань на колени, расставив их на ширину таза. Бедра строго вертикальны полу.',
        cue: 'Положи ладони на крестец пальцами вверх, сведи лопатки вместе.',
      },
      {
        phase: '2. Выталкивание таза вперед',
        description: 'Сожми ягодицы и толкай таз вперед, раскрывая грудную клетку вверх в потолок.',
        cue: 'Прогибайся в грудном отделе, а не за счет излома в пояснице.',
      },
      {
        phase: '3. Захват за пятки',
        description: 'Поочередно опусти ладони на пятки. Держи грудь направленной вверх, голову мягко отклони назад без зажима шеи.',
        cue: 'Удерживай 30-45 секунд, глубоко дыша ребрами.',
      },
    ],
    sensoryFocus: {
      shouldFeel: 'Мощное освобождающее раскрытие по всей передней поверхности тела от коленей до горла.',
      shouldNOTFeel: 'Защемляющей боли в пояснице.',
    },
    criticalMistakes: [
      'Уход таза назад за линию коленей (компенсация нехватки гибкости)',
      'Слишком сильное запрокидывание головы с пережиманием сосудов шеи',
    ],
    progression: 'Полный прогиб с касанием руками пола за стопами.',
    regression: 'Держать руки на пояснице и не опускать ладони на пятки.',
    egoCoachNote: 'Раскрытие передней фасциальной линии снимает хроническое напряжение от сидения за столом.',
  },
};

export function getExerciseTechnique(
  exerciseId: string,
  exerciseName: string,
  exerciseData?: Partial<Exercise>
): ExerciseTechniqueGuide {
  // 1. Direct ID match
  if (EXERCISE_TECHNIQUES[exerciseId]) {
    return EXERCISE_TECHNIQUES[exerciseId];
  }

  // 2. Strict / Semantic Match
  const lower = (exerciseName || '').toLowerCase();

  if (lower.includes('голуб') || lower.includes('pigeon')) {
    return EXERCISE_TECHNIQUES['pigeon-pose'];
  }
  if ((lower.includes('лягушк') || lower.includes('frog')) && !lower.includes('kick') && !lower.includes('квадрицепс')) {
    return EXERCISE_TECHNIQUES['frog-stretch'];
  }
  if (lower.includes('бабочк') || lower.includes('butterfly')) {
    return EXERCISE_TECHNIQUES['butterfly-stretch'];
  }
  if (lower.includes('ящериц') || lower.includes('lizard')) {
    return EXERCISE_TECHNIQUES['lizard-lunge'];
  }
  if (lower.includes('couch') || lower.includes('диван') || (lower.includes('квадрицепс') && (lower.includes('сгибател') || lower.includes('живот') || lower.includes('захват')))) {
    return EXERCISE_TECHNIQUES['d4-m1'] || EXERCISE_TECHNIQUES['lizard-lunge'];
  }
  if (lower.includes('car') || (lower.includes('вращен') && lower.includes('бедр'))) {
    return EXERCISE_TECHNIQUES['cars-hip'];
  }
  if (lower.includes('танцор') || lower.includes('dancer')) {
    return EXERCISE_TECHNIQUES['dancer-pose'];
  }
  if (lower.includes('верблюд') || lower.includes('camel') || lower.includes('раскрытие грудн')) {
    return EXERCISE_TECHNIQUES['camel-pose'];
  }
  if (lower.includes('голеностоп') || lower.includes('ankle') || lower.includes('дорсифлекс') || lower.includes('ахилл') || lower.includes('камбаловид')) {
    return EXERCISE_TECHNIQUES['ankle-dorsiflexion'];
  }
  if (lower.includes('90/90') || (lower.includes('тбс') && lower.includes('ротац'))) {
    return EXERCISE_TECHNIQUES['d2-m1'];
  }
  if (lower.includes('pancake') || lower.includes('блинчик') || (lower.includes('широк') && lower.includes('складк'))) {
    return EXERCISE_TECHNIQUES['d3-m1'];
  }
  if (lower.includes('ласточк') || lower.includes('rdl') || lower.includes('deadlift') || lower.includes('самолет') || (lower.includes('воин') && lower.includes('3')) || (lower.includes('баланс') && lower.includes('наклон'))) {
    return EXERCISE_TECHNIQUES['d2-m2'];
  }
  if (lower.includes('аист') || lower.includes('stork') || lower.includes('дерев') || (lower.includes('стойка') && lower.includes('одной ноге'))) {
    return EXERCISE_TECHNIQUES['d1-m2'];
  }
  if (lower.includes('подколенн') || lower.includes('hamstring') || lower.includes('складка') || lower.includes('задняя поверхность') || lower.includes('наклон к носк')) {
    return EXERCISE_TECHNIQUES['d1-m1'];
  }
  if (lower.includes('грудн') || lower.includes('позвоночн') || lower.includes('мельниц') || lower.includes('ротация корпуса') || lower.includes('книга')) {
    return EXERCISE_TECHNIQUES['d5-m1'];
  }

  // 3. Dynamic Custom Guide accurately generated from Exercise's own properties
  const instructions = exerciseData?.instructions || [];
  const primaryMuscles = exerciseData?.targetMuscleOrSkill
    ? [exerciseData.targetMuscleOrSkill]
    : ['Целевые мышечно-фасциальные группы', 'Суставные стабилизаторы'];

  const phases = instructions.length >= 2
    ? instructions.map((step, idx) => ({
        phase: `${idx + 1}. ${idx === 0 ? 'Исходное положение' : idx === 1 ? 'Рабочая амплитуда' : idx === 2 ? 'Фиксация и дыхание' : 'Завершение фазы'}`,
        description: step,
        cue: idx === 0 ? (exerciseData?.targetAngleOrCue || 'Контролируй нейтраль суставов') : idx === 1 ? (exerciseData?.breathingPattern || 'Длинный плавный выдох') : (exerciseData?.strictCoachTip || 'Фокус на расслаблении антагонистов'),
      }))
    : [
        {
          phase: '1. Анатомическая отстройка',
          description: `Зафиксируй опорные точки и стабильную нейтраль позвоночника. Мышцы кора собраны на 30%, дыхание ровное.`,
          cue: exerciseData?.targetAngleOrCue || 'Осознай опорные точки и распределение веса',
        },
        {
          phase: '2. Вход в целевое натяжение',
          description: `На плавном выдохе через рот войди в рабочий угол для проработки: ${exerciseData?.targetMuscleOrSkill || 'целевой группы'}. Без рывков и инерции.`,
          cue: exerciseData?.breathingPattern || 'Выдох 6 секунд на углублении',
        },
        {
          phase: '3. Фиксация и нейромышечный контроль',
          description: 'Удерживай позу под полным контролем нервной системы, расслабляя мышцы-антагонисты на каждом цикле дыхания.',
          cue: exerciseData?.strictCoachTip || 'Контролируй угол суставов, не допускай перекоса',
        },
      ];

  return {
    id: exerciseId,
    nameRu: exerciseName,
    category: (exerciseData?.category as any) || 'flexibility',
    targetAnatomy: {
      primaryMuscles,
      secondaryMuscles: ['Мышцы-синергисты', 'Глубокие проприоцептивные рецепторы'],
      fascialTrain: 'Анатомический поезд движения (Anatomy Trains)',
      jointAction: 'Осевая мобилизация и стабилизация в нейтрали',
    },
    videoSearchQuery: `${exerciseName} stretching exercise technique tutorial`,
    youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' stretching tutorial')}`,
    phases,
    sensoryFocus: {
      shouldFeel: `Чистое, глубокое натяжение и активацию в зоне: ${exerciseData?.targetMuscleOrSkill || 'целевой группы'}.`,
      shouldNOTFeel: 'Острой суставной боли, покалывания, защемления или судорог.',
    },
    criticalMistakes: [
      'Использование инерции и рывков вместо плавного фасциального натяжения',
      'Задержка дыхания при пиковой нагрузке',
      'Компенсаторный излом в смежных суставах',
    ],
    progression: exerciseData?.progression || 'Увеличить время удержания на 15 секунд или углубить угол на 10%.',
    regression: exerciseData?.regression || 'Использовать опору или уменьшить рабочий угол.',
    egoCoachNote: exerciseData?.strictCoachTip || 'Форма важнее эго. Каждое небрежное движение отдаляет тебя от абсолютной гибкости.',
  };
}
