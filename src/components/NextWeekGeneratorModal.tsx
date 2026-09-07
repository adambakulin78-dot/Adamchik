import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  Target,
  Flame,
  CheckCircle2,
  X,
  AlertCircle,
  Eye,
  Award,
} from 'lucide-react';
import { UserProfile, WeeklyPlan } from '../types';
import { soundFx } from '../utils/audio';
import { generateNextWeekPlanOffline } from '../utils/planEvolution';

interface NextWeekGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: WeeklyPlan;
  profile: UserProfile;
  onWeekGenerated: (newPlan: WeeklyPlan) => void;
  isOnline: boolean;
}

export const NextWeekGeneratorModal: React.FC<NextWeekGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  profile,
  onWeekGenerated,
  isOnline,
}) => {
  const nextWeekNumber = (currentPlan.weekNumber || 1) + 1;
  const completedDaysCount = currentPlan.days.filter((d) => d.completed).length;

  const [focusArea, setFocusArea] = useState<string>('balanced');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const focusOptions = [
    {
      id: 'balanced',
      label: 'Сбалансированная эволюция Эго',
      desc: 'Комплексный рост: увеличение времени PNF-удержаний и новые вестибулярные вызовы',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'splits',
      label: 'Акцент: Продольный & Поперечный шпагат',
      desc: 'Глубокая проработка аддукторов, подколенных сухожилий и реципрокное торможение',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'balance_vestibular',
      label: 'Акцент: Метавидение & Вестибулярный баланс',
      desc: 'Сложные стойки на одной ноге, закрытые глаза, динамические повороты головы',
      icon: <Eye className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'knees_ankles',
      label: 'Акцент: Защита связок колена & Голеностоп',
      desc: 'Укрепление связочного аппарата, ахилла и плантарной фасции (стиль Чигири)',
      icon: <Shield className="w-4 h-4 text-rose-400" />,
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    if (soundFx) soundFx.playStartChime();

    const selectedOption = focusOptions.find((o) => o.id === focusArea);
    const combinedNotes = `Выбранный фокус эволюции: ${selectedOption?.label}. Заметки атлета: ${userNotes || 'Готов к повышенной нагрузке'}. Завершено дней в прошлой неделе: ${completedDaysCount}/7.`;

    try {
      setGenerationStep('Анализирую биомеханическую адаптацию прошлой недели...');
      await new Promise((r) => setTimeout(r, 500));

      setGenerationStep('Расчет порога изометрической гипертрофии PNF...');
      await new Promise((r) => setTimeout(r, 500));

      if (isOnline) {
        setGenerationStep('Запрос в нейросеть Джинпачи Эго (Gemini Flash)...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const res = await fetch('/api/generate-next-week', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              profile,
              previousPlan: currentPlan,
              targetWeekNumber: nextWeekNumber,
              focusArea,
              userNotes: userNotes.trim() || combinedNotes,
              combinedNotes,
            }),
          });
          clearTimeout(timeoutId);

          if (!res.ok) {
            throw new Error('SERVER_OFFLINE_OR_KEY_MISSING');
          }

          const data = await res.json();
          if (data.plan && Array.isArray(data.plan.days) && data.plan.days.length > 0) {
            setGenerationStep('Компиляция кинетической программы завершена!');
            await new Promise((r) => setTimeout(r, 300));
            soundFx.playCompletionFanfare();
            onWeekGenerated(data.plan);
            onClose();
            return;
          } else {
            throw new Error('INVALID_PLAN_FORMAT');
          }
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          throw fetchErr;
        }
      } else {
        throw new Error('OFFLINE');
      }
    } catch (err: any) {
      console.warn('API generation fallback to offline evolution engine:', err);
      setGenerationStep('Применение персональной матрицы Эго с учетом пожеланий...');
      await new Promise((r) => setTimeout(r, 400));

      const fallbackPlan = generateNextWeekPlanOffline(
        profile,
        currentPlan,
        nextWeekNumber,
        focusArea,
        userNotes.trim()
      );
      soundFx.playCompletionFanfare();
      onWeekGenerated(fallbackPlan);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const presetWishes = [
    '🔥 Упор на поперечный и продольный шпагат',
    '🛡 Беречь колени / защита связок',
    '👁 Больше баланса с закрытыми глазами',
    '⚡ Максимум CRAC-изометрии и PNF',
    '🧘 Разгрузить поясницу и раскрыть ТБС',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100"
      >
        {/* Holographic corner glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        {!isGenerating && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-700/60 px-3 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Эволюция Программы • Неделя #{nextWeekNumber}
            </span>
            <span className="text-xs text-slate-400">
              Прошлая неделя: {completedDaysCount}/7 дней
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide flex items-center gap-2">
            Генерация Новой Недели Мезоцикла
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            ИИ Эго проанализирует пройденный этап и сформирует 7 новых дней с повышенной сложностью, увеличенной амплитудой и новыми PNF-протоколами.
          </p>
        </div>

        {/* What Changes in Week N */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Прогрессивная Сверхнагрузка в Неделе #{nextWeekNumber}:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>PNF-изометрия:</strong> время удержания до 60-75 сек (было 45с) с методом CRAC.
              </span>
            </div>
            <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Вестибулярный баланс:</strong> упражнения с закрытыми глазами и поворотами головы.
              </span>
            </div>
            <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Шпагатные связки:</strong> углубление угла складки и раскрытия таза на 2-4 см.
              </span>
            </div>
            <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Эго-Анализ:</strong> обновленные цитаты, советы и биомеханический экзамен в 7-й день.
              </span>
            </div>
          </div>
        </div>

        {/* Focus Selector */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Выбери приоритетный вектор развития на эту неделю:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {focusOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                disabled={isGenerating}
                onClick={() => setFocusArea(opt.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  focusArea === opt.id
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-extrabold text-xs mb-1">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Optional User Feedback / Notes */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Самочувствие или пожелания тренеру (необязательно):
          </label>
          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isGenerating) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            disabled={isGenerating}
            placeholder="Например: упор на шпагат, беречь колени, больше баланса..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presetWishes.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isGenerating}
                onClick={() => {
                  setUserNotes((prev) => {
                    if (!prev.trim()) return preset;
                    if (prev.includes(preset)) return prev;
                    return `${prev}, ${preset}`;
                  });
                }}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Generation Loading State */}
        {isGenerating && (
          <div className="p-4 rounded-2xl bg-cyan-950/70 border border-cyan-500/50 mb-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>{generationStep}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-full animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {!isGenerating && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Отмена
            </button>
          )}

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/25 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Сгенерировать Неделю #{nextWeekNumber}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
