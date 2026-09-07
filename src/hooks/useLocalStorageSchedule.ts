import { useState, useEffect } from 'react';
import { DailySchedule } from '../types_schedule';
import { weeklySchedule } from '../data/schedule';

export function useLocalStorageSchedule() {
  const [schedule, setSchedule] = useState<DailySchedule[]>(() => {
    try {
      const item = window.localStorage.getItem('egoFlex_schedule');
      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn('Error reading localStorage for schedule', error);
    }
    return weeklySchedule;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('egoFlex_schedule', JSON.stringify(schedule));
    } catch (error) {
      console.warn('Error saving schedule to localStorage', error);
    }
  }, [schedule]);

  return [schedule, setSchedule] as const;
}
