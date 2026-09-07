export type TaskType = 'college' | 'commute' | 'gym' | 'boxing' | 'sprints' | 'study_spanish' | 'study_psychology' | 'stretching' | 'other';

export interface ScheduleTask {
  id: string;
  title: string;
  type: TaskType;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  isCompleted: boolean;
  strictCoachMessage?: string; // AI message for this specific task
}

export interface DailySchedule {
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
  dayName: string;
  tasks: ScheduleTask[];
}
