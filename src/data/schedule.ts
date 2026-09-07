import { DailySchedule, ScheduleTask } from '../types_schedule';

const generateId = () => Math.random().toString(36).substr(2, 9);

const commonMorningRoutine: ScheduleTask[] = [
  {
    id: generateId(),
    title: 'Дорога до колледжа (1 час)',
    type: 'commute',
    startTime: '07:30',
    endTime: '08:30',
    isCompleted: false,
    strictCoachMessage: 'Выдвигайся. 1 час дороги — это время для подкаста по психологии или испанского. Не теряй ни минуты.'
  },
  {
    id: generateId(),
    title: 'Пары в колледже',
    type: 'college',
    startTime: '08:30',
    endTime: '13:30', // ОРИЕНТИРОВОЧНО, можно изменять
    isCompleted: false,
    strictCoachMessage: 'Учеба. Впитывай информацию как губка, фокусируйся, не сиди в телефоне.'
  }
];

const dailyStudyStretching: ScheduleTask[] = [
  {
    id: generateId(),
    title: 'Изучение Испанского',
    type: 'study_spanish',
    startTime: '19:00',
    endTime: '20:00',
    isCompleted: false,
    strictCoachMessage: '1 час испанского. El dolor es temporal, la gloria es eterna. Учи.'
  },
  {
    id: generateId(),
    title: 'Изучение Психологии',
    type: 'study_psychology',
    startTime: '20:00',
    endTime: '21:00',
    isCompleted: false,
    strictCoachMessage: '1 час психологии. Пойми себя, чтобы понимать мир и контролировать свой разум.'
  },
  {
    id: generateId(),
    title: 'Растяжка + Баланс',
    type: 'stretching',
    startTime: '21:30',
    endTime: '22:00',
    isCompleted: false,
    strictCoachMessage: 'Растяжка и баланс. Без этого твои мышцы станут деревянными, а суставы заклинит. Тянись.'
  }
];

export const weeklySchedule: DailySchedule[] = [
  {
    dayOfWeek: 1, // Понедельник
    dayName: 'Понедельник',
    tasks: [
      ...commonMorningRoutine,
      {
        id: generateId(),
        title: 'Тренажерный зал: ВЕРХ',
        type: 'gym',
        startTime: '15:00',
        endTime: '16:30',
        isCompleted: false,
        strictCoachMessage: 'ВЕРХ. Работай до отказа, никаких поблажек, спина и грудь должны гореть.'
      },
      ...dailyStudyStretching
    ]
  },
  {
    dayOfWeek: 2, // Вторник
    dayName: 'Вторник',
    tasks: [
      ...commonMorningRoutine,
      {
        id: generateId(),
        title: 'Спринты + Мастерство мяча',
        type: 'sprints',
        startTime: '16:00',
        endTime: '17:30',
        isCompleted: false,
        strictCoachMessage: 'Спринты и мяч. Взрывная скорость. Рви газон, контроль мяча на максимуме!'
      },
      ...dailyStudyStretching
    ]
  },
  {
    dayOfWeek: 3, // Среда
    dayName: 'Среда',
    tasks: [
      ...commonMorningRoutine,
      {
        id: generateId(),
        title: 'Тренажерный зал: НИЗ',
        type: 'gym',
        startTime: '15:00',
        endTime: '16:30',
        isCompleted: false,
        strictCoachMessage: 'НИЗ. День ног. Никто не любит день ног, но именно он делает из тебя зверя. Приседай.'
      },
      {
        id: generateId(),
        title: 'Бокс (с другом)',
        type: 'boxing',
        startTime: '17:30',
        endTime: '19:00',
        isCompleted: false,
        strictCoachMessage: 'Бокс. Держи защиту, бей хлестко. Не дай другу себя избить.'
      },
      ...dailyStudyStretching.filter(t => t.type !== 'study_spanish' && t.type !== 'study_psychology') // Убираем учебу, чтобы не перегрузить день? Оставим растяжку
    ]
  },
  {
    dayOfWeek: 4, // Четверг
    dayName: 'Четверг',
    tasks: [
      ...commonMorningRoutine,
      {
        id: generateId(),
        title: 'Тренажерный зал: ВЕРХ',
        type: 'gym',
        startTime: '15:00',
        endTime: '16:30',
        isCompleted: false,
        strictCoachMessage: 'ВЕРХ. Снова. Заставь мышцы расти. Дисциплина - это делать то, что ненавидишь, так, будто любишь.'
      },
      ...dailyStudyStretching
    ]
  },
  {
    dayOfWeek: 5, // Пятница
    dayName: 'Пятница',
    tasks: [
      ...commonMorningRoutine,
      {
        id: generateId(),
        title: 'Тренажерный зал: НИЗ',
        type: 'gym',
        startTime: '15:00',
        endTime: '16:30',
        isCompleted: false,
        strictCoachMessage: 'НИЗ. Последняя тяжелая силовая на неделе. Выложись полностью.'
      },
      ...dailyStudyStretching
    ]
  },
  {
    dayOfWeek: 6, // Суббота
    dayName: 'Суббота',
    tasks: [
      {
        id: generateId(),
        title: 'Бокс (с другом)',
        type: 'boxing',
        startTime: '12:00',
        endTime: '13:30',
        isCompleted: false,
        strictCoachMessage: 'Бокс в выходной. Пока другие спят, ты становишься опаснее. Работай на реакцию.'
      },
      ...dailyStudyStretching
    ]
  },
  {
    dayOfWeek: 0, // Воскресенье
    dayName: 'Воскресенье',
    tasks: [
      {
        id: generateId(),
        title: 'Отдых и восстановление',
        type: 'other',
        startTime: '10:00',
        endTime: '18:00',
        isCompleted: false,
        strictCoachMessage: 'Мышцы растут, когда ты отдыхаешь. Спи, ешь, но не расслабляйся ментально.'
      },
      ...dailyStudyStretching
    ]
  }
];
