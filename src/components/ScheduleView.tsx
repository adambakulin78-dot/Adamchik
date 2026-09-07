import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Target, Flame, Brain, BookOpen, Dumbbell } from 'lucide-react';
import { DailySchedule, ScheduleTask, TaskType } from '../types_schedule';
import { useLocalStorageSchedule } from '../hooks/useLocalStorageSchedule';

export const ScheduleView: React.FC = () => {
  const [schedule, setSchedule] = useLocalStorageSchedule();

  const today = new Date().getDay();
  const [activeDay, setActiveDay] = useState<number>(today);

  const toggleTaskCompletion = (dayIndex: number, taskId: string) => {
    setSchedule(prev => prev.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      return {
        ...day,
        tasks: day.tasks.map(task =>
          task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        )
      };
    }));
  };

  const getTaskIcon = (type: TaskType) => {
    switch(type) {
      case 'college': return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'commute': return <Clock className="w-5 h-5 text-gray-400" />;
      case 'gym': return <Dumbbell className="w-5 h-5 text-red-500" />;
      case 'boxing': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'sprints': return <Target className="w-5 h-5 text-yellow-400" />;
      case 'study_spanish': return <Target className="w-5 h-5 text-purple-400" />;
      case 'study_psychology': return <Brain className="w-5 h-5 text-pink-400" />;
      case 'stretching': return <CheckCircle2 className="w-5 h-5 text-teal-400" />;
      default: return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const currentDaySchedule = schedule.find(d => d.dayOfWeek === activeDay) || schedule[0];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          ЖЕСТКИЙ ГРАФИК
        </h2>
        <div className="text-sm font-bold text-slate-400 flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>ЭГО ДИСЦИПЛИНА</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {schedule.map((day) => {
          const isActive = day.dayOfWeek === activeDay;
          return (
            <button
              key={day.dayOfWeek}
              onClick={() => setActiveDay(day.dayOfWeek)}
              className={`shrink-0 px-4 py-2 rounded-xl font-black text-sm uppercase transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {day.dayName}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {currentDaySchedule.tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-2xl border transition-all ${
                task.isCompleted
                  ? 'bg-slate-900/50 border-cyan-900/50 opacity-60'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaskCompletion(schedule.indexOf(currentDaySchedule), task.id)}
                  className="mt-1 shrink-0"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTaskIcon(task.type)}
                    <span className="text-sm font-bold text-slate-300">
                      {task.startTime} - {task.endTime}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black ${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  {!task.isCompleted && task.strictCoachMessage && (
                    <div className="mt-3 p-3 bg-red-950/30 border border-red-900/50 rounded-xl">
                      <p className="text-sm font-medium text-red-200/90 italic">
                        "{task.strictCoachMessage}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
