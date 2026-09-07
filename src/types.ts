export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface FlexibilityAssessment {
  forwardFold: number; // in cm from toes (-20 to +20)
  hipMobilityPancake: number; // 1 to 5 rating
  shoulderReachApley: number; // in cm gap between fingers (-15 to +15)
  quadAnkleKneel: number; // 1 to 5 rating (heel to glute kneeling)
  sideSplitSpread: number; // angle or 1 to 5
  spineThoracicRotation: number; // 1 to 5
  notes: string;
}

export interface BalanceAssessment {
  singleLegOpenEyesSeconds: number; // seconds (0 - 120)
  singleLegClosedEyesSeconds: number; // seconds (0 - 90)
  tandemWalkScore: number; // 1 to 10
  singleLegDeadliftBalanceScore: number; // reps (0 - 20)
  wobbleControlNotes: string;
}

export interface SamsungHealthData {
  dailySteps: number;
  activeCalories: number;
  restingHeartRate: number;
  sleepHours: number;
  recoveryScore: number;
  lastSyncTime: string;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  sport: string;
  experienceLevel: ExperienceLevel;
  primaryGoals: string[];
  injuryRestrictions: string;
  currentStretchingRoutine: string;
  currentBalanceSportRoutine: string;
  trainingDaysPerWeek: number;
  preferredSessionDuration: number; // minutes
  flexibilityAssessment: FlexibilityAssessment;
  balanceAssessment: BalanceAssessment;
  egoRank: number; // 300 to 1
  egoXp: number;
  egoTitle: string;
  samsungHealthConnected: boolean;
  samsungHealthData: SamsungHealthData;
  isInitialAssessmentDone: boolean;
}

export type ExerciseCategory = 'warmup' | 'flexibility' | 'balance' | 'pnf' | 'cooldown' | 'hybrid' | 'joint_prep';
export type ExerciseType = 'timed_hold' | 'reps' | 'dynamic_flow';
export type ExerciseDifficulty = 'scale_down' | 'standard' | 'scale_up';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetMuscleOrSkill: string;
  type: ExerciseType;
  durationSeconds: number;
  reps?: number;
  sets: number;
  restSeconds: number;
  instructions?: string[];
  setupInstructions?: string;
  commonMistakes?: string[];
  strictCoachTip: string;
  difficulty: ExerciseDifficulty;
  regression?: string;
  progression?: string;
  breathingPattern?: string;
  targetAngleOrCue?: string;
  sidesRequired?: boolean; // left/right side
  isCompleted?: boolean;
}

export interface AnimeTheme {
  character?: string;
  characterId?: string;
  quote: string;
  quoteSource?: string;
  conceptTitle?: string;
  bgImageUrl?: string;
  tacticalRationale?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  title: string;
  focus: 'flexibility' | 'balance' | 'hybrid';
  estimatedDurationMin: number;
  animeTheme: AnimeTheme;
  warmup: Exercise[];
  mainRoutine: Exercise[];
  cooldown: Exercise[];
  completed: boolean;
  completedAt?: string;
  perceivedExertion?: number;
  actualDurationSeconds?: number;
  coachFeedback?: string;
}

export interface WeeklyPlan {
  weekNumber: number;
  mesocyclePhase?: string;
  generatedAt: string;
  aiCoachAnalysis: string;
  adaptationNotes: string;
  days: WorkoutDay[];
  isCompleted?: boolean;
}

export interface ProgressLog {
  id: string;
  date: string;
  weekNumber: number;
  dayNumber: number;
  workoutTitle: string;
  durationSeconds: number;
  forwardFoldCm?: number;
  singleLegClosedEyesSec?: number;
  hipPancakeScore?: number;
  perceivedDifficulty: number; // 1-10
  feedbackGiven?: string;
  egoXpGained: number;
  samsungHealthSynced?: boolean;
}

export interface BlueLockQuote {
  id: string;
  quote: string;
  character: string;
  title: string;
  situation: string;
}

export interface BlueLockCharacter {
  id: string;
  nameRu: string;
  nameEn: string;
  title: string;
  specialty: string;
  avatarUrl: string;
  fallbackAvatarUrls?: string[];
  bannerUrl: string;
  accentColor: string; // Tailwind color or hex
  glowColor: string;
  quote: string;
  quoteContext: string;
  keyBiomechanicalFocus: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach' | 'system';
  text: string;
  timestamp: string;
}

export interface ActiveWorkoutSession {
  weekNumber: number;
  dayNumber: number;
  workoutTitle?: string;
  currentIndex: number;
  currentSide: 'left' | 'right' | 'both';
  currentSet: number;
  totalElapsedTime: number;
  completedReps: number;
  isResting: boolean;
  restDuration: number;
  remainingSeconds?: number;
  lastUpdatedTimestamp?: number;
  savedAt?: string;
}
