import { UserProfile, WeeklyPlan, WorkoutDay, Exercise } from '../types';
import { BLUE_LOCK_CHARACTERS } from '../data/characters';
import { calculateAccurateWorkoutMinutes } from './planDuration';
import { DEFAULT_WEEKLY_PLAN } from '../data/defaultPlan';

const PHASES: Record<number, string> = {
  1: 'Фаза 1: Анатомическая Адаптация & Декомпрессия Фасций',
  2: 'Фаза 2: Глубокая PNF-Гипертрофия Подвижности & CRAC-Протоколы',
  3: 'Фаза 3: Метавидение & Взрывной Проприоцептивный Баланс',
  4: 'Фаза 4: Кинетическое Доминирование & Предельный Диапазон Движения',
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep Personalized Initial Plan Generator (Week 1)
 */
export function generatePersonalizedInitialPlan(profile: UserProfile): WeeklyPlan {
  const sport = profile.sport?.trim() || 'Футбол / Общая атлетика';
  const fold = profile.flexibilityAssessment?.forwardFold ?? 0;
  const pancake = profile.flexibilityAssessment?.hipMobilityPancake ?? 3;
  const closedEyes = profile.balanceAssessment?.singleLegClosedEyesSeconds ?? 10;
  const sportRoutine = profile.currentBalanceSportRoutine || 'Базовый тренинг';

  const foldAnalysis =
    fold > 0
      ? `+${fold} см до пола (зажаты задняя поверхность бедра и поясничная фасция)`
      : `${Math.abs(fold)} см за линию стоп (хороший потенциал эластичности)`;

  const balanceAnalysis =
    closedEyes < 15
      ? `${closedEyes} сек (вестибулярная нестабильность и завал стопы)`
      : `${closedEyes} сек (надежный базовый проприоцептивный якорь)`;

  const analysis = `ДЖИНПАЧИ ЭГО — ПЕРСОНАЛЬНЫЙ БИОМЕХАНИЧЕСКИЙ ВЕРДИКТ:
Атлет: ${profile.name || 'Атлет'}, профиль специализации: «${sport}».
Тест гибкости задней кинетической цепи: ${foldAnalysis}.
Мобильность тазобедренных суставов (Pancake): ${pancake}/5.
Вестибулярный тест с закрытыми глазами: ${balanceAnalysis}.
Текущий тренировочный фон («${sportRoutine}») не обеспечивал достаточного фасциального скольжения и глубокого PNF-сокращения. Мы внедрили 7 уникальных 45-минутных тренировочных дней, направленных на преодоление специфических компенсаций для «${sport}».`;

  const adaptation = `Протокол Недели 1: Полноценные 45-минутные блоки на 7 дней. Строгое разделение: упражнения на повторения выполняются технично в заданном темпе, а статические PNF-удержания фиксируются по таймеру с 6-секундной фазой изометрического давления (40-50% усилия) и последующим углублением на выдохе. Никаких пропусков сторон!`;

  const baseDays = deepClone(DEFAULT_WEEKLY_PLAN.days);

  const personalizedDays: WorkoutDay[] = baseDays.map((rawDay) => {
    const day = deepClone(rawDay);

    if (day.dayNumber === 1) {
      day.title = `День 1: Пробуждение задней цепи & Вестибулярный Якорь для «${sport}»`;
    } else if (day.dayNumber === 2) {
      day.title = `День 2: Лабильность суставов & Дриблинг-Мобильность Бачиры (${sport})`;
    }

    const personalizeList = (list: Exercise[], prefix: string) => {
      return list.map((ex, idx) => {
        const item: Exercise = {
          ...ex,
          id: `w1-d${day.dayNumber}-${prefix}${idx + 1}`,
          difficulty: profile.experienceLevel === 'advanced' ? 'scale_up' : 'standard',
        };

        if (item.type === 'reps') {
          if (!item.reps || item.reps <= 0) item.reps = 10;
          if (!item.durationSeconds || item.durationSeconds <= 0) item.durationSeconds = 50;
        } else {
          item.type = 'timed_hold';
          item.reps = undefined;
          if (!item.durationSeconds || item.durationSeconds <= 0) item.durationSeconds = 60;
        }

        if (fold > 5 && (item.targetMuscleOrSkill.includes('Подколен') || item.targetMuscleOrSkill.includes('Задняя'))) {
          item.regression = 'Слегка согни опорное колено на 5-10° для защиты поясницы';
          item.strictCoachTip = `Учитывая жесткость задней цепи (+${fold} см), не форсируй наклон поясницей — проворачивай исключительно таз в ТБС.`;
        }

        if (closedEyes < 10 && item.category === 'balance') {
          item.regression = 'Держи один палец у стены для ориентации в пространстве';
          item.strictCoachTip = 'Гаси колебания стопы давлением большого пальца и внешнего ребра стопы в пол.';
        }

        return item;
      });
    };

    day.warmup = personalizeList(day.warmup, 'w');
    day.mainRoutine = personalizeList(day.mainRoutine, 'm');
    day.cooldown = personalizeList(day.cooldown, 'c');
    day.completed = false;
    day.estimatedDurationMin = calculateAccurateWorkoutMinutes(day);

    return day;
  });

  return {
    weekNumber: 1,
    mesocyclePhase: 'Фаза 1: Анатомическая Адаптация & Декомпрессия Фасций',
    generatedAt: new Date().toISOString(),
    aiCoachAnalysis: analysis,
    adaptationNotes: adaptation,
    days: personalizedDays,
    isCompleted: false,
  };
}

/**
 * Helper to build custom Day 1 and customized routine according to athletic wishes & focusArea
 */
function buildCustomizedDay1(
  week: number,
  focusArea: string,
  userNotes: string,
  profile: UserProfile
): WorkoutDay {
  const notes = (userNotes || '').toLowerCase();
  const isSplits =
    focusArea === 'splits' ||
    notes.includes('шпагат') ||
    notes.includes('папа') ||
    notes.includes('аддуктор') ||
    notes.includes('растяжк') ||
    notes.includes('ноги') ||
    notes.includes('раскрыт');
  const isBalance =
    focusArea === 'balance_vestibular' ||
    notes.includes('баланс') ||
    notes.includes('вестибуляр') ||
    notes.includes('глаза') ||
    notes.includes('равновеси') ||
    notes.includes('ласточк') ||
    notes.includes('координац') ||
    notes.includes('устойчив');
  const isKnees =
    focusArea === 'knees_ankles' ||
    notes.includes('колен') ||
    notes.includes('связк') ||
    notes.includes('ахилл') ||
    notes.includes('сустав') ||
    notes.includes('мениск') ||
    notes.includes('голеностоп') ||
    notes.includes('спин') ||
    notes.includes('поясниц') ||
    notes.includes('беречь');

  if (isSplits) {
    return {
      dayNumber: 1,
      title: `Неделя ${week} • День 1: PNF-Прорыв к Шпагату & Глубокая Декомпрессия ТБС`,
      focus: 'flexibility',
      estimatedDurationMin: 45,
      completed: false,
      animeTheme: {
        character: BLUE_LOCK_CHARACTERS.rin.nameRu,
        characterId: 'rin',
        quote: 'Шпагат — это не просто гибкость. Это хирургический контроль над каждым нервным волокном таза.',
        quoteSource: 'Blue Lock',
        conceptTitle: 'Surgical Split Mastery',
        bgImageUrl: BLUE_LOCK_CHARACTERS.rin.bannerUrl,
        tacticalRationale: `Сфокусировано на пожелании атлета: ${userNotes ? `«${userNotes}» — ` : ''}глубокое раскрытие поперечного и продольного шпагата через PNF-изометрию и реципрокное торможение.`,
      },
      warmup: [
        {
          id: `w${week}-d1-w1`,
          name: 'Суставные вращения в ТБС стоя (CARs)',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Тазобедренные суставы, синовиальная жидкость',
          type: 'reps',
          reps: 10,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: true,
          setupInstructions: 'Встань прямо, подними колено до 90°, отведи в сторону и очерти круг назад.',
          commonMistakes: ['Наклон корпуса вбок', 'Раскачивание таза'],
          strictCoachTip: 'Держи корпус неподвижно, изоляция только в головке бедренной кости.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-w2`,
          name: 'Поза Бабочки в динамике с мягким пульсом',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Приводящие мышцы бедра, паховые связки',
          type: 'reps',
          reps: 15,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Соедини стопы вместе, пятки к паху, спина вертикальная.',
          commonMistakes: ['Скругление поясницы', 'Резкие рывки'],
          strictCoachTip: 'Удерживай ровную осанку, раскрывай колени усилием ягодичных.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-w3`,
          name: 'Кошка-Корова с волновой артикуляцией',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Позвоночник, фасции спины, таз',
          type: 'reps',
          reps: 12,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Упор на четвереньках, на вдохе прогиб (Корова), на выдохе купол спины (Кошка).',
          commonMistakes: ['Залом шеи назад', 'Движение только поясницей'],
          strictCoachTip: 'Прокатывай движение волной от копчика до затылка.',
          difficulty: 'standard',
        },
      ],
      mainRoutine: [
        {
          id: `w${week}-d1-m1`,
          name: 'PNF поперечного шпагата (Middle Split) с опорой на руки',
          category: 'pnf',
          targetMuscleOrSkill: 'Приводящие мышцы (аддукторы), медиальные связки колена',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 25,
          sidesRequired: false,
          setupInstructions: 'Разведи ноги максимально широко в стороны, стопы параллельно, руки на полу перед собой. 6с дави пятками в пол на 50%, на выдохе опустись глубже.',
          commonMistakes: ['Завал стоп внутрь', 'Скругление спины', 'Резкое падение в шпагат'],
          strictCoachTip: 'Протокол CRAC: после изометрического давления активируй средние ягодичные, чтобы углубить раскрытие.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m2`,
          name: 'Полушпагат (Half-Split) переходящий в Продольный шпагат PNF',
          category: 'pnf',
          targetMuscleOrSkill: 'Подколенные сухожилия, подвздошно-поясничная мышца',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 25,
          sidesRequired: true,
          setupInstructions: 'Передняя нога прямая на пятке, заднее бедро вертикально. Дави передней пяткой в пол 6с, на выдохе скользи вперед в продольный шпагат.',
          commonMistakes: ['Разворот таза вбок (раскрытый таз)', 'Сгиб переднего колена'],
          strictCoachTip: 'Держи обе подвздошные кости направленными строго вперед.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m3`,
          name: 'Наклон Блинчик в широком седе (Pancake Straddle)',
          category: 'pnf',
          targetMuscleOrSkill: 'Задняя поверхность бедра, аддукторы, пояснично-грудная фасция',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 25,
          sidesRequired: false,
          setupInstructions: 'Сядь с широко разведенными прямыми ногами, носки смотрят вверх. Проверни таз вперед и плавно скользи ладонями по полу вперед.',
          commonMistakes: ['Сгибание коленей', 'Горб в грудном отделе'],
          strictCoachTip: 'Двигайся животом к полу, а не лбом. Поясница сохраняет нейтральный лордоз.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m4`,
          name: 'Поза Лягушки (Frog Pose) с PNF-давлением коленями',
          category: 'pnf',
          targetMuscleOrSkill: 'Глубокие капсульные связки ТБС, гребенчатая мышца',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 25,
          sidesRequired: false,
          setupInstructions: 'Опустись на предплечья, раздвинь колени врозь под углом 90°, стопы наружу. Дави коленями навстречу друг другу 6с, затем смести таз назад.',
          commonMistakes: ['Таз уходит слишком далеко вперед', 'Задержка дыхания'],
          strictCoachTip: 'На выдохе расслабляй пах и подавай таз строго по оси между колен.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m5`,
          name: 'Выпад Ящерицы (Lizard Pose) с погружением предплечий',
          category: 'flexibility',
          targetMuscleOrSkill: 'Сгибатели бедра, капсула ТБС, переднее бедро',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Глубокий выпад вперед, обе руки внутри передней стопы. Опустись на предплечья, прижимая переднее колено к плечу.',
          commonMistakes: ['Колено разваливается наружу без контроля стопы', 'Подъем таза вверх'],
          strictCoachTip: 'Дыши животом, позволяя силе тяжести опускать таз к полу.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-m6`,
          name: 'Баланс в ласточке (Warrior III) с закрытым тазом',
          category: 'balance',
          targetMuscleOrSkill: 'Проприоцепция стопы, ягодичная мышца, баланс таза',
          type: 'timed_hold',
          durationSeconds: 55,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Опора на одну ногу, вытяни тело и заднюю ногу в единую прямую горизонтальную линию "Т" параллельно полу.',
          commonMistakes: ['Разворот таза вверх', 'Потеря контроля стопы'],
          strictCoachTip: 'Большой палец задней ноги направлен строго в пол для контроля закрытого таза.',
          difficulty: 'scale_up',
        },
      ],
      cooldown: [
        {
          id: `w${week}-d1-c1`,
          name: 'Поза Спящего Голубя (Pigeon Pose)',
          category: 'cooldown',
          targetMuscleOrSkill: 'Грушевидная мышца, глубокие ротаторы бедра',
          type: 'timed_hold',
          durationSeconds: 60,
          sets: 2,
          restSeconds: 15,
          sidesRequired: true,
          setupInstructions: 'Согни переднюю голень под углом 45-90°, вытяни заднюю ногу и опусти грудь вперед.',
          commonMistakes: ['Заваливание на бок', 'Напряжение в шее'],
          strictCoachTip: 'Полный выдох. Отдай вес тела полу, полностью сними тонус с ягодицы.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-c2`,
          name: 'Сед 90/90 с медленным перекатом бедер',
          category: 'cooldown',
          targetMuscleOrSkill: 'Капсула тазобедренного сустава, декомпрессия',
          type: 'reps',
          reps: 10,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Сядь на пол, колени под 90°, плавно перекатывай колени из стороны в сторону.',
          commonMistakes: ['Резкие движения', 'Отрыв седалищных бугров без контроля'],
          strictCoachTip: 'Восстанови свободный ток синовиальной жидкости после шпагатной нагрузки.',
          difficulty: 'standard',
        },
      ],
    };
  }

  if (isBalance) {
    return {
      dayNumber: 1,
      title: `Неделя ${week} • День 1: Метавидение & Вестибулярная Устойчивость Высшего Ранга`,
      focus: 'balance',
      estimatedDurationMin: 45,
      completed: false,
      animeTheme: {
        character: BLUE_LOCK_CHARACTERS.isagi.nameRu,
        characterId: 'isagi',
        quote: 'Когда ты закрываешь глаза, поле не исчезает. Твое тело чувствует пространство через каждую точку опоры.',
        quoteSource: 'Blue Lock',
        conceptTitle: 'Metavision Vestibular Core',
        bgImageUrl: BLUE_LOCK_CHARACTERS.isagi.bannerUrl,
        tacticalRationale: `Сфокусировано на пожелании атлета: ${userNotes ? `«${userNotes}» — ` : ''}глубокая проработка вестибулярного ядра, стойки с закрытыми глазами и динамический контроль центра тяжести.`,
      },
      warmup: [
        {
          id: `w${week}-d1-w1`,
          name: 'Подъем на носки & Мобильность стопы',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Ахиллово сухожилие, свод стопы, подошвенные рецепторы',
          type: 'reps',
          reps: 15,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Стопы параллельно, медленный подъем на носки с фиксацией в верхней точке на 2 секунды.',
          commonMistakes: ['Завал стопы наружу', 'Спешка'],
          strictCoachTip: 'Активируй проприорецепторы подошвы — это фундамент метавидения.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-w2`,
          name: 'Вестибулярные повороты головы с фиксацией точки взгляда (VOR)',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Вестибулярный аппарат, глазодвигательные нервы',
          type: 'reps',
          reps: 12,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Зафиксируй взгляд на большом пальце вытянутой руки, поворачивай голову влево и вправо не теряя фокуса.',
          commonMistakes: ['Потеря фокуса на пальце', 'Резкие рывки шеей'],
          strictCoachTip: 'Калибруй связь между внутренним ухом и зрительным анализатором.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-w3`,
          name: 'Суставные вращения в ТБС стоя (CARs)',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Тазобедренные суставы, баланс опорной ноги',
          type: 'reps',
          reps: 10,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: true,
          setupInstructions: 'Балансируя на одной ноге, очерчивай максимальный круг согнутым бедром.',
          commonMistakes: ['Касание пола второй ногой', 'Раскачка плеч'],
          strictCoachTip: 'Опорная нога работает как корни дерева, гася все микроколебания.',
          difficulty: 'standard',
        },
      ],
      mainRoutine: [
        {
          id: `w${week}-d1-m1`,
          name: 'Стойка Аиста на одной ноге с ЗАКРЫТЫМИ глазами',
          category: 'balance',
          targetMuscleOrSkill: 'Проприоцепция, мозжечок, мышцы-стабилизаторы голеностопа',
          type: 'timed_hold',
          durationSeconds: 60,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Подними одно бедро до 90°, стабилизируй тело, затем закрой глаза. Держи равновесие только за счет стопы.',
          commonMistakes: ['Касание пола стопой при малейшем колебании', 'Жесткое зажатие дыхания'],
          strictCoachTip: 'Не борись со стопой — позволь микровибрациям свода стопы удерживать центр массы.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m2`,
          name: 'Ласточка (Warrior III) с динамическим поворотом головы',
          category: 'balance',
          targetMuscleOrSkill: 'Вестибулярный контроль в горизонтальной оси, задняя цепь',
          type: 'timed_hold',
          durationSeconds: 55,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Выйди в ласточку параллельно полу. Медленно поверни взгляд влево, затем прямо, затем вправо.',
          commonMistakes: ['Разворот таза в сторону', 'Сгиб опорного колена больше 15°'],
          strictCoachTip: 'Смещение вестибулярного центра в наклоне учит мозг ориентироваться в нестандартных траекториях.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m3`,
          name: 'Звезда баланса (Star Excursion) — 8 векторов касания',
          category: 'balance',
          targetMuscleOrSkill: 'Динамическая стабильность колена и голеностопа',
          type: 'reps',
          reps: 10,
          durationSeconds: 55,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Стоя на одной ноге, свободно тянись носком второй ноги по компасу вперед, по диагоналям и назад, лишь слегка касаясь пола.',
          commonMistakes: ['Перенос веса на касающуюся ногу', 'Завал опорного колена внутрь'],
          strictCoachTip: '100% веса тела остается на опорной пятке и подушечках пальцев.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m4`,
          name: 'Баланс с касанием пола (Single Leg Reach)',
          category: 'balance',
          targetMuscleOrSkill: 'Задняя поверхность бедра, стабилизаторы таза',
          type: 'reps',
          reps: 10,
          durationSeconds: 50,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Стоя на одной ноге, согнись в тазу и коснись пола перед стопой, задняя нога вытягивается в струну.',
          commonMistakes: ['Скругление спины горбом', 'Падение на пальцы'],
          strictCoachTip: 'Движение выполняется от таза, спина остается ровной доской.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-m5`,
          name: 'PNF-растяжка подколенных лежа с ремнем (CRAC-протокол)',
          category: 'pnf',
          targetMuscleOrSkill: 'Подколенные сухожилия, седалищный нерв',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Лежа на спине, накинь ремень на стопу. 6с изометрического давления пяткой в ремень, на выдохе активное сокращение квадрицепса и дотяжка к себе.',
          commonMistakes: ['Отрыв поясницы от пола', 'Сгибание колена'],
          strictCoachTip: 'Реципрокное торможение: чем сильнее напряжен квадрицепс, тем глубже расслабляется подколенная мышца.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m6`,
          name: 'Поза Танцора (Natarajasana) с фиксацией оси',
          category: 'balance',
          targetMuscleOrSkill: 'Грудной прогиб, переднее бедро, баланс',
          type: 'timed_hold',
          durationSeconds: 55,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Захвати стопу сзади одной рукой. Толкай стопу назад и вверх, наклоняя корпус вперед и удерживая баланс.',
          commonMistakes: ['Разворот таза наружу', 'Колебания в стопе'],
          strictCoachTip: 'Взгляд зафиксирован в одну точку на горизонте.',
          difficulty: 'scale_up',
        },
      ],
      cooldown: [
        {
          id: `w${week}-d1-c1`,
          name: 'Поза Спящего Голубя (Pigeon Pose)',
          category: 'cooldown',
          targetMuscleOrSkill: 'Грушевидная мышца, ягодицы',
          type: 'timed_hold',
          durationSeconds: 60,
          sets: 2,
          restSeconds: 15,
          sidesRequired: true,
          setupInstructions: 'Передняя голень согнута на полу, корпус опущен вперед на предплечья.',
          commonMistakes: ['Напряжение плеч'],
          strictCoachTip: 'Глубокое диафрагмальное дыхание для успокоения нервной системы.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-c2`,
          name: 'Глубокий присед Маласана с длинным выдохом',
          category: 'cooldown',
          targetMuscleOrSkill: 'Голеностоп, тазовое дно, поясница',
          type: 'timed_hold',
          durationSeconds: 60,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Полный присед, пятки на полу, ладони у груди, локти расталкивают колени.',
          commonMistakes: ['Отрыв пяток от пола'],
          strictCoachTip: 'Вытягивай позвоночник вертикально вверх, расслабляя крестец.',
          difficulty: 'standard',
        },
      ],
    };
  }

  if (isKnees) {
    return {
      dayNumber: 1,
      title: `Неделя ${week} • День 1: Броня Связок Колена & Мобильность Голеностопа (Стиль Чигири)`,
      focus: 'hybrid',
      estimatedDurationMin: 45,
      completed: false,
      animeTheme: {
        character: BLUE_LOCK_CHARACTERS.chigiri.nameRu,
        characterId: 'chigiri',
        quote: 'Мое колено больше не слабость. Это бронированный шарнир, способный выдержать любую взрывную нагрузку.',
        quoteSource: 'Blue Lock',
        conceptTitle: 'Knee & Ligament Fortification',
        bgImageUrl: BLUE_LOCK_CHARACTERS.chigiri.bannerUrl,
        tacticalRationale: `Сфокусировано на пожелании атлета: ${userNotes ? `«${userNotes}» — ` : ''}безопасность суставов, исключение сдвиговых нагрузок на связки, укрепление надколенника и голеностопа.`,
      },
      warmup: [
        {
          id: `w${week}-d1-w1`,
          name: 'Дорсифлексия у стены (Ankle Wall Mobilization)',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Ахилл, камбаловидная мышца, передний угол голеностопа',
          type: 'reps',
          reps: 12,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: true,
          setupInstructions: 'Стопа в 10 см от стены. Толкай колено вперед касаясь стены, пятка строго прижата к полу.',
          commonMistakes: ['Отрыв пятки от пола', 'Завал колена внутрь'],
          strictCoachTip: 'Колено двигается строго над вторым пальцем стопы, сохраняя идеальную ось.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-w2`,
          name: 'Подъем на носки с акцентом на большой палец',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Плантарная фасция, икроножные мышцы',
          type: 'reps',
          reps: 15,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Поднимайся на носки, не позволяя стопам заваливаться наружу.',
          commonMistakes: ['Завал на мизинцы'],
          strictCoachTip: 'Дави основанием большого пальца в пол.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-w3`,
          name: 'Кошка-Корова в динамике',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Позвоночник, фасции',
          type: 'reps',
          reps: 12,
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Четвереньки, мягкий вдох-прогиб и выдох-округление.',
          commonMistakes: ['Резкие движения'],
          strictCoachTip: 'Мягкий ритм дыхания.',
          difficulty: 'standard',
        },
      ],
      mainRoutine: [
        {
          id: `w${week}-d1-m1`,
          name: 'Растяжка квадрицепса у стены (Couch Stretch) с подушкой под колено',
          category: 'flexibility',
          targetMuscleOrSkill: 'Прямая мышца бедра, связка надколенника, сгибатели бедра',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Голень у стены, под коленом мягкий мат. Подкрути таз назад, напряги ягодицу и выпрями корпус.',
          commonMistakes: ['Прогиб в пояснице вместо растяжки бедра', 'Острый угол в колене под весом'],
          strictCoachTip: 'Сжатие ягодицы защищает коленный сустав и направляет натяжение точно в брюшко квадрицепса.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m2`,
          name: 'PNF подколенных лежа с ремнем (мягкое колено 5°)',
          category: 'pnf',
          targetMuscleOrSkill: 'Подколенные сухожилия, снятие напряжения с подколенной ямки',
          type: 'timed_hold',
          durationSeconds: 65,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Лежа на спине с ремнем на стопе. Держи колено чуть мягким, дави пяткой 6с, на выдохе подтягивай ногу к себе.',
          commonMistakes: ['Переразгибание колена до щелчка', 'Отрыв таза'],
          strictCoachTip: 'Мягкий микросгиб защищает крестообразные связки от избыточного натяжения.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-m3`,
          name: 'Сед 90/90 с медленным наклоном вперед',
          category: 'joint_prep',
          targetMuscleOrSkill: 'Капсула ТБС, снятие ротационного стресса с колен',
          type: 'timed_hold',
          durationSeconds: 60,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Оба бедра под углом 90°. Наклоняйся вперед прямой грудью к передней голени.',
          commonMistakes: ['Скручивание колена'],
          strictCoachTip: 'Если таз мобилен — колени не испытывают бокового крутящего момента.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-m4`,
          name: 'Стойка Аиста с контролем осевой стабильности колена',
          category: 'balance',
          targetMuscleOrSkill: 'VMO (каплевидная мышца бедра), стабильность коленного сустава',
          type: 'timed_hold',
          durationSeconds: 55,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Стой на одной ноге с микросгибом в колене. Следи, чтобы коленная чашечка смотрела строго на второй палец стопы.',
          commonMistakes: ['Завал колена внутрь (вальгус)'],
          strictCoachTip: 'Включи среднюю ягодичную мышцу — она главный хранитель коленного сустава.',
          difficulty: 'scale_up',
        },
        {
          id: `w${week}-d1-m5`,
          name: 'Выпад Ящерицы (Lizard Pose) с высокой поддержкой',
          category: 'flexibility',
          targetMuscleOrSkill: 'Тазобедренные суставы, капсула бедра',
          type: 'timed_hold',
          durationSeconds: 60,
          sets: 3,
          restSeconds: 20,
          sidesRequired: true,
          setupInstructions: 'Передняя стопа чуть шире, руки на полу. Заднее колено на мягкой опоре.',
          commonMistakes: ['Выход колена за носок с отрывом пятки'],
          strictCoachTip: 'Передняя пятка намертво прижата к полу.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-m6`,
          name: 'Изометрический присед у стены (Wall Sit) под углом 100°',
          category: 'balance',
          targetMuscleOrSkill: 'Сухожилие четырехглавой мышцы, статическая выносливость',
          type: 'timed_hold',
          durationSeconds: 50,
          sets: 3,
          restSeconds: 20,
          sidesRequired: false,
          setupInstructions: 'Прижми спину к стене, угол в коленях безопасный комфортный 100-110°, колени над лодыжками.',
          commonMistakes: ['Колени сведены вместе'],
          strictCoachTip: 'Безопасная изометрия стимулирует выработку коллагена в связках без трения.',
          difficulty: 'scale_up',
        },
      ],
      cooldown: [
        {
          id: `w${week}-d1-c1`,
          name: 'Поза Спящего Голубя (Pigeon Pose)',
          category: 'cooldown',
          targetMuscleOrSkill: 'Ягодицы, ротаторы бедра',
          type: 'timed_hold',
          durationSeconds: 60,
          sets: 2,
          restSeconds: 15,
          sidesRequired: true,
          setupInstructions: 'Мягкий голубь с опорой на предплечья.',
          commonMistakes: [],
          strictCoachTip: 'Полное расслабление.',
          difficulty: 'standard',
        },
        {
          id: `w${week}-d1-c2`,
          name: 'Декомпрессия голеностопа и растяжка стопы сидя на пятках',
          category: 'cooldown',
          targetMuscleOrSkill: 'Подъем стопы, передняя большеберцовая мышца',
          type: 'timed_hold',
          durationSeconds: 50,
          sets: 2,
          restSeconds: 15,
          sidesRequired: false,
          setupInstructions: 'Сядь на пятки, стопы на подъемах. Мягко опирайся руками позади себя.',
          commonMistakes: ['Боль в коленях — снизь амплитуду'],
          strictCoachTip: 'Восстановление эластичности передней цепи голени.',
          difficulty: 'standard',
        },
      ],
    };
  }

  // Default / Balanced Week 2 Day 1: Advanced CRAC protocol with fresh evolved exercises
  return {
    dayNumber: 1,
    title: `Неделя ${week} • День 1: Продвинутая Кинетическая Цепь & CRAC-Протокол Эго`,
    focus: 'hybrid',
    estimatedDurationMin: 45,
    completed: false,
    animeTheme: {
      character: BLUE_LOCK_CHARACTERS.isagi.nameRu,
      characterId: 'isagi',
      quote: 'Вторая неделя — это переход от выживания к доминированию. Мы внедряем метод CRAC.',
      quoteSource: 'Blue Lock',
      conceptTitle: 'Metavision Kinetic Chain',
      bgImageUrl: BLUE_LOCK_CHARACTERS.isagi.bannerUrl,
      tacticalRationale: `Учтены пожелания атлета: «${userNotes || 'Сбалансированная эволюция нагрузки'}». Программа обновлена: добавлены активные реципрокные сокращения и усложнен проприоцептивный контроль.`,
    },
    warmup: [
      {
        id: `w${week}-d1-w1`,
        name: 'Подъем на носки & Мобильность голеностопа',
        category: 'joint_prep',
        targetMuscleOrSkill: 'Ахилл, плантарная фасция',
        type: 'reps',
        reps: 12,
        durationSeconds: 50,
        sets: 2,
        restSeconds: 15,
        sidesRequired: false,
        setupInstructions: 'Подъем на носки с фиксацией на 2 секунды.',
        commonMistakes: ['Завал стоп'],
        strictCoachTip: 'Стабилизируй стопу.',
        difficulty: 'standard',
      },
      {
        id: `w${week}-d1-w2`,
        name: 'Кошка-Корова в динамике',
        category: 'joint_prep',
        targetMuscleOrSkill: 'Позвоночник, фасции спины',
        type: 'reps',
        reps: 12,
        durationSeconds: 50,
        sets: 2,
        restSeconds: 15,
        sidesRequired: false,
        setupInstructions: 'Вдох прогиб, выдох купол спины.',
        commonMistakes: [],
        strictCoachTip: 'Артикуляция позвонков.',
        difficulty: 'standard',
      },
      {
        id: `w${week}-d1-w3`,
        name: 'Суставные вращения в ТБС стоя (CARs)',
        category: 'joint_prep',
        targetMuscleOrSkill: 'Тазобедренные суставы',
        type: 'reps',
        reps: 10,
        durationSeconds: 50,
        sets: 2,
        restSeconds: 15,
        sidesRequired: true,
        setupInstructions: 'Круговые движения бедром стоя на одной ноге.',
        commonMistakes: [],
        strictCoachTip: 'Изоляция в суставе.',
        difficulty: 'standard',
      },
    ],
    mainRoutine: [
      {
        id: `w${week}-d1-m1`,
        name: 'PNF подколенных лежа с ремнем (CRAC-протокол)',
        category: 'pnf',
        targetMuscleOrSkill: 'Подколенные сухожилия, фасция задней цепи',
        type: 'timed_hold',
        durationSeconds: 65,
        sets: 3,
        restSeconds: 20,
        sidesRequired: true,
        setupInstructions: '6с дави пяткой в ремень на 50% усилия. На выдохе напряги переднее бедро (квадрицепс) и подтяни ногу на 3-5 см глубже.',
        commonMistakes: ['Сгибание колена', 'Отрыв таза'],
        strictCoachTip: 'CRAC-эффект: напряжение антагониста рефлекторно выключает спазм подколенной мышцы.',
        difficulty: 'scale_up',
      },
      {
        id: `w${week}-d1-m2`,
        name: 'Глубокий выпад Ящерицы с ротацией грудного отдела',
        category: 'flexibility',
        targetMuscleOrSkill: 'Сгибатели бедра, капсула ТБС, грудная ротация',
        type: 'timed_hold',
        durationSeconds: 65,
        sets: 3,
        restSeconds: 20,
        sidesRequired: true,
        setupInstructions: 'Опустись в выпад ящерицы, подними одноименную руку в потолок, раскрывая грудную клетку.',
        commonMistakes: ['Залом шеи', 'Уход таза вверх'],
        strictCoachTip: 'Синхронизируй раскрытие бедра с раскрытием груди.',
        difficulty: 'scale_up',
      },
      {
        id: `w${week}-d1-m3`,
        name: 'Стойка Аиста на одной ноге (закрытые глаза 65с)',
        category: 'balance',
        targetMuscleOrSkill: 'Вестибулярный анализатор, стопа',
        type: 'timed_hold',
        durationSeconds: 65,
        sets: 3,
        restSeconds: 20,
        sidesRequired: true,
        setupInstructions: 'Колено 90°, закрой глаза, удерживай вертикаль.',
        commonMistakes: ['Падение на пол при микроколебаниях'],
        strictCoachTip: 'Удерживай центр тяжести через три точки стопы.',
        difficulty: 'scale_up',
      },
      {
        id: `w${week}-d1-m4`,
        name: 'Баланс в ласточке (Warrior III) с отведением рук',
        category: 'balance',
        targetMuscleOrSkill: 'Задняя цепь, ромбовидные, баланс',
        type: 'timed_hold',
        durationSeconds: 55,
        sets: 3,
        restSeconds: 20,
        sidesRequired: true,
        setupInstructions: 'Горизонтальная линия Т, руки разведены в стороны как крылья самолета.',
        commonMistakes: ['Перекос таза'],
        strictCoachTip: 'Сжимай лопатки, удерживая грудь открытой.',
        difficulty: 'scale_up',
      },
      {
        id: `w${week}-d1-m5`,
        name: 'Наклон Блинчик в широком седе (Pancake Straddle)',
        category: 'pnf',
        targetMuscleOrSkill: 'Аддукторы, подколенные сухожилия',
        type: 'timed_hold',
        durationSeconds: 65,
        sets: 3,
        restSeconds: 20,
        sidesRequired: false,
        setupInstructions: 'Широкий сед, проворот таза вперед, скользи ладонями вперед.',
        commonMistakes: ['Горб в спине'],
        strictCoachTip: 'Тянись пупком к полу.',
        difficulty: 'scale_up',
      },
      {
        id: `w${week}-d1-m6`,
        name: 'Баланс с касанием пола (Single Leg Reach)',
        category: 'balance',
        targetMuscleOrSkill: 'Проприоцепция, ягодичная мышца',
        type: 'reps',
        reps: 10,
        durationSeconds: 50,
        sets: 3,
        restSeconds: 20,
        sidesRequired: true,
        setupInstructions: 'Стоя на одной ноге, коснись пола перед стопой.',
        commonMistakes: ['Завал колена'],
        strictCoachTip: 'Ровная спина, мягкий коленный сустав.',
        difficulty: 'standard',
      },
    ],
    cooldown: [
      {
        id: `w${week}-d1-c1`,
        name: 'Поза Спящего Голубя (Pigeon Pose)',
        category: 'cooldown',
        targetMuscleOrSkill: 'Грушевидная, ягодицы',
        type: 'timed_hold',
        durationSeconds: 60,
        sets: 2,
        restSeconds: 15,
        sidesRequired: true,
        setupInstructions: 'Грудь на голени, дыхание диафрагмой.',
        commonMistakes: [],
        strictCoachTip: 'Полная декомпрессия.',
        difficulty: 'standard',
      },
      {
        id: `w${week}-d1-c2`,
        name: 'Сед 90/90 с ротацией бедер',
        category: 'cooldown',
        targetMuscleOrSkill: 'Капсула ТБС',
        type: 'reps',
        reps: 10,
        durationSeconds: 50,
        sets: 2,
        restSeconds: 15,
        sidesRequired: false,
        setupInstructions: 'Плавный перекат коленей вправо и влево.',
        commonMistakes: [],
        strictCoachTip: 'Снятие остаточного тонуса.',
        difficulty: 'standard',
      },
    ],
  };
}

/**
 * Offline AI Mesocycle Generator for Subsequent Weeks (Week 2, 3, 4, etc.)
 * Dynamically factors in athlete wishes (userNotes) and target focusArea!
 */
export function generateNextWeekPlanOffline(
  profile: UserProfile,
  previousPlan: WeeklyPlan,
  targetWeekNumber: number,
  focusArea: string = 'balanced',
  userNotes: string = ''
): WeeklyPlan {
  const week = targetWeekNumber || (previousPlan.weekNumber + 1);
  const phaseTitle = PHASES[week] || `Фаза ${week}: Продвинутая Эволюция Эго (Неделя ${week})`;
  const sport = profile.sport || 'Футбол / Атлетика';

  const baseDays = deepClone(DEFAULT_WEEKLY_PLAN.days);

  const evolvedDays: WorkoutDay[] = baseDays.map((rawDay) => {
    const d = rawDay.dayNumber;

    // DAY 1 IS SPECIALIZED ACCORDING TO ATHLETE'S WISHES AND FOCUS AREA
    if (d === 1) {
      const customDay1 = buildCustomizedDay1(week, focusArea, userNotes, profile);
      customDay1.estimatedDurationMin = calculateAccurateWorkoutMinutes(customDay1);
      return customDay1;
    }

    const day = deepClone(rawDay);

    // Evolve remaining days titles and cues per phase and focus
    if (week === 2) {
      day.title = `Неделя 2 • День ${d}: ${rawDay.title.replace(/^День \d+:\s*/, '')} [CRAC-Протокол]`;
    } else if (week === 3) {
      day.title = `Неделя 3 • День ${d}: ${rawDay.title.replace(/^День \d+:\s*/, '')} [Взрывная Амплитуда]`;
    } else {
      day.title = `Неделя ${week} • День ${d}: ${rawDay.title.replace(/^День \d+:\s*/, '')} [Мастерство Эго]`;
    }

    const evolveExerciseList = (list: Exercise[], prefix: string) => {
      return list.map((ex, idx) => {
        const item: Exercise = {
          ...ex,
          id: `w${week}-d${d}-${prefix}${idx + 1}`,
          difficulty: 'scale_up',
        };

        if (item.type === 'timed_hold') {
          const baseDur = item.durationSeconds || 60;
          item.durationSeconds = Math.min(baseDur + (week - 1) * 5, 80);
          item.reps = undefined;

          if (week >= 2 && item.category === 'pnf') {
            item.strictCoachTip = `Фаза ${week}: Используй протокол CRAC. После 6 сек изометрии активно напрягай мышцы-антагонисты на выдохе для углубления растяжки.`;
          } else if (week >= 2 && item.category === 'balance') {
            item.strictCoachTip = `Фаза ${week}: Выполняй стойку с закрытыми глазами, стабилизируя микроколебания только за счет свода стопы.`;
          }
        } else {
          item.type = 'reps';
          const baseReps = item.reps || 10;
          item.reps = Math.min(baseReps + (week - 1) * 2, 20);
          item.durationSeconds = item.durationSeconds || 50;
        }

        return item;
      });
    };

    day.warmup = evolveExerciseList(day.warmup, 'w');
    day.mainRoutine = evolveExerciseList(day.mainRoutine, 'm');
    day.cooldown = evolveExerciseList(day.cooldown, 'c');
    day.completed = false;
    day.estimatedDurationMin = calculateAccurateWorkoutMinutes(day);

    return day;
  });

  const notesText = userNotes ? ` Персональные пожелания учтены: «${userNotes}».` : '';

  return {
    weekNumber: week,
    mesocyclePhase: phaseTitle,
    generatedAt: new Date().toISOString(),
    aiCoachAnalysis: `Анализ перехода на Неделю ${week}: Вектор развития — «${focusArea}».${notesText} Мы повысили время под изометрическим напряжением, внедрили метод реципрокного торможения (CRAC), перестроили упражнения Дня 1 под твои задачи и увеличили точность проприоцептивного контроля для «${sport}».`,
    adaptationNotes: `Каждая тренировка длится полноценные 45 минут. Программа адаптирована под выбранный вектор: упражнения дня 1 прямо реализуют твои пожелания, а последующие дни развивают 3D-мобильность ТБС, баланс Воина III и фасциальные цепи.`,
    days: evolvedDays,
    isCompleted: false,
  };
}
