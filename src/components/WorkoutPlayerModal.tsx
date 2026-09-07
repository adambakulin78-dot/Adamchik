import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  Wind,
  Flame,
  Award,
  Send,
  BookOpen,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Shield,
  Zap,
  Eye,
} from 'lucide-react';
import { WorkoutDay, Exercise, UserProfile, ActiveWorkoutSession } from '../types';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { soundFx } from '../utils/audio';
import { getCharacterByTheme } from '../data/characters';
import { ExerciseTechniqueModal } from './ExerciseTechniqueModal';
import { ExercisePoseIllustration } from './ExercisePoseIllustration';
import { CharacterAvatar } from './CharacterAvatar';
import {
  saveActiveWorkoutSession,
  getActiveWorkoutSession,
  clearActiveWorkoutSession,
} from '../utils/storage';
import confetti from 'canvas-confetti';

interface WorkoutPlayerModalProps {
  workoutDay: WorkoutDay;
  profile: UserProfile;
  currentWeek?: number;
  onClose: () => void;
  onCompleteWorkout: (dayNumber: number, durationSeconds: number, feedback?: string) => void;
  isOnline: boolean;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({
  workoutDay,
  profile,
  currentWeek,
  onClose,
  onCompleteWorkout,
  isOnline,
}) => {
  const activeWeek = currentWeek || profile.currentWeek || 1;

  // Flatten all exercises into a unified sequence: Warmup -> Main -> Cooldown
  const [exerciseList, setExerciseList] = useState<Exercise[]>([
    ...workoutDay.warmup,
    ...workoutDay.mainRoutine,
    ...workoutDay.cooldown,
  ]);

  // Check for restored active session
  const initialRestoredSession = useRef<ActiveWorkoutSession | null>(
    getActiveWorkoutSession()
  ).current;

  const isMatchingRestoredSession =
    initialRestoredSession &&
    initialRestoredSession.dayNumber === workoutDay.dayNumber &&
    (initialRestoredSession.weekNumber === activeWeek || !initialRestoredSession.weekNumber);

  const [currentIndex, setCurrentIndex] = useState<number>(
    isMatchingRestoredSession ? Math.min(initialRestoredSession.currentIndex, exerciseList.length - 1) : 0
  );
  const [currentSide, setCurrentSide] = useState<'left' | 'right' | 'both'>(
    isMatchingRestoredSession ? initialRestoredSession.currentSide : 'left'
  );
  const [currentSet, setCurrentSet] = useState<number>(
    isMatchingRestoredSession ? initialRestoredSession.currentSet : 1
  );
  const [isResting, setIsResting] = useState<boolean>(
    isMatchingRestoredSession ? initialRestoredSession.isResting : false
  );
  const [restDuration, setRestDuration] = useState<number>(
    isMatchingRestoredSession ? initialRestoredSession.restDuration : 20
  );
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(
    isMatchingRestoredSession ? initialRestoredSession.totalElapsedTime : 0
  );
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [restoredBanner, setRestoredBanner] = useState<boolean>(!!isMatchingRestoredSession);
  const [showInlinePose, setShowInlinePose] = useState<boolean>(false);

  // Reps Counter State for 'reps' type exercises
  const currentExercise = exerciseList[currentIndex] || exerciseList[0];
  const [completedReps, setCompletedReps] = useState<number>(
    isMatchingRestoredSession && initialRestoredSession.completedReps
      ? initialRestoredSession.completedReps
      : currentExercise?.reps || 10
  );

  // Real-time AI Adjustment state
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [adjustPrompt, setAdjustPrompt] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [adjustSuccessMsg, setAdjustSuccessMsg] = useState<string | null>(null);

  // Exercise technique modal state
  const [techniqueExercise, setTechniqueExercise] = useState<Exercise | null>(null);

  // Sound & Player settings
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [autoStartNext, setAutoStartNext] = useState<boolean>(true);

  const totalExercises = exerciseList.length;
  const mentorChar = getCharacterByTheme(workoutDay.animeTheme.character);

  // Base duration vs initial remaining seconds
  const baseTargetSeconds = isResting
    ? restDuration
    : currentExercise?.durationSeconds || 50;

  const initialRemainingSeconds =
    isMatchingRestoredSession && initialRestoredSession.remainingSeconds !== undefined
      ? initialRestoredSession.remainingSeconds
      : baseTargetSeconds;

  // Background-resilient timer hook
  const {
    remainingSeconds,
    isRunning,
    isPaused,
    start,
    startWithDuration,
    pause,
    resume,
    reset,
    addTime,
    progress,
  } = useWorkoutTimer({
    totalSeconds: baseTargetSeconds,
    initialRemainingSeconds,
    autoStart: true,
    onFinish: () => handleTimerFinished(),
  });

  // Mobile Screen Wake Lock: Keep phone screen ON while working out
  useEffect(() => {
    let wakeLockSentinel: any = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && !isFinished) {
          wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        // Wake lock may not be available on all browsers or in low-battery mode
      }
    };

    requestWakeLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !isFinished) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [isFinished]);

  // Persist session to localStorage on state changes
  useEffect(() => {
    if (!isFinished && currentExercise) {
      saveActiveWorkoutSession({
        weekNumber: activeWeek,
        dayNumber: workoutDay.dayNumber,
        currentIndex,
        currentSide,
        currentSet,
        isResting,
        restDuration,
        remainingSeconds,
        totalElapsedTime,
        completedReps,
        lastUpdatedTimestamp: Date.now(),
      });
    }
  }, [
    currentIndex,
    currentSide,
    currentSet,
    isResting,
    restDuration,
    remainingSeconds,
    totalElapsedTime,
    completedReps,
    isFinished,
    activeWeek,
    workoutDay.dayNumber,
  ]);

  // Handle visibilitychange / pagehide / beforeunload for immediate persistence on app minimize or tab switch
  useEffect(() => {
    const handleImmediateSave = () => {
      if (!isFinished && currentExercise) {
        saveActiveWorkoutSession({
          weekNumber: activeWeek,
          dayNumber: workoutDay.dayNumber,
          currentIndex,
          currentSide,
          currentSet,
          isResting,
          restDuration,
          remainingSeconds,
          totalElapsedTime,
          completedReps,
          lastUpdatedTimestamp: Date.now(),
        });
      }
    };

    window.addEventListener('visibilitychange', handleImmediateSave);
    window.addEventListener('pagehide', handleImmediateSave);
    window.addEventListener('beforeunload', handleImmediateSave);
    return () => {
      window.removeEventListener('visibilitychange', handleImmediateSave);
      window.removeEventListener('pagehide', handleImmediateSave);
      window.removeEventListener('beforeunload', handleImmediateSave);
    };
  }, [
    currentIndex,
    currentSide,
    currentSet,
    isResting,
    restDuration,
    remainingSeconds,
    totalElapsedTime,
    completedReps,
    isFinished,
    activeWeek,
    workoutDay.dayNumber,
    currentExercise,
  ]);

  // Update completedReps whenever current exercise changes
  useEffect(() => {
    if (currentExercise?.type === 'reps') {
      setCompletedReps(currentExercise.reps || 10);
    }
  }, [currentIndex, currentExercise?.id, currentSide, currentSet]);

  // Track total workout time elapsed in seconds
  useEffect(() => {
    let interval: any;
    if (isRunning && !isPaused && !isFinished) {
      interval = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, isFinished]);

  // Voice announce new exercise
  useEffect(() => {
    if (!isResting && currentExercise) {
      const sideText = currentExercise.sidesRequired
        ? currentSide === 'left'
          ? 'Левая сторона.'
          : 'Правая сторона.'
        : '';
      const repOrTime = currentExercise.type === 'reps'
        ? `${currentExercise.reps || 10} повторений.`
        : `${currentExercise.durationSeconds || 50} секунд.`;
      soundFx.speak(`${currentExercise.name}. ${sideText} ${repOrTime}`);
    }
  }, [currentIndex, isResting, currentSide, currentSet]);

  const advanceExerciseFlow = () => {
    soundFx.playBeep(880, 0.2);

    if (currentExercise.sidesRequired && currentSide === 'left') {
      // Switch to Right side
      setCurrentSide('right');
      setIsResting(true);
      setRestDuration(10);
      soundFx.speak('Смена стороны на правую. Отдых 10 секунд.');
      if (autoStartNext) {
        startWithDuration(10);
      } else {
        reset(10);
      }
    } else if (currentSet < currentExercise.sets) {
      // Next set
      setCurrentSet((prev) => prev + 1);
      if (currentExercise.sidesRequired) setCurrentSide('left');
      setIsResting(true);
      const restSec = currentExercise.restSeconds || 15;
      setRestDuration(restSec);
      soundFx.speak(`Сет ${currentSet} завершен. Отдых ${restSec} секунд.`);
      if (autoStartNext) {
        startWithDuration(restSec);
      } else {
        reset(restSec);
      }
    } else {
      // Next exercise in sequence
      if (currentIndex < totalExercises - 1) {
        const nextIdx = currentIndex + 1;
        const nextEx = exerciseList[nextIdx];
        setCurrentIndex(nextIdx);
        setCurrentSet(1);
        setCurrentSide('left');
        setIsResting(true);
        const restSec = currentExercise.restSeconds || 20;
        setRestDuration(restSec);
        soundFx.speak(`Отдых ${restSec} секунд. Следующее: ${nextEx.name}`);
        if (autoStartNext) {
          startWithDuration(restSec);
        } else {
          reset(restSec);
        }
      } else {
        // Workout fully completed!
        finishWorkout();
      }
    }
  };

  const handleTimerFinished = () => {
    if (isResting) {
      // Rest finished, start next exercise or next side immediately
      setIsResting(false);
      const exDur = currentExercise.durationSeconds || 50;
      if (autoStartNext) {
        startWithDuration(exDur);
      } else {
        reset(exDur);
      }
    } else {
      // Only auto-advance for timed_hold isometric exercises
      if (currentExercise?.type === 'timed_hold') {
        advanceExerciseFlow();
      } else {
        soundFx.playBeep(440, 0.1);
      }
    }
  };

  // For Reps-based exercises: User clicks "Done with Set / Reps Completed"
  const handleCompleteRepsSet = () => {
    soundFx.playStartChime();
    advanceExerciseFlow();
  };

  const handleSkipNext = () => {
    if (currentIndex < totalExercises - 1) {
      const nextIdx = currentIndex + 1;
      const nextEx = exerciseList[nextIdx];
      setCurrentIndex(nextIdx);
      setCurrentSet(1);
      setCurrentSide('left');
      setIsResting(false);
      startWithDuration(nextEx.durationSeconds || 50);
    } else {
      finishWorkout();
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    const exDur = currentExercise.durationSeconds || 50;
    startWithDuration(exDur);
  };

  const finishWorkout = () => {
    setIsFinished(true);
    clearActiveWorkoutSession();
    soundFx.playCompletionFanfare();
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    soundFx.speak('Тренировка подчинена! Твое тело вышло на новый уровень адаптации.');
  };

  // Reset entire workout session
  const handleRestartEntireWorkout = () => {
    clearActiveWorkoutSession();
    setCurrentIndex(0);
    setCurrentSide('left');
    setCurrentSet(1);
    setIsResting(false);
    setTotalElapsedTime(0);
    setRestoredBanner(false);
    const firstDur = exerciseList[0]?.durationSeconds || 50;
    startWithDuration(firstDur);
  };

  // Real-time AI adjustment call
  const handleRequestAIAdjustment = async (customPrompt?: string) => {
    const feedback = customPrompt || adjustPrompt;
    if (!feedback) return;

    setIsAdjusting(true);
    setAdjustSuccessMsg(null);

    try {
      if (!isOnline) {
        throw new Error('OFFLINE_MODE');
      }

      const res = await fetch('/api/realtime-adjust-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: currentExercise,
          userFeedback: feedback,
          currentDayFocus: workoutDay.focus,
          athleteMetrics: {
            height: profile.height,
            weight: profile.weight,
            sport: profile.sport,
          },
        }),
      });

      if (!res.ok) throw new Error('Adjustment API error');
      const data = await res.json();

      if (data.adjustedExercise) {
        const updatedList = [...exerciseList];
        updatedList[currentIndex] = {
          ...currentExercise,
          ...data.adjustedExercise,
        };
        setExerciseList(updatedList);
        reset(data.adjustedExercise.durationSeconds || currentExercise.durationSeconds);
        setAdjustSuccessMsg(data.coachCommentary || 'Упражнение успешно скорректировано тренером Эго.');
        soundFx.playStartChime();
        soundFx.speak('Упражнение скорректировано под твое состояние.');
      }
    } catch (e) {
      // Local fallback regression/progression if offline
      const updatedList = [...exerciseList];
      if (feedback.toLowerCase().includes('легко') || feedback.toLowerCase().includes('услож')) {
        updatedList[currentIndex] = {
          ...currentExercise,
          strictCoachTip: `${currentExercise.strictCoachTip} [ПРОГРЕССИЯ]: ${currentExercise.progression}`,
          difficulty: 'scale_up',
        };
        setAdjustSuccessMsg('Активирована прогрессия: увеличена амплитуда и контроль.');
      } else {
        updatedList[currentIndex] = {
          ...currentExercise,
          strictCoachTip: `${currentExercise.strictCoachTip} [РЕГРЕССИЯ]: ${currentExercise.regression}`,
          difficulty: 'scale_down',
        };
        setAdjustSuccessMsg('Активирована регрессия: нагрузка снижена для защиты суставов.');
      }
      setExerciseList(updatedList);
    } finally {
      setIsAdjusting(false);
      setTimeout(() => {
        setShowAdjustModal(false);
        setAdjustSuccessMsg(null);
      }, 2000);
    }
  };

  const minutesFormatted = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secondsFormatted = String(remainingSeconds % 60).padStart(2, '0');
  const nextExercise = currentIndex < totalExercises - 1 ? exerciseList[currentIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Luxury Obsidian Ambient Mesh Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-15"
          style={{ background: isResting ? '#f59e0b' : mentorChar.accentColor || '#06b6d4' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-15"
          style={{ background: isResting ? '#f59e0b' : '#3b82f6' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-[#030712]/75" />
      </div>

      {/* Top Luxury HUD Header */}
      <header className="relative z-10 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <CharacterAvatar character={mentorChar} size="sm" className="shrink-0 ring-2 ring-cyan-500/30" />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono shadow-sm shadow-cyan-950/40">
                {currentIndex + 1} / {totalExercises}
              </span>
              <h2 className="text-xs sm:text-sm font-black text-white truncate max-w-[130px] sm:max-w-xs md:max-w-md tracking-wide">
                {workoutDay.title}
              </h2>
            </div>
            <p className="text-[10px] sm:text-[11px] text-cyan-400 font-semibold tracking-wide flex items-center gap-1 mt-0.5 truncate">
              <Zap className="w-3 h-3 shrink-0" />
              <span className="truncate">{mentorChar.nameRu} • {mentorChar.specialty}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pose Diagram Fast Preview Toggle */}
          <button
            id="btn-player-quick-pose"
            onClick={() => setShowInlinePose(!showInlinePose)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
              showInlinePose
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Показать схему позы"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Поза</span>
          </button>

          {/* Exercise Technique Guide Button */}
          <button
            id="btn-player-open-technique"
            onClick={() => setTechniqueExercise(currentExercise)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs font-bold transition-all shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Техника & Видео</span>
          </button>

          {/* Real-time AI Adjustment Trigger */}
          <button
            id="btn-ai-realtime-adjust"
            onClick={() => setShowAdjustModal(true)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-xs font-bold shadow-md shadow-cyan-950/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">ИИ-Адаптация</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              soundFx.setSoundEnabled(next);
              soundFx.setVoiceEnabled(next);
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Звук и голосовые подсказки"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Close Workout Modal */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Свернуть тренировку"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Restored Session Notification Banner */}
      {restoredBanner && (
        <div className="relative z-10 px-4 py-1.5 bg-cyan-950/90 border-b border-cyan-800/80 text-cyan-300 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Прогресс тренировки восстановлен (Упражнение {currentIndex + 1}/{totalExercises})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestartEntireWorkout}
              className="text-[11px] underline font-bold text-cyan-200 hover:text-white"
            >
              Начать сначала
            </button>
            <button onClick={() => setRestoredBanner(false)} className="text-cyan-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Stage (Adaptive Scrollable Area with Over-scroll Protection) */}
      {!isFinished ? (
        <main className="relative z-10 flex-1 min-h-0 overflow-y-auto max-w-4xl w-full mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-start overscroll-contain">
          <div className="w-full flex flex-col items-center my-auto">
            {/* Status & Category Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-2">
              <span
                className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full border shadow-sm ${
                  isResting
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                    : currentExercise.type === 'reps'
                    ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50'
                    : currentExercise.category === 'pnf'
                    ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isResting
                  ? '🧘 ОТДЫХ & ВОССТАНОВЛЕНИЕ'
                  : currentExercise.type === 'reps'
                  ? `⚡ НА ПОВТОРЕНИЯ • ${currentExercise.category.toUpperCase()}`
                  : `⏱ ИЗОМЕТРИЯ • ${currentExercise.category.toUpperCase()}`}
              </span>

              {currentExercise.sidesRequired && !isResting && (
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/40 shadow-sm">
                  {currentSide === 'left' ? '◀ Левая сторона' : 'Правая сторона ▶'}
                </span>
              )}

              <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 font-mono">
                Сет {currentSet} / {currentExercise.sets}
              </span>
            </div>

            {/* Exercise Title */}
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-white text-center tracking-tight mb-2 sm:mb-3 max-w-2xl leading-tight">
              {isResting ? 'Глубокий вдох & Восстановление' : currentExercise.name}
            </h1>

            {/* Optional Inline Visual Pose Diagram (Dual Phase: Starting Setup & Peak PNF Action) */}
            {showInlinePose && !isResting && (
              <div className="w-full max-w-2xl my-2 animate-in fade-in zoom-in-95 duration-200">
                <ExercisePoseIllustration
                  exerciseId={currentExercise.id}
                  exerciseName={currentExercise.name}
                  category={currentExercise.category}
                  targetMuscle={currentExercise.targetMuscleOrSkill}
                  size="md"
                  phase="both"
                />
              </div>
            )}

            {/* MODE 1: RESTING STATE */}
            {isResting ? (
              <div className="flex flex-col items-center my-1 sm:my-2">
                {/* Amber Recovery Countdown Ring */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="stroke-slate-900" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-amber-400 transition-all duration-300"
                      strokeWidth="6"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 * (1 - progress)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-amber-300 tracking-tight">
                      {minutesFormatted}:{secondsFormatted}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-400/80 uppercase tracking-widest mt-1">
                      Отдых
                    </span>
                  </div>
                </div>

                {/* Next Exercise Preview */}
                {nextExercise && (
                  <div className="mt-2 sm:mt-3 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 max-w-md text-center">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Далее:</span>
                    <span className="font-bold text-white truncate max-w-[180px] sm:max-w-none">{nextExercise.name}</span>
                    <span className="text-cyan-400 font-mono font-bold shrink-0">
                      ({nextExercise.type === 'reps' ? `${nextExercise.reps || 10} повт.` : `${nextExercise.durationSeconds || 50}с`})
                    </span>
                  </div>
                )}

                {/* Skip Rest Button */}
                <button
                  id="btn-skip-rest"
                  onClick={handleSkipRest}
                  className="mt-2 sm:mt-3 px-5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-black uppercase tracking-wider transition-all"
                >
                  Пропустить отдых →
                </button>
              </div>
            ) : currentExercise.type === 'reps' ? (
              /* MODE 2: REPETITIONS-BASED EXERCISE */
              <div className="w-full max-w-md flex flex-col items-center my-1 sm:my-2">
                <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900/95 to-[#0b1324] border border-cyan-500/40 shadow-xl shadow-cyan-950/40 flex flex-col items-center text-center backdrop-blur-xl">
                  <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 mb-1.5 font-mono">
                    <Zap className="w-3.5 h-3.5" />
                    План подхода: {currentExercise.reps || 10} повторений
                  </div>

                  {/* Big Interactive Counter */}
                  <div className="flex items-center justify-center gap-5 sm:gap-6 my-2">
                    <button
                      id="btn-decrement-reps"
                      onClick={() => setCompletedReps((prev) => Math.max(1, prev - 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-transform active:scale-90"
                      title="Уменьшить повторения"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <div className="flex flex-col items-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl font-black font-mono text-white tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        {completedReps}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest mt-0.5">
                        {completedReps === 1 ? 'Повторение' : completedReps < 5 ? 'Повторения' : 'Повторений'}
                      </span>
                    </div>

                    <button
                      id="btn-increment-reps"
                      onClick={() => setCompletedReps((prev) => prev + 1)}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-transform active:scale-90"
                      title="Увеличить повторения"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Primary Action: Complete Set Button */}
                  <button
                    id="btn-complete-reps-set"
                    onClick={handleCompleteRepsSet}
                    className="w-full mt-2 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                    <span>Выполнил подход ({completedReps} повт.)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* MODE 3: TIMED ISOMETRIC HOLD EXERCISE */
              <div className="flex flex-col items-center my-1 sm:my-2">
                {/* Cyan Radial Countdown Ring */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl animate-pulse" />
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" className="stroke-slate-900" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-cyan-400 transition-all duration-300"
                      strokeWidth="6"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 * (1 - progress)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono text-white tracking-tight">
                      {minutesFormatted}:{secondsFormatted}
                    </span>
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest mt-1">
                      Удержание
                    </span>
                  </div>
                </div>

                {/* Breathing Rhythm Indicator */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 my-1.5 shadow-sm">
                  <Wind className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium truncate max-w-[280px]">
                    {currentExercise.breathingPattern || 'Вдох 4 сек • Выдох 6 сек (углубление)'}
                  </span>
                </div>
              </div>
            )}

            {/* Coach Tip Card (Jinpachi Ego Style) */}
            <div className="w-full max-w-xl bg-slate-900/90 border border-cyan-900/40 rounded-2xl p-3 sm:p-4 mt-1 sm:mt-2 backdrop-blur-md shadow-lg shrink-0">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-cyan-300 mb-0.5">
                      Указание Тренера Эго:
                    </p>
                    <button
                      onClick={() => setTechniqueExercise(currentExercise)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-200 underline font-bold flex items-center gap-1 shrink-0"
                    >
                      <span>Атлас & Видео</span>
                      <BookOpen className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-medium line-clamp-3 sm:line-clamp-none">
                    {currentExercise.strictCoachTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* WORKOUT COMPLETED VICTORY SCREEN */
        <main className="relative z-10 flex-1 min-h-0 overflow-y-auto max-w-lg w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-cyan-950 border border-cyan-400 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl shadow-cyan-500/40">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300 animate-bounce" />
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-wider mb-1">
            ТРЕНИРОВКА ПОДЧИНЕНА!
          </h2>
          <p className="text-xs text-slate-400 mb-4 sm:mb-6 max-w-sm">
            «Ты преодолел сопротивление нервной системы. Каждая связка стала эластичнее, каждый рецептор баланса — острее.»
          </p>

          <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Длительность</div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                {Math.floor(totalElapsedTime / 60)}м {totalElapsedTime % 60}с
              </div>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Ego XP</div>
              <div className="text-sm sm:text-base font-extrabold text-amber-400">+250 XP</div>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">Samsung Health</div>
              <div className="text-sm sm:text-base font-extrabold text-cyan-400">Синхрон. ✓</div>
            </div>
          </div>

          <button
            onClick={() => {
              clearActiveWorkoutSession();
              onCompleteWorkout(workoutDay.dayNumber, totalElapsedTime);
              onClose();
            }}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
          >
            Зафиксировать Прогресс и Выйти
          </button>
        </main>
      )}

      {/* Bottom Playback Control Bar (Guaranteed Sticky & Uncropped with Safe Area Padding) */}
      {!isFinished && (
        <footer
          className="sticky bottom-0 z-30 w-full px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-800/90 bg-[#090d16]/98 backdrop-blur-2xl shrink-0 shadow-[0_-8px_24px_rgba(0,0,0,0.7)]"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-2 sm:gap-4">
            {/* Reset current exercise timer */}
            <button
              onClick={() => reset()}
              title="Сбросить таймер"
              className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* +15 Seconds Button */}
            <button
              onClick={() => addTime(15)}
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-[11px] sm:text-xs font-bold transition-colors"
            >
              +15с
            </button>

            {/* Main Play / Pause Button (Always visible and prominent) */}
            <button
              id="btn-timer-play-pause"
              onClick={isRunning && !isPaused ? pause : isPaused && isRunning ? resume : start}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/40 transition-transform active:scale-90 shrink-0 cursor-pointer"
              title={isRunning && !isPaused ? 'Пауза' : 'Старт'}
            >
              {isRunning && !isPaused ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
              )}
            </button>

            {/* -15 Seconds Button */}
            <button
              onClick={() => addTime(-15)}
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] sm:text-xs font-bold transition-colors"
            >
              -15с
            </button>

            {/* Skip to Next Exercise */}
            <button
              id="btn-skip-next-exercise"
              onClick={handleSkipNext}
              title="Следующее упражнение"
              className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </footer>
      )}

      {/* REAL-TIME AI ADJUSTMENT DRAWER */}
      <AnimatePresence>
        {showAdjustModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setShowAdjustModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Корректировка Упражнения в Реальном Времени
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-3 sm:mb-4">
                Что ты чувствуешь прямо сейчас? ИИ-тренер мгновенно адаптирует нагрузку, предложит регрессию или усложнение.
              </p>

              {/* Quick Prompt Chips */}
              <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                {[
                  'Слишком легко (хочу хардкор)',
                  'Тянет связку / спазм в мышце',
                  'Теряю баланс, дрожит стопа',
                  'Хрустит сустав / дискомфорт',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleRequestAIAdjustment(chip)}
                    className="p-2 sm:p-2.5 text-left rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-[11px] sm:text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adjustPrompt}
                  onChange={(e) => setAdjustPrompt(e.target.value)}
                  placeholder="Опиши свои ощущения..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  disabled={isAdjusting || !adjustPrompt}
                  onClick={() => handleRequestAIAdjustment()}
                  className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-50 flex items-center gap-1"
                >
                  {isAdjusting ? 'Анализ...' : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>

              {adjustSuccessMsg && (
                <div className="mt-3 sm:mt-4 p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{adjustSuccessMsg}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Technique Modal */}
      {techniqueExercise && (
        <ExerciseTechniqueModal
          exercise={techniqueExercise}
          onClose={() => setTechniqueExercise(null)}
        />
      )}
    </div>
  );
};
