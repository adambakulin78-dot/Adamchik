import { WorkoutDay, Exercise } from '../types';

/**
 * Calculates the exact timer duration in seconds for a single exercise,
 * including all sets, bilateral sides (left + right with 10s switch rest),
 * and inter-set rest intervals.
 */
export function calculateExerciseTotalSeconds(ex: Exercise): number {
  const sets = Math.max(1, ex.sets || 1);
  const duration = Math.max(15, ex.durationSeconds || 45);
  const rest = Math.max(0, ex.restSeconds || 15);

  if (ex.sidesRequired) {
    // 1 set = Left side (duration) + switch rest (10s) + Right side (duration)
    const setWorkSeconds = duration * 2 + 10;
    // Inter-set rests occur between sets (sets - 1)
    const totalSetRests = (sets - 1) * rest;
    return sets * setWorkSeconds + totalSetRests;
  } else {
    const totalWorkSeconds = sets * duration;
    const totalSetRests = (sets - 1) * rest;
    return totalWorkSeconds + totalSetRests;
  }
}

/**
 * Calculates the exact total workout time in seconds
 * including all exercises, all sets, bilateral sides, and inter-exercise rests.
 */
export function calculateAccurateWorkoutSeconds(workoutDay: WorkoutDay): number {
  const allExercises: Exercise[] = [
    ...(workoutDay.warmup || []),
    ...(workoutDay.mainRoutine || []),
    ...(workoutDay.cooldown || []),
  ];

  if (allExercises.length === 0) return 0;

  let totalSeconds = 0;

  allExercises.forEach((ex, index) => {
    totalSeconds += calculateExerciseTotalSeconds(ex);

    // Add inter-exercise rest (transition) if not the last exercise
    if (index < allExercises.length - 1) {
      totalSeconds += Math.max(15, ex.restSeconds || 20);
    }
  });

  return totalSeconds;
}

/**
 * Calculates accurate total workout duration in minutes (rounded).
 */
export function calculateAccurateWorkoutMinutes(workoutDay: WorkoutDay): number {
  const seconds = calculateAccurateWorkoutSeconds(workoutDay);
  return Math.max(1, Math.round(seconds / 60));
}

/**
 * Format seconds into mm:ss or hh:mm:ss
 */
export function formatTimeSeconds(totalSecs: number): string {
  const safeSecs = Math.max(0, Math.floor(totalSecs));
  const hrs = Math.floor(safeSecs / 3600);
  const mins = Math.floor((safeSecs % 3600) / 60);
  const secs = safeSecs % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Ensures a workout meets the required 40-60 minute length by upgrading
 * set counts, hold times, and bilateral protocols.
 */
export function scaleWorkoutToTargetMinutes(
  workoutDay: WorkoutDay,
  targetMinutes: number = 45
): WorkoutDay {
  const target = Math.max(30, Math.min(75, targetMinutes));

  // Clone day deeply
  const scaledDay: WorkoutDay = JSON.parse(JSON.stringify(workoutDay));

  // Determine scaling multiplier
  const currentMinutes = calculateAccurateWorkoutMinutes(scaledDay);

  if (currentMinutes < target - 3) {
    // Elevate sets in mainRoutine from 1-2 to 3-4
    scaledDay.mainRoutine = scaledDay.mainRoutine.map((ex) => {
      let newSets = ex.sets;
      let newDuration = ex.durationSeconds;

      if (target >= 45) {
        newSets = Math.max(3, ex.sets || 2);
        newDuration = Math.max(60, ex.durationSeconds || 60);
      } else {
        newSets = Math.max(2, ex.sets || 2);
        newDuration = Math.max(50, ex.durationSeconds || 50);
      }

      return {
        ...ex,
        sets: newSets,
        durationSeconds: newDuration,
        restSeconds: Math.max(20, ex.restSeconds || 20),
      };
    });

    // Elevate warmup sets
    scaledDay.warmup = scaledDay.warmup.map((ex) => ({
      ...ex,
      sets: Math.max(2, ex.sets || 1),
      durationSeconds: Math.max(50, ex.durationSeconds || 45),
      restSeconds: 15,
    }));

    // Elevate cooldown sets / hold duration
    scaledDay.cooldown = scaledDay.cooldown.map((ex) => ({
      ...ex,
      sets: Math.max(2, ex.sets || 1),
      durationSeconds: Math.max(75, ex.durationSeconds || 60),
      restSeconds: 15,
    }));
  }

  // Update calculated estimated duration
  scaledDay.estimatedDurationMin = calculateAccurateWorkoutMinutes(scaledDay);

  return scaledDay;
}
