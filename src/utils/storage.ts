import { UserProfile, WeeklyPlan, ProgressLog, ChatMessage, ActiveWorkoutSession } from '../types';
export type { ActiveWorkoutSession };
import { DEFAULT_WEEKLY_PLAN } from '../data/defaultPlan';
import { getStoredSamsungHealth } from './samsungHealth';
import { calculateAccurateWorkoutMinutes, scaleWorkoutToTargetMinutes } from './planDuration';

const KEYS = {
  PROFILE: 'egoflex_user_profile',
  ACTIVE_PLAN: 'egoflex_active_plan',
  ALL_WEEKS: 'egoflex_all_weeks_history',
  ACTIVE_WEEK_NUM: 'egoflex_active_week_num',
  PROGRESS_LOGS: 'egoflex_progress_logs',
  CHAT_MESSAGES: 'egoflex_chat_history',
  SETTINGS: 'egoflex_app_settings',
  ACTIVE_SESSION: 'egoflex_active_workout_session',
};

const CURRENT_STORAGE_VERSION = 'egoflex_v3_distinct_curriculum';
const SCHEMA_KEY = 'egoflex_storage_version';

function checkAndMigrateStorage(): void {
  try {
    const currentVer = localStorage.getItem(SCHEMA_KEY);
    if (currentVer !== CURRENT_STORAGE_VERSION) {
      // Clear out outdated weekly plans so fresh distinct 7-day curriculum is loaded
      localStorage.removeItem(KEYS.ACTIVE_PLAN);
      localStorage.removeItem(KEYS.ALL_WEEKS);
      localStorage.setItem(SCHEMA_KEY, CURRENT_STORAGE_VERSION);
    }
  } catch (e) {
    console.error('Storage migration error', e);
  }
}

// Run migration check on module load
if (typeof window !== 'undefined') {
  checkAndMigrateStorage();
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Исаги (Атлет)',
  age: 22,
  height: 178,
  weight: 73,
  sport: 'Футбол / Единоборства',
  experienceLevel: 'intermediate',
  primaryGoals: ['Продольный и поперечный шпагат', 'Идеальный баланс на одной ноге с закрытыми глазами', 'Мобильность ТБС и голеностопа'],
  injuryRestrictions: 'Небольшая скованность в пояснице при долгой нагрузке',
  currentStretchingRoutine: '5 минут обычной разминки перед тренировкой, иногда наклоны к носкам',
  currentBalanceSportRoutine: 'Базовые упражнения с мячом и приседания, целенаправленно баланс не тренирую',
  trainingDaysPerWeek: 6,
  preferredSessionDuration: 25,
  flexibilityAssessment: {
    forwardFold: 2, // 2 см до пола пальцами
    hipMobilityPancake: 3,
    shoulderReachApley: -3,
    quadAnkleKneel: 3,
    sideSplitSpread: 3,
    spineThoracicRotation: 3,
    notes: 'Тугоподвижные подколенные сухожилия и жесткий грудной отдел',
  },
  balanceAssessment: {
    singleLegOpenEyesSeconds: 35,
    singleLegClosedEyesSeconds: 12,
    tandemWalkScore: 7,
    singleLegDeadliftBalanceScore: 6,
    wobbleControlNotes: 'Стопа сильно вибрирует при закрытии глаз на 10-й секунде',
  },
  egoRank: 299,
  egoXp: 120,
  egoTitle: 'Непробужденный Эгоист (Rank 299)',
  samsungHealthConnected: true,
  samsungHealthData: getStoredSamsungHealth(),
  isInitialAssessmentDone: false,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

function calibratePlan(plan: WeeklyPlan): WeeklyPlan {
  if (!plan || !Array.isArray(plan.days)) return plan;
  const upgradedDays = plan.days.map((day) => {
    const actualMin = calculateAccurateWorkoutMinutes(day);
    if (actualMin < 35) {
      const scaled = scaleWorkoutToTargetMinutes(day, 45);
      scaled.estimatedDurationMin = calculateAccurateWorkoutMinutes(scaled);
      return scaled;
    }
    return {
      ...day,
      estimatedDurationMin: actualMin,
    };
  });
  return {
    ...plan,
    days: upgradedDays,
  };
}

export function loadWeeklyPlan(): WeeklyPlan {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_PLAN);
    if (raw) {
      const parsed = JSON.parse(raw);
      return calibratePlan(parsed);
    }
  } catch (e) {
    console.error('Failed to load plan', e);
  }
  return calibratePlan(DEFAULT_WEEKLY_PLAN);
}

