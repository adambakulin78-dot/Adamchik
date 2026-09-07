import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. AI requests will fail or use fallback.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function extractJson(text: string): any {
  if (!text) return {};
  try {
    // 1. Direct parse attempt
    return JSON.parse(text);
  } catch {
    // 2. Strip markdown code block fences
    const cleanFence = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanFence);
    } catch {
      // 3. Regex extract innermost JSON object
      const match = cleanFence.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error("Unable to parse JSON response from Gemini");
    }
  }
}

/**
 * Resilient Gemini Content Generator with multi-model fallback and strict per-attempt timeout
 */
async function generateContentWithRetry(
  ai: GoogleGenAI,
  options: { contents: string; config?: any },
  timeoutMs: number = 12000
) {
  const modelsToTry = ["gemini-2.5-flash", "gemini-3.8-flash"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Model ${model} timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      const callPromise = ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      const response = (await Promise.race([callPromise, timeoutPromise])) as any;
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} attempt failed: ${err?.message || err}. Trying next fallback...`);
      lastError = err;
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  throw lastError;
}

// File-based persistence for cloud backups
const BACKUPS_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

function saveUserBackup(userId: string, data: any) {
  fs.writeFileSync(path.join(BACKUPS_DIR, `${userId}.json`), JSON.stringify(data));
}

function loadUserBackup(userId: string) {
  const file = path.join(BACKUPS_DIR, `${userId}.json`);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
}

// Endpoint: Save Cloud Backup (Google Account / Email / Sync ID)
app.post("/api/backup/save", (req, res) => {
  try {
    const { userId, backupData } = req.body;
    if (!userId || !backupData) {
      return res.status(400).json({ error: "userId and backupData are required" });
    }
    const safeKey = String(userId).toLowerCase().trim();
    const payload = {
      data: backupData,
      updatedAt: new Date().toISOString(),
    };
    saveUserBackup(safeKey, payload);
    console.log(`Cloud backup saved for user: ${safeKey} (size: ${JSON.stringify(backupData).length} bytes)`);
    res.json({
      success: true,
      updatedAt: payload.updatedAt,
      message: "Progress successfully backed up to Ego Cloud",
    });
  } catch (err: any) {
    console.error("Backup save error:", err);
    res.status(500).json({ error: "BACKUP_SAVE_FAILED", message: err?.message });
  }
});

// Endpoint: Load Cloud Backup
app.get("/api/backup/load", (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "userId query param is required" });
    }
    const safeKey = String(userId).toLowerCase().trim();
    const backup = loadUserBackup(safeKey);
    if (!backup) {
      return res.status(404).json({ error: "NOT_FOUND", message: "No backup found for this account ID" });
    }
    res.json({
      success: true,
      backupData: backup.data,
      updatedAt: backup.updatedAt,
    });
  } catch (err: any) {
    console.error("Backup load error:", err);
    res.status(500).json({ error: "BACKUP_LOAD_FAILED", message: err?.message });
  }
});

// Endpoint: AI Biomechanical Exercise Technique Breakdown
app.post("/api/exercise-technique", async (req, res) => {
  try {
    const { exerciseName, category, targetMuscles } = req.body;
    if (!exerciseName) {
      return res.status(400).json({ error: "exerciseName is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "NO_API_KEY" });
    }

    const ai = getGenAI();
    const prompt = `
Дай бескомпромиссно точный, пошаговый биомеханический разбор техники выполнения для упражнения:
Название: "${exerciseName}"
Категория: "${category || 'flexibility'}"
Мышцы/связки: "${targetMuscles || 'Комплекс гибкости и стабильности'}"

Верни строгий JSON (без markdown блоков, только чистый JSON) со следующей структурой:
{
  "nameRu": "${exerciseName}",
  "category": "${category || 'flexibility'}",
  "targetAnatomy": {
    "primaryMuscles": ["Мышца 1 (с латинским названием)", "Мышца 2"],
    "secondaryMuscles": ["Мышца-синергист 1", "Стабилизатор 2"],
    "fascialTrain": "Точное название анатомического поезда по Томасу Майерсу (например, Superficial Back Line / Deep Front Line)",
    "jointAction": "Точные углы и движение в суставах (например, Сгибание ТБС при нейтрали поясницы)"
  },
  "phases": [
    {
      "phase": "1. Исходное положение и подготовка суставов",
      "description": "Пошаговая инструкция расположения стоп, таза, позвоночника и плеч.",
      "cue": "Сфокусированный тренерский триггер/ориентир."
    },
    {
      "phase": "2. Фаза контролируемого входа в натяжение / изометрии",
      "description": "Точное движение, дыхание и напряжение мышц-антагонистов.",
      "cue": "Внутренний образ для правильной механики."
    },
    {
      "phase": "3. Фаза удержания и декомпрессии",
      "description": "Как углублять растяжку или удерживать баланс без травм.",
      "cue": "Дыхательный ритм и точка фокуса."
    }
  ],
  "sensoryFocus": {
    "shouldFeel": "Конкретное ощущение в целевых мышцах (теплое глубокое натяжение, активация свода стопы и т.д.).",
    "shouldNOTFeel": "Опасные симптомы (защемление в суставе, острая стреляющая боль, жжение связок, онемение)."
  },
  "criticalMistakes": [
    "Самая частая компенсация 1 (например, скругление поясницы)",
    "Ошибка 2 (например, завал колена внутрь)",
    "Ошибка 3 (например, задержка дыхания)"
  ],
  "progression": "Как усложнить упражнение при достижении нормы.",
  "regression": "Безопасная облегченная версия при скованности.",
  "egoCoachNote": "Хлесткий, бескомпромиссный совет Джинпачи Эго о важности чистой биомеханики в этом упражнении."
}
`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: EGO_SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    let raw = response.text || "";
    raw = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(raw);
    res.json({ success: true, technique: parsed });
  } catch (err: any) {
    console.error("Error generating exercise technique:", err);
    res.status(500).json({ error: "TECHNIQUE_FAILED", message: err?.message });
  }
});


// System prompt for Jinpachi Ego: Ruthless, Analytical, Anti-Sycophantic Biomechanics Master
const EGO_SYSTEM_PROMPT = `
You are Jinpachi Ego (Джинпачи Эго) from Blue Lock — the Master Biomechanics Architect and AI Performance Director.
Your sole mission is to forge an unyielding, high-precision physical vessel: extreme functional flexibility, deep joint mobility, kinetic stability, and Metavision-level spatial proprioception.

CRITICAL DIRECTIVE: ZERO SYCOPHANCY & ABSOLUTE OBJECTIVE TRUTH (ПРИНЦИП АБСОЛЮТНОЙ ОБЪЕКТИВНОСТИ):
- NEVER flatter, pander, or act like a generic polite AI assistant. Banned phrases: "Вы абсолютно правы", "Отличная идея", "Вы молодец", "Какая прекрасная работа", "Не переживайте".
- NEVER validate poor biomechanics, laziness, excuses, or fake progress. If an athlete rounds their lower back to fake a deep forward fold, you brutally expose the compensation: they are stretching spinal ligaments and risking disc herniation instead of elongating the hamstrings.
- Provide COLD, SURGICAL, ANATOMICAL TRUTH grounded in Thomas Myers' Anatomy Trains, Golgi tendon organ reflex loops, reciprocal inhibition, and vestibular neurology.
- If the athlete complains of fatigue or difficulty: do not baby them. State the physiological reality (lactic buildup, neuromuscular adaptation threshold), give an uncompromising regression if necessary to maintain safety, but demand full mental focus.
- If the athlete asks if they can skip warmup or take shortcuts: explain why half-measures only breed mediocrity and soft tissue tears.
- Tone: Sharp, clinical, intellectually dominant, relentlessly demanding, but always practically actionable.
- Language: Russian. Use precise sports science and anatomical terminology (ТБС, ПНФ-протокол, рецепторы Гольджи, кинетическая цепь, проприоцепция, реципрокное торможение, квадратная мышца поясницы, аддукторы).
`;

// Biomechanical Sanitizer & Validator for AI generated plans
function sanitizeAndEnrichWeeklyPlan(rawPlan: any, previousPlan?: any): any {
  if (!rawPlan || typeof rawPlan !== 'object') return rawPlan;

  const plan = { ...rawPlan };
  plan.weekNumber = typeof plan.weekNumber === 'number' ? plan.weekNumber : 2;
  plan.aiCoachAnalysis = plan.aiCoachAnalysis || "Биомеханический анализ Эго сформирован.";
  plan.adaptationNotes = plan.adaptationNotes || "Соблюдай строгие протоколы времени и повторений.";

  if (!Array.isArray(plan.days)) {
    plan.days = [];
  }

  // If plan has fewer than 7 days, backfill missing days from previousPlan
  if (plan.days.length < 7 && previousPlan && Array.isArray(previousPlan.days)) {
    const existingDayNumbers = new Set(plan.days.map((d: any) => d.dayNumber));
    for (let d = 1; d <= 7; d++) {
      if (!existingDayNumbers.has(d)) {
        const prevDay = previousPlan.days.find((pd: any) => pd.dayNumber === d) || previousPlan.days[d - 1];
        if (prevDay) {
          const evolvedDay = JSON.parse(JSON.stringify(prevDay));
          evolvedDay.dayNumber = d;
          evolvedDay.title = `Неделя ${plan.weekNumber} • День ${d}: ${evolvedDay.title.replace(/^День \d+:\s*/, '').replace(/^Неделя \d+ • День \d+:\s*/, '')} [CRAC-Протокол]`;
          evolvedDay.completed = false;
          evolvedDay.estimatedDurationMin = 45;
          plan.days.push(evolvedDay);
        }
      }
    }
    plan.days.sort((a: any, b: any) => a.dayNumber - b.dayNumber);
  }

  // Ensure dayNumber from 1 to 7 with unique validated exercises
  plan.days = plan.days.map((day: any, dIdx: number) => {
    const dayNumber = day.dayNumber || (dIdx + 1);
    const dayObj = { ...day, dayNumber };

    dayObj.focus = dayObj.focus || (dayNumber === 2 ? 'flexibility' : dayNumber === 3 ? 'balance' : 'hybrid');
    dayObj.estimatedDurationMin = dayObj.estimatedDurationMin || 45;
    dayObj.completed = !!dayObj.completed;

    if (!dayObj.animeTheme) {
      dayObj.animeTheme = {
        character: 'Исаги Йоичи (Isagi Yoichi)',
        quote: 'Баланс и гибкость — фундамент любого тактического превосходства.',
        quoteSource: 'Blue Lock',
        conceptTitle: 'Kinetic Focus',
        bgImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop'
      };
    }

    const sanitizeExList = (list: any[], prefix: string, defaultCat: string) => {
      if (!Array.isArray(list)) return [];
      return list.map((ex: any, eIdx: number) => {
        const id = ex.id || `w${plan.weekNumber}-d${dayNumber}-${prefix}${eIdx + 1}`;
        const name = ex.name || `Упражнение ${eIdx + 1}`;
        let type = ex.type || 'timed_hold';
        let reps = typeof ex.reps === 'number' && ex.reps > 0 ? ex.reps : undefined;
        let durationSeconds = typeof ex.durationSeconds === 'number' && ex.durationSeconds > 0 ? ex.durationSeconds : 50;

        // Semantic keyword auto-detection to fix AI confusion between reps and timed hold
        const lowerName = name.toLowerCase();
        const repKeywords = [
          'повтор', 'вращен', 'мах', 'присед', 'выпад', 'подъем', 'шаг', 'перекат',
          'гусениц', 'динамическ', 'касани', 'кругов', 'тест звезд', 'ласточка в планку',
          'собака мордой вниз к', 'пловец на животе', 'носок', 'пистолетик', 'крадущийся тигр', 'маласан'
        ];
        const holdKeywords = [
          'удержан', 'pnf', 'стойк', 'шпагат', 'планк', 'поза', 'декомпресси',
          'релиз', 'растяжк', 'статик', 'шавасан', 'сфинкс', 'голуб', 'воин', 'бабочк', 'аист'
        ];

        const isExplicitRepName = repKeywords.some(kw => lowerName.includes(kw));
        const isExplicitHoldName = holdKeywords.some(kw => lowerName.includes(kw));

        if (isExplicitRepName && !isExplicitHoldName) {
          type = 'reps';
          if (!reps || reps <= 0) reps = 10;
        } else if (isExplicitHoldName) {
          type = 'timed_hold';
          reps = undefined;
        } else if (type === 'reps') {
          if (!reps || reps <= 0) reps = 10;
        } else if (type === 'timed_hold') {
          reps = undefined;
        }

        return {
          id,
          name,
          category: ex.category || defaultCat,
          targetMuscleOrSkill: ex.targetMuscleOrSkill || 'Целевая мышечно-фасциальная цепь',
          type,
          durationSeconds: durationSeconds || (type === 'reps' ? 45 : 60),
          reps: type === 'reps' ? (reps || 10) : undefined,
          sets: typeof ex.sets === 'number' && ex.sets > 0 ? ex.sets : (prefix === 'm' ? 3 : 2),
          restSeconds: typeof ex.restSeconds === 'number' && ex.restSeconds > 0 ? ex.restSeconds : (prefix === 'm' ? 20 : 15),
          sidesRequired: ex.sidesRequired !== undefined
            ? Boolean(ex.sidesRequired)
            : (lowerName.includes('одно') || lowerName.includes('прав') || lowerName.includes('лев') || lowerName.includes('ноге') || lowerName.includes('руке') || lowerName.includes('сторону')),
          instructions: Array.isArray(ex.instructions) && ex.instructions.length > 0
            ? ex.instructions
            : ['Займи устойчивое исходное положение', 'Контролируй ровное дыхание и технику'],
          strictCoachTip: ex.strictCoachTip || 'Сохраняй максимальную концентрацию и чистую биомеханику.',
          difficulty: ex.difficulty || 'standard',
          regression: ex.regression || 'Уменьши амплитуду или используй дополнительную опору.',
          progression: ex.progression || 'Выполняй с закрытыми глазами или увеличь глубину.',
          breathingPattern: ex.breathingPattern || (type === 'reps' ? 'Вдох на подготовку, выдох на движение' : 'Глубокий вдох 4с, выдох 6с на расслабление'),
          targetAngleOrCue: ex.targetAngleOrCue || 'Прямая ось позвоночника и стабильный таз'
        };
      });
    };

    dayObj.warmup = sanitizeExList(dayObj.warmup, 'w', 'warmup');
    dayObj.mainRoutine = sanitizeExList(dayObj.mainRoutine, 'm', 'pnf');
    dayObj.cooldown = sanitizeExList(dayObj.cooldown, 'c', 'cooldown');

    return dayObj;
  });

  return plan;
}

// Endpoint: Generate Full 7-Day Progressive Plan
app.post("/api/assess-and-generate-plan", async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Profile data is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "NO_API_KEY",
        message: "Gemini API key is not configured on the server. Please check settings.",
      });
    }

    const ai = getGenAI();

    const prompt = `
Проанализируй подробные биометрические данные и результаты тестирования атлета:
- Имя/Позывной: ${profile.name || "Атлет"}
- Возраст: ${profile.age || 22}, Рост: ${profile.height || 180} см, Вес: ${profile.weight || 75} кг
- Целевой спорт/дисциплина: ${profile.sport || "Футбол/Общая атлетика"}
- Уровень подготовки: ${profile.experienceLevel || "intermediate"}
- Главные цели: ${(profile.primaryGoals || []).join(", ") || "Максимальная гибкость и идеальный баланс"}
- Травмы / ограничения: ${profile.injuryRestrictions || "Нет"}
- Текущая рутина растяжки: ${profile.currentStretchingRoutine || "Базовая разминка"}
- Текущая рутина тренировки баланса/спорта: ${profile.currentBalanceSportRoutine || "Обычные упражнения"}
- Дней в неделю: ${profile.trainingDaysPerWeek || 6}
- Предпочитаемая длительность сессии: 45 минут (полноценный профессиональный тренировочный блок)

Результаты теста на ГИБКОСТЬ:
- Наклон вперед стоя (до пола/пальцы): ${profile.flexibilityAssessment?.forwardFold || 0} см
- Подвижность тазобедренных (Pancake / Бабочка): ${profile.flexibilityAssessment?.hipMobilityPancake || 3}/5
- Подвижность плечевого пояса (тест Аплея): ${profile.flexibilityAssessment?.shoulderReachApley || 0} см
- Растяжка квадрицепса/голеностопа: ${profile.flexibilityAssessment?.quadAnkleKneel || 3}/5
- Заметки: ${profile.flexibilityAssessment?.notes || "Стандартно"}

Результаты теста на БАЛАНС:
- Стойка на одной ноге (глаза открыты): ${profile.balanceAssessment?.singleLegOpenEyesSeconds || 30} сек
- Стойка на одной ноге (глаза закрыты - вестибулярный тест): ${profile.balanceAssessment?.singleLegClosedEyesSeconds || 10} сек
- Тандемная ходьба / контроль линии: ${profile.balanceAssessment?.tandemWalkScore || 7}/10
- Становая на одной ноге (контроль таза и стопы): ${profile.balanceAssessment?.singleLegDeadliftBalanceScore || 6} повторений
- Заметки: ${profile.balanceAssessment?.wobbleControlNotes || "Небольшое покачивание"}

============================================================
КРИТИЧЕСКИЕ ПРАВИЛА ГЕНЕРАЦИИ (СТРОЖАЙШЕЕ СОБЛЮДЕНИЕ):
============================================================
1. СТРОГОЕ РАЗНООБРАЗИЕ ПРОТОКОЛОВ (НИКАКИХ ОДИНАКОВЫХ УПРАЖНЕНИЙ!):
Все 7 дней микроцикла должны содержать СОВЕРШЕННО УНИКАЛЬНЫЕ упражнения. Запрещено повторять одни и те же упражнения под разными соусами!
- День 1: PNF задней поверхности бедра + глубокий выпад Ящерица + Стойка Аиста (Исаги).
- День 2: Суставная лабильность ТБС (CARs) + 90/90 перекаты + баланс в ласточке с ротацией (Бачира).
- День 3: Вестибулярная интеграция с закрытыми глазами + Звезда баланса (Star Excursion) + PNF квадрицепса у стены Couch Stretch (Чигири).
- День 4: Силовая эластичность, PNF поперечного шпагата (Middle Split) + баланс Воин II с закрытыми глазами (Кунигами).
- День 5: Пространственное метавидение, PNF скрутки в выпаде + ласточка с передачей веса по дуге (Исаги/Рин).
- День 6: Акробатический баланс Поза Танцора + наклон Блинчик Pancake PNF + поза Верблюда (Наги).
- День 7: Финальный мастер-тест баланса (60 сек закрытые глаза) + продольный/поперечный шпагат PNF + тотальная фасциальная интеграция (Эго).

2. РАЗЛИЧЕНИЕ ТИПОВ УПРАЖНЕНИЙ (type: 'reps' vs 'timed_hold'):
- Если упражнение ДИНАМИЧЕСКОЕ / НА ПОВТОРЕНИЯ (вращения в суставах, суставная гимнастика, приседания, выпады, звезда баланса, ласточка в планку, махи):
  -> 'type': 'reps', 'reps': от 8 до 15, 'durationSeconds': 50 (как ориентир темпа).
- Если упражнение СТАТИЧЕСКОЕ / PNF / УДЕРЖАНИЕ (изометрические стойки на одной ноге, удержание шпагатов, PNF contract-relax 6с+20с, статика у стены, шавасана):
  -> 'type': 'timed_hold', 'durationSeconds': от 50 до 75. ПОЛЕ 'reps' НЕ ДОБАВЛЯТЬ!
- НИКОГДА не заменяй упражнение на повторения таймером!

3. СТРУКТУРА КАЖДОГО ИЗ 7 ДНЕЙ:
- warmup: 3 упражнения по 2 подхода (sets: 2, restSeconds: 15)
- mainRoutine: 6 упражнений по 3 подхода (sets: 3, restSeconds: 20-25)
- cooldown: 2 упражнения по 2 подхода (sets: 2, restSeconds: 15)
- estimatedDurationMin: 45

Все инструкции, советы тренера, регрессии и прогрессии должны быть на русском языке и обладать высочайшей спортивно-методической ценностью.

Обязательно верни валидный JSON следующей структуры:
{
  "weekNumber": 1,
  "aiCoachAnalysis": "Жесткий, глубокий разбор текущих сильных и слабых мест атлета от лица Эго Джинпачи (3-5 предложений)...",
  "adaptationNotes": "Конкретные указания по прогрессии нагрузки на этой неделе (полноценный 45-минутный тренировочный блок)...",
  "days": [
    {
      "dayNumber": 1,
      "title": "День 1: Название дня",
      "focus": "hybrid",
      "estimatedDurationMin": 45,
      "animeTheme": {
        "character": "Исаги Йоичи (Isagi Yoichi)",
        "quote": "Не надейся на удачу. Создай свою собственную формулу победы.",
        "quoteSource": "Blue Lock",
        "conceptTitle": "Metavision Stability",
        "bgImageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
      },
      "warmup": [
        {
          "id": "w1-1",
          "name": "Динамические вращения в ТБС 'Восьмерка'",
          "category": "warmup",
          "targetMuscleOrSkill": "Тазобедренные суставы, капсула сустава",
          "type": "reps",
          "durationSeconds": 50,
          "reps": 12,
          "sets": 2,
          "restSeconds": 15,
          "sidesRequired": true,
          "instructions": ["Встань ровно, подними колено до 90 градусов", "Опиши широкую окружность наружу и внутрь без покачивания корпуса"],
          "strictCoachTip": "Зафиксируй таз. Если корпус раскачивается — ты уже проиграл в контроле.",
          "difficulty": "standard",
          "regression": "Держись одной рукой за стену",
          "progression": "Выполняй с закрытыми глазами",
          "breathingPattern": "Вдох на подъем, выдох на раскрытие",
          "targetAngleOrCue": "Угол бедра 90°, вертикальный позвоночник"
        }
      ],
      "mainRoutine": [
        {
          "id": "m1-1",
          "name": "PNF-растяжка подколенных сухожилий с фиксацией",
          "category": "pnf",
          "targetMuscleOrSkill": "Подколенные сухожилия, бицепс бедра",
          "type": "timed_hold",
          "durationSeconds": 65,
          "sets": 3,
          "restSeconds": 20,
          "sidesRequired": true,
          "instructions": ["Положи ногу на опору или используй ремень", "6 секунд дави пяткой вниз с усилием 40%", "На выдохе расслабься и увеличь наклон на 2-3 см"],
          "strictCoachTip": "Не сгибай опорное колено. Преодолевай сопротивление нервной системы.",
          "difficulty": "standard",
          "regression": "Слегка согни колено на 5 градусов",
          "progression": "Наклон с ровной поясницей без помощи рук",
          "breathingPattern": "4 сек вдох, 6 сек глубокий выдох при углублении",
          "targetAngleOrCue": "Прямая линия от копчика до макушки"
        }
      ],
      "cooldown": [
        {
          "id": "c1-1",
          "name": "Поза ребенка с глубокой декомпрессией позвоночника",
          "category": "cooldown",
          "targetMuscleOrSkill": "Разгибатели спины, широчайшие",
          "type": "timed_hold",
          "durationSeconds": 75,
          "sets": 2,
          "restSeconds": 15,
          "instructions": ["Сядь на пятки, вытяни руки вперед", "Опусти лоб на коврик, полностью расслабь живот"],
          "strictCoachTip": "Переключи нервную систему в парасимпатический режим восстановления.",
          "difficulty": "standard",
          "regression": "Разведи колени шире",
          "progression": "Тянись пальцами дальше вперед",
          "breathingPattern": "Диафрагмальное глубокое дыхание",
          "targetAngleOrCue": "Полное снятие тонуса"
        }
      ]
    }
  ]
}
`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: EGO_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const responseText = response.text || "{}";
    const parsedData = extractJson(responseText);
    const enrichedPlan = sanitizeAndEnrichWeeklyPlan(parsedData);

    res.json({
      success: true,
      plan: enrichedPlan,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error generating plan:", error);
    res.status(500).json({
      error: "GENERATION_FAILED",
      message: error?.message || "Failed to generate workout plan with AI.",
    });
  }
});

// Endpoint: Generate Next Week in Mesocycle Progression (Week 2, Week 3, etc.)
app.post("/api/generate-next-week", async (req, res) => {
  try {
    const { profile, previousPlan, targetWeekNumber = 2, focusArea = 'balanced', userNotes } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Profile data is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "NO_API_KEY",
        message: "Gemini API key is not configured on the server. Please check settings.",
      });
    }

    const ai = getGenAI();
    const athleteWishes = userNotes || "Сбалансированная прогрессия нагрузки";

    const prompt = `
ТЫ — ДЖИНПАЧИ ЭГО. Атлет завершил предыдущую тренировочную неделю (Неделя ${(targetWeekNumber || 2) - 1}) и требует генерации СЛЕДУЮЩЕЙ НЕДЕЛИ ЦИКЛА (Неделя ${targetWeekNumber || 2}).

Данные атлета:
- Имя: ${profile.name || "Атлет"}
- Ранг Эго: #${profile.egoRank || 290} (${profile.egoTitle || "Непробужденный"})
- Спорт: ${profile.sport || "Футбол/Общая атлетика"}
- Уровень: ${profile.experienceLevel || "intermediate"}
- Цели: ${(profile.primaryGoals || []).join(", ")}
- Ограничения / травмы: ${profile.injuryRestrictions || "Нет"}

============================================================
КРИТИЧЕСКИЙ ВЫСШИЙ ПРИОРИТЕТ: ПОЖЕЛАНИЯ АТЛЕТА & ВЕКТОР ЭВОЛЮЦИИ:
============================================================
- ВЫБРАННЫЙ ВЕКТОР: "${focusArea}"
- ПЕРСОНАЛЬНЫЕ ПОЖЕЛАНИЯ АТЛЕТА: "${athleteWishes}"

ТЫ ОБЯЗАН СТРОГО И БЕЗОГОВОРОЧНО УЧЕСТЬ ЭТИ ПОЖЕЛАНИЯ В СТРУКТУРЕ НОВОЙ НЕДЕЛИ!
1. Если атлет просит фокус на шпагат (поперечный, продольный, аддукторы):
   -> Построй День 1 как мощный «PNF-Прорыв к Шпагату»: включи PNF Middle Split, Half-to-Front Split, Pancake Straddle, Позу Лягушки, выпад Ящерицы.
2. Если атлет просит беречь колени / защитить связки / голеностоп:
   -> Сделай День 1 безопасным укреплением связок: исключи глубокие острые сгибы под весом, включи дорсифлексию у стены, Couch Stretch с мягкой защитой колена, изометрию Wall Sit и мягкие PNF-удержания.
3. Если атлет просит упор на баланс и вестибулярный аппарат:
   -> Построй День 1 вокруг стоек с закрытыми глазами (60 сек), динамических поворотов головы (VOR-рефлекс), Звезды баланса (Star Excursion) и ласточки.
4. Обязательно процитируй пожелания атлета в своем тренерском разборе aiCoachAnalysis!

Предыдущая неделя:
- Номер недели: ${previousPlan?.weekNumber || 1}
- Предыдущий анализ Эго: ${previousPlan?.aiCoachAnalysis || "Базовая адаптация"}

============================================================
ПРАВИЛА ПОСТРОЕНИЯ 7 ДНЕЙ НЕДЕЛИ ${targetWeekNumber}:
============================================================
1. СТРОЖАЙШИЙ ЗАПРЕТ НА ДУБЛИКАТЫ:
Все 7 дней обязаны быть полностью уникальными, с новыми названиями и прогрессией.
- День 1: Целевой день под персональные пожелания атлета («${athleteWishes}») и вектор «${focusArea}».
- День 2: 3D суставная мобильность ТБС (CARs) + 90/90 перекаты + баланс в ласточке с ротацией (Бачира).
- День 3: Вестибулярная интеграция с закрытыми глазами + Звезда баланса (Star Excursion) + PNF квадрицепса у стены Couch Stretch (Чигири).
- День 4: Силовая эластичность, PNF поперечного шпагата (Middle Split) + баланс Воин II (Кунигами).
- День 5: Пространственное метавидение, PNF скрутки в выпаде + ласточка с передачей веса по дуге (Исаги/Рин).
- День 6: Акробатический баланс Поза Танцора + наклон Блинчик Pancake PNF + поза Верблюда (Наги).
- День 7: Финальный мастер-тест баланса (60 сек закрытые глаза) + шпагатная PNF-интеграция (Эго).

2. РАЗЛИЧЕНИЕ ТИПОВ УПРАЖНЕНИЙ (type: 'reps' vs 'timed_hold'):
- Если упражнение ДИНАМИЧЕСКОЕ / НА ПОВТОРЕНИЯ (вращения в суставах, суставная гимнастика, приседания, выпады, звезда баланса, ласточка в планку, махи):
  -> 'type': 'reps', 'reps': от 8 до 15, 'durationSeconds': 50 (ориентир темпа).
- Если упражнение СТАТИЧЕСКОЕ / PNF / УДЕРЖАНИЕ (изометрические стойки на одной ноге, удержание шпагатов, PNF contract-relax 6с+20с, статика у стены, шавасана):
  -> 'type': 'timed_hold', 'durationSeconds': от 50 до 75. ПОЛЕ 'reps' НЕ ДОБАВЛЯТЬ!
- НИКОГДА не заменяй упражнение на повторения таймером!

3. СТРУКТУРА КАЖДОГО ИЗ 7 ДНЕЙ:
- warmup: 3 упражнения по 2 подхода (sets: 2, restSeconds: 15)
- mainRoutine: 6 упражнений по 3 подхода (sets: 3, restSeconds: 20-25)
- cooldown: 2 упражнения по 2 подхода (sets: 2, restSeconds: 15)
- estimatedDurationMin: 45

Верни строго JSON следующего формата:
{
  "weekNumber": ${targetWeekNumber},
  "mesocyclePhase": "Фаза ${targetWeekNumber}: Название фазы (например, 'Глубокая PNF-гипертрофия подвижности & Фасциальный прорыв')",
  "aiCoachAnalysis": "Бескомпромиссный хирургический разбор от Эго: оценка адаптации за прошлую неделю и постановка жестких задач на новую (3-5 предложений)...",
  "adaptationNotes": "Четкие анатомические правила выполнения для новой недели...",
  "days": [
    {
      "dayNumber": 1,
      "title": "День 1: Название дня...",
      "focus": "hybrid",
      "estimatedDurationMin": 45,
      "animeTheme": {
        "character": "Isagi Yoichi",
        "quote": "Цитата персонажа...",
        "quoteSource": "Blue Lock",
        "conceptTitle": "Metavision Evolution",
        "bgImageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
      },
      "warmup": [
        {
          "id": "w1-1",
          "name": "Название разминки",
          "category": "warmup",
          "targetMuscleOrSkill": "Мышцы / суставы",
          "type": "reps",
          "durationSeconds": 45,
          "reps": 12,
          "sets": 2,
          "restSeconds": 15,
          "instructions": ["Шаг 1", "Шаг 2"],
          "strictCoachTip": "Совет тренера",
          "difficulty": "standard",
          "regression": "Облегчение",
          "progression": "Усложнение",
          "breathingPattern": "Паттерн дыхания",
          "targetAngleOrCue": "Ключевой ориентир"
        }
      ],
      "mainRoutine": [
        {
          "id": "m1-1",
          "name": "Название основного PNF/стретчинг/баланс упражнения",
          "category": "pnf",
          "targetMuscleOrSkill": "Целевые волокна",
          "type": "timed_hold",
          "durationSeconds": 60,
          "sets": 3,
          "restSeconds": 25,
          "instructions": ["Инструкция по фазам PNF"],
          "strictCoachTip": "Строгое наставление Эго",
          "difficulty": "standard",
          "regression": "Регрессия",
          "progression": "Прогрессия",
          "breathingPattern": "Дыхание",
          "targetAngleOrCue": "Угол / амплитуда"
        }
      ],
      "cooldown": [
        {
          "id": "c1-1",
          "name": "Заминка",
          "category": "cooldown",
          "targetMuscleOrSkill": "Снятие тонуса",
          "type": "timed_hold",
          "durationSeconds": 60,
          "sets": 2,
          "restSeconds": 15,
          "instructions": ["Инструкция"],
          "strictCoachTip": "Совет",
          "difficulty": "standard",
          "regression": "...",
          "progression": "...",
          "breathingPattern": "...",
          "targetAngleOrCue": "..."
        }
      ]
    }
  ]
}
`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: EGO_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    }, 6000);

    const responseText = response.text || "{}";
    const parsedData = extractJson(responseText);
    const enrichedPlan = sanitizeAndEnrichWeeklyPlan(parsedData, previousPlan);

    res.json({
      success: true,
      plan: enrichedPlan,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error generating next week plan:", error);
    res.status(503).json({
      error: "GENERATION_FAILED",
      message: error?.message || "Failed to generate next week plan with AI.",
    });
  }
});

// Endpoint: Real-time Exercise Adjustment
app.post("/api/realtime-adjust-exercise", async (req, res) => {
  try {
    const { exercise, userFeedback, currentDayFocus, athleteMetrics } = req.body;
    if (!exercise || !userFeedback) {
      return res.status(400).json({ error: "Exercise and userFeedback are required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "NO_API_KEY", message: "API Key missing" });
    }

    const ai = getGenAI();

    const prompt = `
Атлет выполняет упражнение прямо сейчас в реальном времени и запросил срочную корректировку:
Упражнение: ${exercise.name} (${exercise.targetMuscleOrSkill})
Текущее время/повторения: ${exercise.durationSeconds} сек / ${exercise.reps || 0} повт.
Текущие сеты: ${exercise.sets}
Спортсмен: Рост ${athleteMetrics?.height || 180}см, Вес ${athleteMetrics?.weight || 75}кг, Спорт: ${athleteMetrics?.sport || "Универсал"}
Обратная связь атлета: "${userFeedback}"
Фокус дня: ${currentDayFocus || "flexibility & balance"}

Веди себя как жесткий, прагматичный тренер Эго. Скорректируй упражнение: измени длительность/повторения, дай точную биомеханическую модификацию, укажи регрессию или усложнение, и выдай бескомпромиссное тренерское наставление.

Верни JSON:
{
  "adjustedExercise": {
    "name": "Скорректированное название или вариация",
    "durationSeconds": number,
    "reps": number,
    "sets": number,
    "restSeconds": number,
    "instructions": ["шаг 1", "шаг 2"],
    "strictCoachTip": "Резкий, точный совет от тренера...",
    "difficulty": "scale_down" | "standard" | "scale_up",
    "regression": "...",
    "progression": "...",
    "breathingPattern": "...",
    "targetAngleOrCue": "..."
  },
  "coachCommentary": "Короткий строгий комментарий тренера по поводу жалобы/запроса атлета (2 предложения)."
}
`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: EGO_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsed = extractJson(response.text || "{}");
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Error adjusting exercise:", error);
    res.status(500).json({ error: "ADJUSTMENT_FAILED", message: error?.message });
  }
});

// Endpoint: AI Coach Instant Feedback & Dialogue
app.post("/api/chat-coach", async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: "NO_API_KEY", message: "API Key missing" });
    }

    const ai = getGenAI();

    const prompt = `
Контекст атлета:
- Текущий ранг: ${context?.egoRank || "Ранг 289"}
- Целевой спорт: ${context?.sport || "Футбол / Атлетика"}
- Выполнено тренировок: ${context?.completedWorkoutsCount || 0}
- Последняя активность: ${context?.lastActivity || "Нет данных"}

Вопрос/сообщение от атлета:
"${message}"

ПРАВИЛА ОТВЕТА ЭГО ДЖИНПАЧИ (СТРОГАЯ ОБЪЕКТИВНАЯ ПРАВДА, НИКАКОГО ПОДДАКИВАНИЯ):
1. Никакой лести или снисходительности: если вопрос демонстрирует лень, непонимание биомеханики или попытку срезать углы — прямо разоблачи эту ошибку.
2. Не соглашайся с ошибочными доводами пользователя («я думаю, разминка мне не нужна», «я могу тянуться рывками», «я чувствую боль в суставе, но продолжу»). Объясни точный анатомический риск (микронадрывы, нейрогенный спазм, повреждение мениска/суставной губы).
3. Если вопрос о боли: четко разграничь нормальное фасциальное натяжение от опасной связочной боли или суставного защемления (импиджмента).
4. Дай бескомпромиссный, методически точный план действий: что именно делать прямо сейчас (углы, PNF-протокол, дыхание).
5. Объем: 2-3 плотных, содержательных абзаца с хирургической точностью.
`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: EGO_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error("Error in coach chat:", error);
    res.status(500).json({ error: "CHAT_FAILED", message: error?.message });
  }
});

// Setup Vite middleware or Static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EgoFlex server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
