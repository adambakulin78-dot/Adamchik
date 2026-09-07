import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Youtube,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Dna,
  Zap,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  Sparkles,
  Wind,
  Target,
  RefreshCw,
} from 'lucide-react';
import { Exercise } from '../types';
import { getExerciseTechnique, ExerciseTechniqueGuide } from '../data/exerciseTechniques';
import { soundFx } from '../utils/audio';
import { ExercisePoseIllustration } from './ExercisePoseIllustration';

interface ExerciseTechniqueModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseTechniqueModal: React.FC<ExerciseTechniqueModalProps> = ({
  exercise,
  onClose,
}) => {
  if (!exercise) return null;

  const baseGuide = getExerciseTechnique(exercise.id, exercise.name, exercise);
  const [aiGuide, setAiGuide] = useState<ExerciseTechniqueGuide | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const guide = aiGuide || baseGuide;

  const handleRequestAiDeepAnalysis = async () => {
    setIsAiLoading(true);
    setAiError(null);
    soundFx.playStartChime();
    try {
      const res = await fetch('/api/exercise-technique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: exercise.name,
          category: exercise.category,
          targetMuscles: exercise.targetMuscleOrSkill,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.technique) {
        setAiGuide({
          ...baseGuide,
          ...data.technique,
          id: exercise.id,
          youtubeUrl: baseGuide.youtubeUrl,
        });
        soundFx.playCompletionFanfare();
      }
    } catch (e: any) {
      setAiError('Не удалось загрузить онлайн-анализ, используется локальный анатомический атлас.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-cyan-950/60 overflow-hidden my-auto"
        >
          {/* Header Gradient */}
          <div className="relative p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-2.5 py-0.5 rounded-md">
                  Анатомический Атлас & Техника
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {exercise.id}</span>
                {aiGuide && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-purple-950 text-purple-400 border border-purple-800/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Biomechanics
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-wide">
                {exercise.name}
              </h2>
              <p className="text-xs text-cyan-300/90 font-medium">
                {guide.targetAnatomy.fascialTrain} • {guide.targetAnatomy.jointAction}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm text-slate-300">
            {/* Visual Pose Illustration Diagram (Dual Phase: Phase 1 Setup & Phase 2 Peak Action) */}
            <ExercisePoseIllustration
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              category={exercise.category}
              targetMuscle={exercise.targetMuscleOrSkill}
              size="lg"
              phase="both"
            />

            {/* Direct Video Tutorial Link Button + AI Deep Scan Trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-900/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 shrink-0">
                    <Youtube className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs">Видео на YouTube</h4>
                    <p className="text-[11px] text-red-300/80">Эталонная кинематика</p>
                  </div>
                </div>

                <a
                  href={guide.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs tracking-wider transition-all shadow-md shadow-red-600/25 shrink-0"
                >
                  <span>Смотреть</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs">ИИ-Разбор Эго</h4>
                    <p className="text-[11px] text-cyan-300/80">Хирургическая точность</p>
                  </div>
                </div>

                <button
                  onClick={handleRequestAiDeepAnalysis}
                  disabled={isAiLoading}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs tracking-wider transition-all shadow-md shadow-cyan-500/20 shrink-0"
                >
                  {isAiLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Сканировать</span>
                      <Zap className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {aiError && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-medium">
                {aiError}
              </div>
            )}

            {/* Target Anatomy Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Dna className="w-4 h-4" />
                Целевая Анатомия и Мышечные Группы
              </div>
              <div className="flex flex-wrap gap-1.5">
                {guide.targetAnatomy.primaryMuscles.map((muscle, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300"
                  >
                    ★ {muscle}
                  </span>
                ))}
                {guide.targetAnatomy.secondaryMuscles.map((muscle, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Specific Real-Time Exercise Direct Cues */}
            {exercise.targetAngleOrCue && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase">
                    <Target className="w-3.5 h-3.5" />
                    Ключевой фокус & Угол
                  </div>
                  <p className="text-xs text-slate-300">{exercise.targetAngleOrCue}</p>
                </div>
                {exercise.breathingPattern && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-900/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase">
                      <Wind className="w-3.5 h-3.5" />
                      Паттерн дыхания
                    </div>
                    <p className="text-xs text-slate-300">{exercise.breathingPattern}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step-by-Step Biomechanical Phases */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Пошаговый протокол выполнения
              </h3>
              <div className="space-y-3">
                {guide.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="font-extrabold text-white text-xs tracking-wide text-cyan-400">
                      {phase.phase}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{phase.description}</p>
                    <div className="text-[11px] text-cyan-300/90 font-mono bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-900/30">
                      💡 Тренерский ориентир: {phase.cue}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensory Focus (Should feel vs should NOT feel) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Что ты должен чувствовать
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {guide.sensoryFocus.shouldFeel}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-400 uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  Красный флаг (Чего быть НЕ должно)
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {guide.sensoryFocus.shouldNOTFeel}
                </p>
              </div>
            </div>

            {/* Critical Mistakes List */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-900/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                Критические ошибки биомеханики
              </div>
              <ul className="space-y-1.5">
                {guide.criticalMistakes.map((mistake, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Regression & Progression */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                  Регрессия (Если зажаты связки)
                </span>
                <p className="text-slate-300">{guide.regression}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-900/40">
                <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] block mb-1">
                  Прогрессия (Для элитного уровня)
                </span>
                <p className="text-slate-300">{guide.progression}</p>
              </div>
            </div>

            {/* Ego Jinpachi Ruthless Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-800/60 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-0.5">
                  Бескомпромиссная установка Эго
                </div>
                <p className="text-xs text-slate-200 italic font-medium">
                  «{guide.egoCoachNote}»
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider transition-all shadow-lg shadow-cyan-500/20"
            >
              Понятно, готов к практике
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
