import { useState, useEffect, useRef, useCallback } from 'react';
import { soundFx } from '../utils/audio';

export interface UseWorkoutTimerProps {
  totalSeconds: number;
  initialRemainingSeconds?: number;
  onFinish?: () => void;
  onTick?: (remaining: number) => void;
  autoStart?: boolean;
}

export function useWorkoutTimer({
  totalSeconds,
  initialRemainingSeconds,
  onFinish,
  onTick,
  autoStart = false,
}: UseWorkoutTimerProps) {
  const initialRemaining =
    initialRemainingSeconds !== undefined ? initialRemainingSeconds : totalSeconds;

  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const [remainingSeconds, setRemainingSeconds] = useState(initialRemaining);

  // Timestamp references to guarantee exact background counting
  const startTimeRef = useRef<number | null>(autoStart ? Date.now() : null);
  const pausedTimeRef = useRef<number>((totalSeconds - initialRemaining) * 1000);
  const targetDurationRef = useRef<number>(totalSeconds);
  const previousSecondRef = useRef<number>(initialRemaining);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  // Reset timer ONLY when target totalSeconds explicitly changes to a different duration
  useEffect(() => {
    if (totalSeconds !== targetDurationRef.current) {
      targetDurationRef.current = totalSeconds;
      setRemainingSeconds(totalSeconds);
      previousSecondRef.current = totalSeconds;
      startTimeRef.current = isRunning && !isPaused ? Date.now() : null;
      pausedTimeRef.current = 0;
    }
  }, [totalSeconds]);

  const tick = useCallback(() => {
    if (!isRunning || isPaused || !startTimeRef.current) return;

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTimeRef.current + pausedTimeRef.current) / 1000);
    const newRemaining = Math.max(0, targetDurationRef.current - elapsedSeconds);

    if (newRemaining !== previousSecondRef.current) {
      previousSecondRef.current = newRemaining;
      setRemainingSeconds(newRemaining);
      onTickRef.current?.(newRemaining);

      // Countdown audio beeps on 3, 2, 1
      if (newRemaining <= 3 && newRemaining > 0) {
        soundFx.playCountdown();
      }

      if (newRemaining === 0) {
        setIsRunning(false);
        setIsPaused(false);
        soundFx.playCompletionFanfare();
        onFinishRef.current?.();
      }
    }
  }, [isRunning, isPaused]);

  useEffect(() => {
    let intervalId: any = null;

    if (isRunning && !isPaused) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      // Run tight 200ms loop to catch exact second boundaries even on wake-up
      intervalId = setInterval(tick, 200);

      // Listen for visibility change to immediately catch up on wake-up
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          tick();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(intervalId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      if (intervalId) clearInterval(intervalId);
    }
  }, [isRunning, isPaused, tick]);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = (targetDurationRef.current - remainingSeconds) * 1000;
      setIsRunning(true);
      setIsPaused(false);
      soundFx.playStartChime();
    }
  }, [isRunning, remainingSeconds]);

  const pause = useCallback(() => {
    if (isRunning && !isPaused) {
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        pausedTimeRef.current += elapsed;
      }
      startTimeRef.current = null;
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);

  const resume = useCallback(() => {
    if (isRunning && isPaused) {
      startTimeRef.current = Date.now();
      setIsPaused(false);
      soundFx.playStartChime();
    }
  }, [isRunning, isPaused]);

  const startWithDuration = useCallback((duration: number) => {
    targetDurationRef.current = duration;
    setRemainingSeconds(duration);
    previousSecondRef.current = duration;
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setIsRunning(true);
    setIsPaused(false);
    soundFx.playStartChime();
  }, []);

  const reset = useCallback(
    (newDuration?: number) => {
      const dur = newDuration !== undefined ? newDuration : targetDurationRef.current;
      targetDurationRef.current = dur;
      setRemainingSeconds(dur);
      previousSecondRef.current = dur;
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      setIsRunning(false);
      setIsPaused(true);
    },
    []
  );

  const addTime = useCallback((seconds: number) => {
    targetDurationRef.current += seconds;
    setRemainingSeconds((prev) => Math.max(0, prev + seconds));
  }, []);

  return {
    remainingSeconds,
    totalSeconds: targetDurationRef.current,
    isRunning,
    isPaused,
    start,
    startWithDuration,
    pause,
    resume,
    reset,
    addTime,
    progress:
      targetDurationRef.current > 0
        ? Math.min(1, Math.max(0, (targetDurationRef.current - remainingSeconds) / targetDurationRef.current))
        : 0,
  };
}
