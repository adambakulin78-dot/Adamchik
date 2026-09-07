import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserProfile,
  WeeklyPlan,
  WorkoutDay,
  ProgressLog,
  ChatMessage,
  Exercise,
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadWeeklyPlan,
  saveWeeklyPlan,
  loadAllWeeksPlans,
  saveAllWeeksPlans,
  loadActiveWeekNumber,
  saveActiveWeekNumber,
  loadProgressLogs,
  saveProgressLogs,
  loadChatHistory,
  saveChatHistory,
  saveToCloudServer,
  getActiveWorkoutSession,
  clearActiveWorkoutSession,
  ActiveWorkoutSession,
} from './utils/storage';
import { Zap } from 'lucide-react';
import { getStoredSamsungHealth } from './utils/samsungHealth';
import { soundFx } from './utils/audio';
import { Navbar } from './components/Navbar';
import { InitialAssessmentView } from './components/InitialAssessmentView';
import { WeeklyPlanView } from './components/WeeklyPlanView';
import { AnalyticsView } from './components/AnalyticsView';
import { AICoachChatView } from './components/AICoachChatView';
import { WorkoutPlayerModal } from './components/WorkoutPlayerModal';
import { SamsungHealthModal } from './components/SamsungHealthModal';
import { QuotesNotificationBanner } from './components/QuotesNotificationBanner';
import { AppInstallModal } from './components/AppInstallModal';
import { ExerciseTechniqueModal } from './components/ExerciseTechniqueModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { FullAppBackup } from './utils/storage';
import { ScheduleView } from './components/ScheduleView';
import { requestNotificationPermissions, scheduleTaskNotifications } from './utils/notifications';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(loadWeeklyPlan);
  const [allWeeks, setAllWeeks] = useState<WeeklyPlan[]>(loadAllWeeksPlans);
  const [activeWeekNumber, setActiveWeekNumber] = useState<number>(() => loadActiveWeekNumber() || weeklyPlan.weekNumber || 1);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>(loadProgressLogs);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadChatHistory);

  const [currentTab, setCurrentTab] = useState<'schedule' | 'plan' | 'analytics' | 'coach' | 'assessment'>('schedule');
  const [activeWorkout, setActiveWorkout] = useState<WorkoutDay | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSamsungHealthModal, setShowSamsungHealthModal] = useState<boolean>(false);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [selectedTechniqueExercise, setSelectedTechniqueExercise] = useState<Exercise | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Proactive active workout session recovery state
  const [restorableSession, setRestorableSession] = useState<{
    session: ActiveWorkoutSession;
    workoutDay: WorkoutDay;
  } | null>(null);

  // Check and restore active workout session when app re-opens or regains focus
  useEffect(() => {
    const checkSavedWorkout = () => {
      const saved = getActiveWorkoutSession();
      if (saved && !activeWorkout) {
        const targetWeek = allWeeks.find((w) => w.weekNumber === saved.weekNumber) || weeklyPlan;
        const targetDay = targetWeek?.days.find((d) => d.dayNumber === saved.dayNumber);
        if (targetDay) {
          const ageMs = Date.now() - (saved.lastUpdatedTimestamp || 0);
          if (ageMs < 24 * 60 * 60 * 1000) {
            setRestorableSession({ session: saved, workoutDay: targetDay });
            return;
          }
        }
      }
      setRestorableSession(null);
    };

    checkSavedWorkout();
    window.addEventListener('visibilitychange', checkSavedWorkout);
    window.addEventListener('focus', checkSavedWorkout);
    return () => {
      window.removeEventListener('visibilitychange', checkSavedWorkout);
      window.removeEventListener('focus', checkSavedWorkout);
    };
  }, [allWeeks, weeklyPlan, activeWorkout]);

  // Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveWeeklyPlan(weeklyPlan);
  }, [weeklyPlan]);

  useEffect(() => {
    saveAllWeeksPlans(allWeeks);
  }, [allWeeks]);

  useEffect(() => {
    saveActiveWeekNumber(activeWeekNumber);
  }, [activeWeekNumber]);

  useEffect(() => {
    saveProgressLogs(progressLogs);
  }, [progressLogs]);

  useEffect(() => {
    saveChatHistory(chatMessages);
  }, [chatMessages]);

  // Handle assessment completion & new plan generation
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const handlePlanGenerated = (newPlan: WeeklyPlan) => {
    setWeeklyPlan(newPlan);
    setAllWeeks((prev) => {
      const existingIdx = prev.findIndex((w) => w.weekNumber === newPlan.weekNumber);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newPlan;
        return copy;
      }
      return [...prev, newPlan];
    });
    setActiveWeekNumber(newPlan.weekNumber);
    setCurrentTab('plan');
  };

  // Handle newly generated subsequent week (Week 2, Week 3, etc.)
  const handleWeekGenerated = (newPlan: WeeklyPlan) => {
    setWeeklyPlan(newPlan);
    setAllWeeks((prev) => {
      const existingIdx = prev.findIndex((w) => w.weekNumber === newPlan.weekNumber);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newPlan;
        return copy;
      }
      return [...prev, newPlan].sort((a, b) => a.weekNumber - b.weekNumber);
    });
    setActiveWeekNumber(newPlan.weekNumber);
    setCurrentTab('plan');
  };

  // Select week from multi-week tabs
  const handleSelectWeek = (weekNum: number) => {
    const targetWeek = allWeeks.find((w) => w.weekNumber === weekNum);
    if (targetWeek) {
      setWeeklyPlan(targetWeek);
      setActiveWeekNumber(weekNum);
    }
  };

  // Start workout player
  const handleStartWorkout = (day: WorkoutDay) => {
    setActiveWorkout(day);
    if (soundEnabled) soundFx.playStartChime();
  };

  // Workout completion logic
  const handleCompleteWorkout = (dayNumber: number, durationSeconds: number) => {
    // 1. Mark day completed in weekly plan
    const updatedDays = weeklyPlan.days.map((d) =>
      d.dayNumber === dayNumber
        ? {
            ...d,
            completed: true,
            completedAt: new Date().toISOString(),
            actualDurationSeconds: durationSeconds,
          }
        : d
    );
    const updatedPlan: WeeklyPlan = {
      ...weeklyPlan,
      days: updatedDays,
      isCompleted: updatedDays.every((d) => d.completed),
    };
    setWeeklyPlan(updatedPlan);

    // Update in allWeeks array
    setAllWeeks((prev) =>
      prev.map((w) => (w.weekNumber === updatedPlan.weekNumber ? updatedPlan : w))
    );

    // 2. Add XP and update Ego Rank if threshold crossed
    const xpGained = 250;
    const nextXp = profile.egoXp + xpGained;
    // Rank goes down (from 299 towards 1) as you become better
    const rankProgression = Math.max(1, 300 - Math.floor(nextXp / 300));
    let newTitle = profile.egoTitle;
    if (rankProgression <= 50) {
      newTitle = 'Мировой Класс Эгоиста (World Class Flow)';
    } else if (rankProgression <= 150) {
      newTitle = 'Мастер Метавидения & Кинетики (Metavision Master)';
    } else if (rankProgression <= 250) {
      newTitle = 'Пробуждающийся Хищник (Awakening Egoist)';
    }

    const updatedProfile: UserProfile = {
      ...profile,
      egoXp: nextXp,
      egoRank: rankProgression,
      egoTitle: newTitle,
      samsungHealthData: {
        ...profile.samsungHealthData,
        dailySteps: profile.samsungHealthData.dailySteps + 600,
        activeCalories: profile.samsungHealthData.activeCalories + 120,
        lastSyncTime: new Date().toISOString(),
      },
    };
    setProfile(updatedProfile);

    // 3. Log progress
    const newLog: ProgressLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weekNumber: weeklyPlan.weekNumber,
      dayNumber,
      workoutTitle: `${weeklyPlan.days.find((d) => d.dayNumber === dayNumber)?.title || 'Тренировка'} (Неделя ${weeklyPlan.weekNumber})`,
      durationSeconds,
      forwardFoldCm: profile.flexibilityAssessment.forwardFold,
      singleLegClosedEyesSec: profile.balanceAssessment.singleLegClosedEyesSeconds,
      hipPancakeScore: profile.flexibilityAssessment.hipMobilityPancake,
      perceivedDifficulty: 7,
      egoXpGained: xpGained,
      samsungHealthSynced: true,
      feedbackGiven: 'Протокол зафиксирован. Фасциальная цепь получила необходимый импульс адаптации.',
    };
    setProgressLogs((prev) => [newLog, ...prev]);

    // 4. Auto-sync to cloud if Google account is configured
    const userEmail = localStorage.getItem('egoflex_google_account');
    if (userEmail && userEmail.includes('@')) {
      saveToCloudServer(userEmail).catch((err) => console.warn('Background auto-sync failed', err));
    }

    // 5. Sound fanfare
    if (soundEnabled) {
      soundFx.playCompletionFanfare();
    }
  };

  // AI Coach Chat integration
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      if (!isOnline) {
        throw new Error('OFFLINE');
      }

      const res = await fetch('/api/chat-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            egoRank: `Ранг #${profile.egoRank}`,
            sport: profile.sport,
            completedWorkoutsCount: weeklyPlan.days.filter((d) => d.completed).length,
          },
        }),
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();

      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: data.reply || 'Тренируйся с полной самоотдачей. Контролируй дыхание и фасциальное натяжение.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, coachMsg]);
      soundFx.speak(coachMsg.text.slice(0, 140));
    } catch (e) {
      // Smart offline biomechanical coach response
      let offlineReply =
        'Слушай сюда. Чтобы связки адаптировались без травмы, используй только медленное изометрическое напряжение (5 секунд с силой 30%) и углубляй наклон строго на длинном выдохе (6-8 секунд). В балансе фокус держи на своде стопы и ровном тазе.';
      if (text.toLowerCase().includes('боль') || text.toLowerCase().includes('хруст')) {
        offlineReply =
          'Различай типы ощущений: мышечное жжение и фасциальное натяжение — это норма адаптации. Острая точечная суставная боль или защемление — сигнал немедленно снизить амплитуду и сделать регрессию.';
      } else if (text.toLowerCase().includes('шпагат')) {
        offlineReply =
          'Шпагат строится не силой воли, а снятием миотатического рефлекса нервной системы. Занимайся каждый день по 15-20 минут, чередуя полушпагат с позой ящерицы и позой лягушки.';
      }

      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: offlineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, coachMsg]);
    }
  };

  useEffect(() => {
    // Initialize notifications and schedule them
    const initNotifications = async () => {
      try {
        await requestNotificationPermissions();
        await scheduleTaskNotifications();
      } catch (err) {
        console.warn('Notifications setup failed, possibly not running on a mobile device:', err);
      }
    };
    initNotifications();
  }, []);

  // Samsung Health refresh sync
  const handleSyncSamsungHealth = async () => {
    const freshData = getStoredSamsungHealth();
    setProfile((prev) => ({
      ...prev,
      samsungHealthData: {
        ...freshData,
        lastSyncTime: new Date().toISOString(),
      },
    }));
  };

  const handleDataRestored = (backup: FullAppBackup) => {
    if (backup.profile) setProfile(backup.profile);
    if (backup.activePlan) setWeeklyPlan(backup.activePlan);
    if (backup.allWeeks) setAllWeeks(backup.allWeeks);
    if (backup.activeWeekNumber) setActiveWeekNumber(backup.activeWeekNumber);
    if (backup.progressLogs) setProgressLogs(backup.progressLogs);
    if (backup.chatHistory) setChatMessages(backup.chatHistory);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Fixed Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={profile}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenSamsungHealth={() => setShowSamsungHealthModal(true)}
        onOpenCloudSync={() => setShowCloudSyncModal(true)}
        onOpenInstall={() => setShowInstallModal(true)}
        isOnline={isOnline}
      />

      {/* Motivational Quotes Notification Banner */}
      <QuotesNotificationBanner />

      {/* Main Tab Screens with Smooth Animation */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {currentTab === 'schedule' && (
            <motion.div
              key="tab-schedule"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ScheduleView />
            </motion.div>
          )}

          {currentTab === 'plan' && (
            <motion.div
              key="tab-plan"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <WeeklyPlanView
                plan={weeklyPlan}
                allWeeks={allWeeks}
                activeWeekNumber={activeWeekNumber}
                profile={profile}
                onSelectWeek={handleSelectWeek}
                onWeekGenerated={handleWeekGenerated}
                onStartWorkout={handleStartWorkout}
                onRegeneratePlan={() => setCurrentTab('assessment')}
                onOpenTechnique={(ex) => setSelectedTechniqueExercise(ex)}
                onOpenInstall={() => setShowInstallModal(true)}
                isOnline={isOnline}
              />
            </motion.div>
          )}

          {currentTab === 'analytics' && (
            <motion.div
              key="tab-analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AnalyticsView
                logs={progressLogs}
                profile={profile}
                onOpenAssessment={() => setCurrentTab('assessment')}
                onOpenSamsungHealth={() => setShowSamsungHealthModal(true)}
              />
            </motion.div>
          )}

          {currentTab === 'coach' && (
            <motion.div
              key="tab-coach"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AICoachChatView
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                profile={profile}
                isOnline={isOnline}
              />
            </motion.div>
          )}

          {currentTab === 'assessment' && (
            <motion.div
              key="tab-assessment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <InitialAssessmentView
                profile={profile}
                onSaveProfile={handleSaveProfile}
                onPlanGenerated={handlePlanGenerated}
                isOnline={isOnline}
                onClose={() => setCurrentTab('plan')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Proactive In-Progress Workout Recovery Banner if app was minimized or closed */}
      {restorableSession && !activeWorkout && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto p-3.5 bg-slate-900/95 border border-cyan-500/80 rounded-2xl shadow-2xl shadow-cyan-950/80 flex items-center justify-between gap-3 text-xs backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-white truncate">Тренировка на паузе</div>
              <div className="text-[11px] text-cyan-300/90 truncate">
                День {restorableSession.session.dayNumber} • Упр. {restorableSession.session.currentIndex + 1}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                clearActiveWorkoutSession();
                setRestorableSession(null);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-[11px] transition-colors"
            >
              Сброс
            </button>
            <button
              onClick={() => {
                setActiveWeekNumber(restorableSession.session.weekNumber);
                setActiveWorkout(restorableSession.workoutDay);
                setRestorableSession(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              Продолжить
            </button>
          </div>
        </div>
      )}

      {/* Active Workout Player Modal */}
      {activeWorkout && (
        <WorkoutPlayerModal
          workoutDay={activeWorkout}
          profile={profile}
          currentWeek={activeWeekNumber}
          onClose={() => setActiveWorkout(null)}
          onCompleteWorkout={handleCompleteWorkout}
          isOnline={isOnline}
        />
      )}

      {/* Samsung Health Dashboard Modal */}
      {showSamsungHealthModal && (
        <SamsungHealthModal
          data={profile.samsungHealthData}
          onSync={handleSyncSamsungHealth}
          onClose={() => setShowSamsungHealthModal(false)}
        />
      )}

      {/* Cloud Sync / Google Backup Modal */}
      {showCloudSyncModal && (
        <CloudSyncModal
          onClose={() => setShowCloudSyncModal(false)}
          onDataRestored={(backup) => {
            handleDataRestored(backup);
            setShowCloudSyncModal(false);
          }}
        />
      )}

      {/* App Download / Install Modal */}
      {showInstallModal && (
        <AppInstallModal
          onClose={() => setShowInstallModal(false)}
          deferredPrompt={deferredPrompt}
          onInstallSuccess={() => {
            setDeferredPrompt(null);
            soundFx.speak('Приложение EgoFlex успешно установлено на устройство!');
          }}
          profile={profile}
          weeklyPlan={weeklyPlan}
        />
      )}

      {/* Exercise Biomechanics & Technique Modal */}
      {selectedTechniqueExercise && (
        <ExerciseTechniqueModal
          exercise={selectedTechniqueExercise}
          onClose={() => setSelectedTechniqueExercise(null)}
        />
      )}
    </div>
  );
}