export function saveWeeklyPlan(plan: WeeklyPlan): void {
  try {
    localStorage.setItem(KEYS.ACTIVE_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save plan', e);
  }
}

export function loadAllWeeksPlans(): WeeklyPlan[] {
  try {
    const raw = localStorage.getItem(KEYS.ALL_WEEKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => calibratePlan(p));
      }
    }
  } catch (e) {
    console.error('Failed to load all weeks', e);
  }
  return [loadWeeklyPlan()];
}

export function saveAllWeeksPlans(weeks: WeeklyPlan[]): void {
  try {
    localStorage.setItem(KEYS.ALL_WEEKS, JSON.stringify(weeks));
  } catch (e) {
    console.error('Failed to save all weeks', e);
  }
}

export function loadActiveWeekNumber(): number {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_WEEK_NUM);
    if (raw) {
      return parseInt(raw, 10) || 1;
    }
  } catch (e) {
    console.error('Failed to load active week number', e);
  }
  return 1;
}

export function saveActiveWeekNumber(weekNum: number): void {
  try {
    localStorage.setItem(KEYS.ACTIVE_WEEK_NUM, String(weekNum));
  } catch (e) {
    console.error('Failed to save active week number', e);
  }
}

export function loadProgressLogs(): ProgressLog[] {
  try {
    const raw = localStorage.getItem(KEYS.PROGRESS_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load logs', e);
  }

  // Pre-seed 3 past days of initial history so graphs look rich from the start
  const mockInitialLogs: ProgressLog[] = [
    {
      id: 'log-prev-1',
      date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      weekNumber: 1,
      dayNumber: 1,
      workoutTitle: 'Тестовый замер и вводный баланс',
      durationSeconds: 1200,
      forwardFoldCm: 1.0,
      singleLegClosedEyesSec: 10,
      hipPancakeScore: 3,
      perceivedDifficulty: 7,
      egoXpGained: 150,
      samsungHealthSynced: true,
    },
    {
      id: 'log-prev-2',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      weekNumber: 1,
      dayNumber: 2,
      workoutTitle: 'Мобильность ТБС и проприоцепция',
      durationSeconds: 1440,
      forwardFoldCm: 2.2,
      singleLegClosedEyesSec: 13,
      hipPancakeScore: 3,
      perceivedDifficulty: 8,
      egoXpGained: 180,
      samsungHealthSynced: true,
    },
    {
      id: 'log-prev-3',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      weekNumber: 1,
      dayNumber: 3,
      workoutTitle: 'Вестибулярный якорь Саэ',
      durationSeconds: 1500,
      forwardFoldCm: 3.5,
      singleLegClosedEyesSec: 16,
      hipPancakeScore: 4,
      perceivedDifficulty: 8,
      egoXpGained: 210,
      samsungHealthSynced: true,
    },
  ];

  return mockInitialLogs;
}

export function saveProgressLogs(logs: ProgressLog[]): void {
  try {
    localStorage.setItem(KEYS.PROGRESS_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(KEYS.CHAT_MESSAGES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load chat', e);
  }

  return [
    {
      id: 'init-msg-1',
      sender: 'coach',
      text: 'Добро пожаловать в систему EgoFlex. Я — твой бескомпромиссный ИИ-тренер. Забудь о расслабленных потягушках. Здесь мы выковываем абсолютный кинетический контроль, невероятную эластичность связок и железный баланс. Задай любой вопрос или начни сегодняшнюю сессию.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];
}

export function saveChatHistory(msgs: ChatMessage[]): void {
  try {
    localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(msgs));
  } catch (e) {
    console.error('Failed to save chat', e);
  }
}

export interface FullAppBackup {
  version: number;
  timestamp: string;
  userEmail?: string;
  profile: UserProfile;
  activePlan: WeeklyPlan;
  allWeeks: WeeklyPlan[];
  activeWeekNumber: number;
  progressLogs: ProgressLog[];
  chatHistory: ChatMessage[];
}

export function exportFullAppSnapshot(): FullAppBackup {
  return {
    version: 2,
    timestamp: new Date().toISOString(),
    profile: loadUserProfile(),
    activePlan: loadWeeklyPlan(),
    allWeeks: loadAllWeeksPlans(),
    activeWeekNumber: loadActiveWeekNumber(),
    progressLogs: loadProgressLogs(),
    chatHistory: loadChatHistory(),
  };
}

export function restoreFullAppSnapshot(backup: FullAppBackup): boolean {
  try {
    if (!backup || !backup.profile) return false;
    saveUserProfile(backup.profile);
    if (backup.activePlan) saveWeeklyPlan(backup.activePlan);
    if (backup.allWeeks) saveAllWeeksPlans(backup.allWeeks);
    if (backup.activeWeekNumber) saveActiveWeekNumber(backup.activeWeekNumber);
    if (backup.progressLogs) saveProgressLogs(backup.progressLogs);
    if (backup.chatHistory) saveChatHistory(backup.chatHistory);
    return true;
  } catch (err) {
    console.error('Failed to restore snapshot', err);
    return false;
  }
}

export async function saveToCloudServer(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const payload = {
      userEmail: email,
      ...exportFullAppSnapshot(),
    };
    const res = await fetch('/api/backup/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: email.trim().toLowerCase(),
        backupData: payload,
      }),
    });
    if (!res.ok) throw new Error('Cloud backup failed');
    const data = await res.json();
    return { success: true, message: data.message || 'Прогресс успешно сохранен в облаке!' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Ошибка связи с облачным сервером.' };
  }
}

export async function loadFromCloudServer(email: string): Promise<{ success: boolean; data?: FullAppBackup; message: string }> {
  try {
    const res = await fetch(`/api/backup/load?userId=${encodeURIComponent(email.trim().toLowerCase())}`);
    if (!res.ok) {
      if (res.status === 404) {
        return { success: false, message: 'Для этого аккаунта резервная копия не найдена.' };
      }
      throw new Error('Cloud fetch failed');
    }
    const result = await res.json();
    if (result.backupData) {
      const restored = restoreFullAppSnapshot(result.backupData);
      if (restored) {
        return { success: true, data: result.backupData, message: 'Прогресс успешно загружен и восстановлен!' };
      }
    }
    return { success: false, message: 'Поврежденные данные в резервной копии.' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Ошибка соединения с облаком.' };
  }
}

/**
 * Resilient active workout session persistence
 * Prevents loss of progress if the user accidentally minimizes, switches apps, or reloads
 */
export function saveActiveWorkoutSession(session: ActiveWorkoutSession): void {
  try {
    const sessionWithTime: ActiveWorkoutSession = {
      ...session,
      savedAt: session.savedAt || new Date().toISOString(),
      lastUpdatedTimestamp: session.lastUpdatedTimestamp || Date.now(),
    };
    localStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(sessionWithTime));
  } catch (e) {
    console.error('Failed to save active workout session backup', e);
  }
}

export function getActiveWorkoutSession(): ActiveWorkoutSession | null {
  try {
    const raw = localStorage.getItem(KEYS.ACTIVE_SESSION);
    if (raw) {
      const parsed: ActiveWorkoutSession = JSON.parse(raw);
      // Ensure session is not older than 24 hours
      const savedTime = parsed.lastUpdatedTimestamp || (parsed.savedAt ? new Date(parsed.savedAt).getTime() : 0);
      const now = Date.now();
      if (savedTime && now - savedTime < 24 * 60 * 60 * 1000) {
        return parsed;
      } else {
        clearActiveWorkoutSession();
      }
    }
  } catch (e) {
    console.error('Failed to load active workout session', e);
  }
  return null;
}

export function clearActiveWorkoutSession(): void {
  try {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  } catch (e) {
    console.error('Failed to clear active workout session', e);
  }
}
