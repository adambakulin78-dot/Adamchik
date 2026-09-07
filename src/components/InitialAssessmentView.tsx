import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  Dumbbell,
  Target,
} from 'lucide-react';
import { UserProfile, WeeklyPlan } from '../types';
import { soundFx } from '../utils/audio';
import { generatePersonalizedInitialPlan } from '../utils/planEvolution';
import confetti from 'canvas-confetti';

interface InitialAssessmentViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onPlanGenerated: (plan: WeeklyPlan) => void;
  isOnline: boolean;
  onClose?: () => void;
}

export const InitialAssessmentView: React.FC<InitialAssessmentViewProps> = ({
  profile,
  onSaveProfile,
  onPlanGenerated,
  isOnline,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Live stopwatch for the balance test during onboarding
  const [balanceTestRunning, setBalanceTestRunning] = useState(false);
  const [balanceTestSeconds, setBalanceTestSeconds] = useState(0);
  const [balanceEyeMode, setBalanceEyeMode] = useState<'open' | 'closed'>('open');

  useEffect(() => {
    let timer: any;
    if (balanceTestRunning) {
      timer = setInterval(() => {
        setBalanceTestSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [balanceTestRunning]);

  const handleStartBalanceStopwatch = (mode: 'open' | 'closed') => {
    setBalanceEyeMode(mode);
    setBalanceTestSeconds(0);
    setBalanceTestRunning(true);
    soundFx.playStartChime();
  };

  const handleStopBalanceStopwatch = () => {
    setBalanceTestRunning(false);
    soundFx.playRestChime();
    if (balanceEyeMode === 'open') {
      setFormData((prev) => ({
        ...prev,
        balanceAssessment: {
          ...prev.balanceAssessment,
          singleLegOpenEyesSeconds: balanceTestSeconds,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        balanceAssessment: {
          ...prev.balanceAssessment,
          singleLegClosedEyesSeconds: balanceTestSeconds,
        },
      }));
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationPhase('Анализ биометрических углов и метрик спорта...');
    soundFx.playStartChime();

    // Update profile with finished assessment flag
    const updatedProfile: UserProfile = {
      ...formData,
      isInitialAssessmentDone: true,
      egoTitle: 'Пробуждающийся Эгоист (Metavision Initiate)',
    };
    onSaveProfile(updatedProfile);

    try {
      setGenerationPhase(`Калибровка PNF-нагрузок для «${updatedProfile.sport || 'Футбол'}»...`);
      await new Promise((r) => setTimeout(r, 600));

      if (isOnline) {
        setGenerationPhase('Генерация 7-дневной матрицы Эго в Лаборатории ИИ...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
          const res = await fetch('/api/assess-and-generate-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile: updatedProfile }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data.plan && Array.isArray(data.plan.days) && data.plan.days.length > 0) {
              setGenerationPhase('Активация индивидуального плана...');
              onPlanGenerated(data.plan);
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              soundFx.playCompletionFanfare();
              soundFx.speak('Твой тренировочный план сформирован. Покажи, на что ты способен.');
              onClose?.();
              return;
            }
          }
        } catch {
          // Timeout or fetch error -> smoothly proceed to deep personalized engine
        }
      }

      // Seamless Instant Offline/Personalized Biomechanics Engine:
      setGenerationPhase('Компиляция высокоточной персональной программы...');
      await new Promise((r) => setTimeout(r, 400));

      const tailoredPlan = generatePersonalizedInitialPlan(updatedProfile);
      onPlanGenerated(tailoredPlan);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      soundFx.playCompletionFanfare();
      soundFx.speak('Твой тренировочный план сформирован. Покажи, на что ты способен.');
      onClose?.();
    } catch (e: any) {
      console.error('Plan generation fallback:', e);
      const tailoredPlan = generatePersonalizedInitialPlan(updatedProfile);
      onPlanGenerated(tailoredPlan);
      onClose?.();
    } finally {
      setIsGenerating(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Breadcrumb & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-extrabold text-sm">
              {step}/{totalSteps}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
              {step === 1 && '1. Биометрический Профиль & Целевой Спорт'}
              {step === 2 && '2. Тестирование Гибкости & Текущая Рутина'}
              {step === 3 && '3. Тестирование Баланса & Вестибулярный Контроль'}
              {step === 4 && '4. Генерация Программы Эго в Лаборатории ИИ'}
            </h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900"
            >
              Закрыть
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm shadow-cyan-500/50'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: General Bio & Sport Goals */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-start gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-1">
                  Анализ Исходных Данных от Джинпачи Эго
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  «Мне не нужны приблизительные ответы. Если ты скрываешь свои слабые зоны или травмы, ты саботируешь собственное развитие. Отвечай точно.»
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Имя / Позывной
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Исаги Йоичи"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Целевой спорт / Сфера прогресса
                </label>
                <input
                  type="text"
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Футбол, ММА, Бег, Гимнастика, Кроссфит..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Возраст (лет)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 20 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Рост (см)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) || 175 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Вес (кг)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) || 70 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Уровень подготовки
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['beginner', 'intermediate', 'advanced', 'elite'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        formData.experienceLevel === lvl
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl === 'beginner' && 'Новичок'}
                      {lvl === 'intermediate' && 'Средний'}
                      {lvl === 'advanced' && 'Продвинутый'}
                      {lvl === 'elite' && 'Элита (Ego)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Травмы, спазмы или физические ограничения
                </label>
                <input
                  type="text"
                  value={formData.injuryRestrictions}
                  onChange={(e) => setFormData({ ...formData, injuryRestrictions: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Например: скованность в пояснице, хруст в правом колене, нет травм..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Предпочитаемая длительность сессии
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[15, 25, 40].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredSessionDuration: mins })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        formData.preferredSessionDuration === mins
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mins} минут
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all"
              >
                Перейти к Тесту Гибкости
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Flexibility Deep Assessment & Current Stretching Questionnaire */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 md:p-8"
          >
            <div className="mb-6 flex items-start gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-1">
                  Тест 1: Диагностика Амплитуды & Фасциального Натяжения
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Выполни простые проверочные движения прямо сейчас босиком и зафиксируй честные результаты.
                </p>
              </div>
            </div>

            <div className="space-y-6 mb-6">
              {/* Forward fold metric */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">
                    1. Наклон вперед стоя (Ноги прямые)
                  </span>
                  <span className="text-sm font-extrabold text-cyan-400">
                    {formData.flexibilityAssessment.forwardFold > 0 ? `+${formData.flexibilityAssessment.forwardFold}` : formData.flexibilityAssessment.forwardFold} см
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  0 = пальцы касаются носков. Минус = не достаешь до носков (см). Плюс = ладони касаются пола или опускаются ниже стоп.
                </p>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={formData.flexibilityAssessment.forwardFold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      flexibilityAssessment: {
                        ...formData.flexibilityAssessment,
                        forwardFold: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>-20 см (Жесткие связки)</span>
                  <span>0 см (Касание носков)</span>
                  <span>+20 см (Ладони на полу)</span>
                </div>
              </div>

              {/* Hip Pancake rating */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">
                    2. Раскрытие ТБС в наклоне сидя (Pancake / Бабочка)
                  </span>
                  <span className="text-sm font-extrabold text-cyan-400">
                    {formData.flexibilityAssessment.hipMobilityPancake} / 5
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  1 = сильный зажим в паху, спина скруглена. 3 = наклон 45 градусов. 5 = живот лежит на полу.
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          flexibilityAssessment: {
                            ...formData.flexibilityAssessment,
                            hipMobilityPancake: val,
                          },
                        })
                      }
                      className={`py-2 rounded-lg text-xs font-bold border ${
                        formData.flexibilityAssessment.hipMobilityPancake === val
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Stretching Questionnaire */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Твоя текущая рутина растяжки (Опиши подробно, что ты делаешь сейчас)
                </label>
                <textarea
                  rows={3}
                  value={formData.currentStretchingRoutine}
                  onChange={(e) => setFormData({ ...formData, currentStretchingRoutine: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Например: делаю 5 минут махов ногами перед футболом, иногда тяну квадрицепс стоя, шпагатом никогда не занимался..."
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25"
              >
                Перейти к Тесту Баланса
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Balance & Vestibular Test & Current Routine */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 md:p-8"
          >
            <div className="mb-6 flex items-start gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-1">
                  Тест 2: Проприоцепция & Баланс на Одной Ноге
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Используй встроенный секундомер ниже. Встань босиком на одну ногу, подними второе колено и нажми «Старт». Зафиксируй время до касания пола.
                </p>
              </div>
            </div>

            {/* Interactive Stopwatch Widget */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-900/40 mb-6 text-center">
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
                Интерактивный Таймер Баланса ({balanceEyeMode === 'open' ? 'Глаза Открыты' : 'Глаза Закрыты'})
              </div>
              <div className="text-4xl md:text-5xl font-black text-white tracking-wider my-3 font-mono">
                {balanceTestSeconds} <span className="text-lg text-slate-400 font-sans">сек</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                {!balanceTestRunning ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStartBalanceStopwatch('open')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700"
                    >
                      <Play className="w-3.5 h-3.5" /> Тест с открытыми глазами
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartBalanceStopwatch('closed')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-md shadow-cyan-500/30"
                    >
                      <Play className="w-3.5 h-3.5" /> Тест с закрытыми глазами (PRO)
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopBalanceStopwatch}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md shadow-rose-600/30 animate-pulse"
                  >
                    <Pause className="w-4 h-4" /> Стоп (Зафиксировать результат)
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Стойка на 1 ноге (Глаза открыты, сек)
                </label>
                <input
                  type="number"
                  value={formData.balanceAssessment.singleLegOpenEyesSeconds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      balanceAssessment: {
                        ...formData.balanceAssessment,
                        singleLegOpenEyesSeconds: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Стойка на 1 ноге (Глаза закрыты, сек)
                </label>
                <input
                  type="number"
                  value={formData.balanceAssessment.singleLegClosedEyesSeconds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      balanceAssessment: {
                        ...formData.balanceAssessment,
                        singleLegClosedEyesSeconds: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Твоя текущая рутина тренировок баланса / координации в спорте
              </label>
              <textarea
                rows={3}
                value={formData.currentBalanceSportRoutine}
                onChange={(e) => setFormData({ ...formData, currentBalanceSportRoutine: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="Опиши, тренируешь ли ты стопы, проприоцепцию, прыжки на одной ноге, балансировочные платформы или координацию..."
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25"
              >
                Сформировать План с ИИ
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Final Generation Chamber */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden"
          >
            {/* Ambient anime energy glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-xl mx-auto py-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center mx-auto mb-4 glow-cyan">
                <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>

              <h2 className="text-xl md:text-2xl font-black text-white tracking-wider mb-2">
                Калибровка Нейромышечной Программы
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                ИИ-тренер Эго проанализирует твои метрики (наклон{' '}
                <span className="text-cyan-300 font-bold">
                  {formData.flexibilityAssessment.forwardFold} см
                </span>
                , баланс с закрытыми глазами{' '}
                <span className="text-cyan-300 font-bold">
                  {formData.flexibilityAssessment.hipMobilityPancake}/5
                </span>
                , спорт:{' '}
                <span className="text-cyan-300 font-bold">{formData.sport}</span>) и сформирует 7-дневный цикл
                высочайшей точности.
              </p>

              {generationPhase && isGenerating && (
                <div className="mb-6 p-4 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-center gap-3 animate-pulse">
                  <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 animate-spin" />
                  <span className="font-bold tracking-wide">{generationPhase}</span>
                </div>
              )}

              {generationError && !isGenerating && (
                <div className="mb-6 p-4 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs flex items-start gap-3 text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>{generationError}</span>
                </div>
              )}

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGeneratePlan}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-3">
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    {generationPhase || 'Калибровка программы Эго...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Запустить Программу Эго (7 Дней)
                    <Zap className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
