import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Play,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  BookOpen,
  Award,
  Smartphone,
  ExternalLink,
  Target,
  PlusCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { WeeklyPlan, WorkoutDay, UserProfile, Exercise } from '../types';
import { getCharacterByTheme } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { NextWeekGeneratorModal } from './NextWeekGeneratorModal';

interface WeeklyPlanViewProps {
  plan: WeeklyPlan;
  allWeeks: WeeklyPlan[];
  activeWeekNumber: number;
  profile: UserProfile;
  onSelectWeek: (weekNum: number) => void;
  onWeekGenerated: (newPlan: WeeklyPlan) => void;
  onStartWorkout: (day: WorkoutDay) => void;
  onRegeneratePlan: () => void;
  onOpenTechnique: (exercise: Exercise) => void;
  onOpenInstall: () => void;
  isOnline: boolean;
}

export const WeeklyPlanView: React.FC<WeeklyPlanViewProps> = ({
  plan,
  allWeeks,
  activeWeekNumber,
  profile,
  onSelectWeek,
  onWeekGenerated,
  onStartWorkout,
  onRegeneratePlan,
  onOpenTechnique,
  onOpenInstall,
  isOnline,
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showNextWeekModal, setShowNextWeekModal] = useState<boolean>(false);

  const completedCount = plan.days.filter((d) => d.completed).length;
  const progressPercent = Math.round((completedCount / 7) * 100);
  const isWeekFullyCompleted = completedCount >= 7;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Multi-Week Mesocycle Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 md:p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 shrink-0 mr-1">
            Мезоцикл:
          </span>
          {allWeeks.map((w) => {
            const wCompleted = w.days.filter((d) => d.completed).length;
            const isCurrent = w.weekNumber === plan.weekNumber;

            return (
              <button
                key={w.weekNumber}
                id={`btn-select-week-${w.weekNumber}`}
                onClick={() => onSelectWeek(w.weekNumber)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>Неделя #{w.weekNumber}</span>
                {wCompleted === 7 ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950' : 'text-emerald-400'}`} />
                ) : (
                  <span className={`text-[10px] font-mono opacity-80 ${isCurrent ? 'text-slate-950' : 'text-slate-400'}`}>
                    {wCompleted}/7
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Next Week Quick Button */}
        <button
          id="btn-open-next-week-modal-header"
          onClick={() => setShowNextWeekModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/40 text-cyan-300 text-xs font-black transition-all shadow-sm shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>+ Сгенерировать Неделю #{allWeeks.length + 1}</span>
        </button>
      </div>

      {/* Top Hero / Luxury Weekly Status Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-925 to-slate-950 border border-slate-700/80 p-6 md:p-8 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(6,182,212,0.25)] group transition-all duration-700 hover:border-cyan-500/50">
        {/* Subtle Cyber Grid & Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none transition-all duration-1000 group-hover:bg-cyan-400/20" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950/90 text-cyan-400 border border-cyan-500/50 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                {plan.mesocyclePhase || `Неделя #${plan.weekNumber} • Цикл Адаптации Связок`}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                {completedCount} из 7 дней завершено
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">
              Программа Развития Гибкости & Баланса Эго
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {plan.aiCoachAnalysis}
            </p>
          </div>

          {/* Quick Actions & PWA Install Banner */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center min-w-[130px] shadow-inner">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Прогресс Цикла</div>
              <div className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">{progressPercent}%</div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                id="btn-install-app-hero"
                onClick={onOpenInstall}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-bold transition-all shadow-md hover:bg-slate-850"
              >
                <Smartphone className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>На телефон</span>
              </button>

              <button
                id="btn-regenerate-ai-plan"
                onClick={onRegeneratePlan}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Перестроить план</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Training Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white tracking-wider flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Расписание Недели #{plan.weekNumber}
          </h2>
          <span className="text-xs text-slate-500">Нажми на день для просмотра упражнений</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {plan.days.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            const totalExCount = day.warmup.length + day.mainRoutine.length + day.cooldown.length;
            const charData = getCharacterByTheme(day.animeTheme.character);

            return (
              <motion.div
                key={day.dayNumber}
                layout
                className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                  day.completed
                    ? 'bg-slate-900/70 border-emerald-800/40'
                    : isExpanded
                    ? 'bg-slate-900/95 border-cyan-500/50 shadow-2xl shadow-cyan-950/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Day Card Header Bar */}
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start md:items-center gap-4">
                    {/* Character Avatar */}
                    <div className="relative shrink-0">
                      <CharacterAvatar
                        character={charData}
                        size="md"
                        statusGlow={day.completed ? 'completed' : isExpanded ? 'active' : 'idle'}
                      />
                      {day.completed && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                          {day.focus === 'flexibility'
                            ? 'Растяжка (PNF)'
                            : day.focus === 'balance'
                            ? 'Баланс & Вестибуляр'
                            : 'Гибридный протокол'}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-bold">
                          {charData.nameRu} ({charData.title})
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-black text-white">{day.title}</h3>
                      <p className="text-xs text-slate-400 italic font-serif">
                        «{day.animeTheme.quote}»
                      </p>
                    </div>
                  </div>

                  {/* Right Side Stats & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {day.estimatedDurationMin} мин
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        {totalExCount} упр.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-start-workout-day-${day.dayNumber}`}
                        onClick={() => onStartWorkout(day)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md ${
                          day.completed
                            ? 'bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{day.completed ? 'Повторить' : 'Начать'}</span>
                      </button>

                      <button
                        id={`btn-toggle-day-${day.dayNumber}`}
                        onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                        className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Exercise List */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 md:p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-5"
                  >
                    {/* Warmup Section */}
                    {day.warmup.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5" />
                          Разминка & Суставная Мобилизация ({day.warmup.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {day.warmup.map((ex) => (
                            <div
                              key={ex.id}
                              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex flex-col justify-between gap-2"
                            >
                              <div>
                                <div className="flex justify-between items-start font-bold text-slate-200 mb-1">
                                  <span className="text-white text-xs">{ex.name}</span>
                                  <span className="text-amber-400 font-mono shrink-0 ml-2">
                                    {ex.reps ? `${ex.reps} повт.` : `${ex.durationSeconds}с`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                  {ex.targetMuscleOrSkill}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {ex.sets} {ex.sets === 1 ? 'сет' : 'сета'}
                                </span>
                                <button
                                  onClick={() => onOpenTechnique(ex)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-900/40 text-[10px] font-bold transition-colors"
                                >
                                  <BookOpen className="w-3 h-3 text-amber-400" />
                                  <span>Техника & Видео</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Main Routine Section */}
                    {day.mainRoutine.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          Основной PNF & Баланс Комплекс ({day.mainRoutine.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {day.mainRoutine.map((ex) => (
                            <div
                              key={ex.id}
                              className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-925 border border-cyan-500/30 text-xs flex flex-col justify-between gap-2.5 shadow-md shadow-cyan-950/20"
                            >
                              <div>
                                <div className="flex justify-between items-start font-extrabold text-slate-100 mb-1">
                                  <span className="text-white text-xs">{ex.name}</span>
                                  <span className="text-cyan-400 font-mono shrink-0 ml-2 font-bold">
                                    {ex.type === 'timed_hold'
                                      ? `${ex.durationSeconds}с удержание`
                                      : `${ex.reps || 12} повт.`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">{ex.targetMuscleOrSkill}</p>

                                {ex.strictCoachTip && (
                                  <div className="mt-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-cyan-300 italic">
                                    «{ex.strictCoachTip}»
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/90 px-2 py-0.5 rounded-md border border-cyan-800/50">
                                  {ex.category.toUpperCase()}
                                </span>
                                <button
                                  onClick={() => onOpenTechnique(ex)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-[10px] font-extrabold transition-all shadow-sm"
                                >
                                  <BookOpen className="w-3 h-3 text-cyan-400" />
                                  <span>Техника & Анатомия</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cooldown Section */}
                    {day.cooldown.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          Заминка & Декомпрессия ({day.cooldown.length})
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {day.cooldown.map((ex) => (
                            <div
                              key={ex.id}
                              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex flex-col justify-between gap-2"
                            >
                              <div>
                                <div className="flex justify-between items-start font-bold text-slate-200 mb-1">
                                  <span className="text-white text-xs">{ex.name}</span>
                                  <span className="text-emerald-400 font-mono shrink-0 ml-2">
                                    {ex.durationSeconds}с
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                  {ex.targetMuscleOrSkill}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {ex.sets} сет
                                </span>
                                <button
                                  onClick={() => onOpenTechnique(ex)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-900/40 text-[10px] font-bold transition-colors"
                                >
                                  <BookOpen className="w-3 h-3 text-emerald-400" />
                                  <span>Техника & Видео</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Next Week Mesocycle Evolution Card (User Requested Trigger) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-500 text-slate-950 px-3 py-0.5 rounded-full font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Эволюция Мезоцикла
              </span>
              {isWeekFullyCompleted && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Неделя #{plan.weekNumber} полностью выполнена!
                </span>
              )}
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">
              {isWeekFullyCompleted
                ? `Готов к Неделе #${plan.weekNumber + 1}? Запусти ИИ Эго!`
                : `Что после Недели #${plan.weekNumber}? Генерация Недели #${plan.weekNumber + 1}`}
            </h3>

            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Нейросеть проанализирует твои текущие метрики и сформирует следующую неделю тренировочного цикла с прогрессивной перегрузкой (увеличенное время изометрии PNF, глубокие шпагаты и вестибулярные вызовы).
            </p>
          </div>

          <button
            id="btn-generate-next-week-banner"
            onClick={() => setShowNextWeekModal(true)}
            className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/30 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Сгенерировать Неделю #{allWeeks.length + 1} с ИИ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal for Next Week Generation */}
      <NextWeekGeneratorModal
        isOpen={showNextWeekModal}
        onClose={() => setShowNextWeekModal(false)}
        currentPlan={plan}
        profile={profile}
        onWeekGenerated={onWeekGenerated}
        isOnline={isOnline}
      />
    </div>
  );
};
