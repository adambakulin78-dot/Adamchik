import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  Zap,
  Flame,
  Calendar,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { ProgressLog, UserProfile } from '../types';

interface AnalyticsViewProps {
  logs: ProgressLog[];
  profile: UserProfile;
  onOpenAssessment: () => void;
  onOpenSamsungHealth: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  logs,
  profile,
  onOpenAssessment,
  onOpenSamsungHealth,
}) => {
  // Sort logs chronologically
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Latest metrics
  const latestFlexibility =
    sortedLogs[sortedLogs.length - 1]?.forwardFoldCm ?? profile.flexibilityAssessment.forwardFold;
  const initialFlexibility =
    sortedLogs[0]?.forwardFoldCm ?? profile.flexibilityAssessment.forwardFold;
  const flexDelta = +(latestFlexibility - initialFlexibility).toFixed(1);

  const latestBalance =
    sortedLogs[sortedLogs.length - 1]?.singleLegClosedEyesSec ??
    profile.balanceAssessment.singleLegClosedEyesSeconds;
  const initialBalance =
    sortedLogs[0]?.singleLegClosedEyesSec ?? profile.balanceAssessment.singleLegClosedEyesSeconds;
  const balanceDelta = latestBalance - initialBalance;

  // Radar body attributes (0-100%)
  const kinematicRadar = [
    { name: 'Подколенные связки', value: Math.min(100, Math.max(30, 50 + latestFlexibility * 3.5)) },
    { name: 'Мобильность ТБС', value: profile.flexibilityAssessment.hipMobilityPancake * 19 },
    { name: 'Голеностоп & Стопа', value: Math.min(100, Math.max(35, 40 + latestBalance * 2.2)) },
    { name: 'Вестибулярный аппарат', value: Math.min(100, Math.max(30, latestBalance * 3.8)) },
    { name: 'Грудной отдел & Плечи', value: 72 },
    { name: 'Глубокий кор & Осанка', value: 84 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-1 rounded-full">
            Биомеханическая Аналитика
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide mt-2">
            Трекинг Прогресса & Эволюция Тела
          </h1>
          <p className="text-xs text-slate-400">
            Визуализация еженедельных замеров гибкости, вестибулярного баланса и данных Samsung Health.
          </p>
        </div>

        <button
          onClick={onOpenAssessment}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Провести Контрольный Замер
        </button>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Flexibility Gain */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Наклон вперед (см)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white font-mono">
            {latestFlexibility > 0 ? `+${latestFlexibility}` : latestFlexibility}{' '}
            <span className="text-sm text-slate-400 font-sans">см</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-400 mt-1">
            {flexDelta >= 0 ? `+${flexDelta} см прогресса` : `${flexDelta} см`} за цикл
          </div>
        </div>

        {/* Balance Stability Seconds */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Баланс (Глаза закрыты)</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white font-mono">
            {latestBalance} <span className="text-sm text-slate-400 font-sans">сек</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-400 mt-1">
            +{balanceDelta} сек устойчивости
          </div>
        </div>

        {/* Ego XP & Rank */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Ego Rank & XP</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-300 font-mono">
            #{profile.egoRank}
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">
            Всего очков: {profile.egoXp} XP
          </div>
        </div>

        {/* Samsung Health Recovery */}
        <div
          onClick={onOpenSamsungHealth}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Samsung Health</span>
            <Smartphone className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-cyan-400 font-mono">
            {profile.samsungHealthData.recoveryScore}%
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-1">
            Готовность к растяжке • {profile.samsungHealthData.dailySteps} шагов
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progression Bar Visualizer */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Динамика Гибкости & Баланса по Дням
            </h3>
            <span className="text-xs text-slate-400">Последние замеры</span>
          </div>

          <div className="h-60 flex items-end justify-between gap-2 pt-6 border-b border-slate-800 px-2">
            {sortedLogs.map((log, idx) => {
              const flexHeight = Math.min(100, Math.max(15, (log.forwardFoldCm || 0) * 12 + 40));
              const balanceHeight = Math.min(100, Math.max(15, (log.singleLegClosedEyesSec || 0) * 4));

              return (
                <div key={log.id || idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Flexibility bar */}
                    <div
                      title={`Гибкость: ${log.forwardFoldCm} см`}
                      className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-500 hover:brightness-125"
                      style={{ height: `${flexHeight}%` }}
                    />
                    {/* Balance bar */}
                    <div
                      title={`Баланс: ${log.singleLegClosedEyesSec} сек`}
                      className="w-1/2 bg-gradient-to-t from-blue-700 to-indigo-500 rounded-t-md transition-all duration-500 hover:brightness-125"
                      style={{ height: `${balanceHeight}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 truncate max-w-[50px]">
                    {log.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400" />
              <span>Наклон вперед (см)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-indigo-500" />
              <span>Баланс закрытые глаза (сек)</span>
            </div>
          </div>
        </div>

        {/* Kinematic Balance Radar / Body Balance Bars */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Кинематический Баланс Тела (Metavision Radar)
            </h3>
            <span className="text-xs text-cyan-400 font-bold">Оценка Эго</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {kinematicRadar.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>{item.name}</span>
                  <span className="text-cyan-400 font-mono">{Math.round(item.value)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workout History Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Журнал Выполненных Тренировок
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3">Дата</th>
                <th className="pb-3">Сессия</th>
                <th className="pb-3">Длительность</th>
                <th className="pb-3">Гибкость (см)</th>
                <th className="pb-3">Баланс (сек)</th>
                <th className="pb-3">Опыт XP</th>
                <th className="pb-3">Samsung Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {sortedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 font-mono text-slate-400">{log.date}</td>
                  <td className="py-3 font-bold text-white">{log.workoutTitle}</td>
                  <td className="py-3 font-mono">{Math.round(log.durationSeconds / 60)} мин</td>
                  <td className="py-3 font-mono text-cyan-400">
                    {log.forwardFoldCm !== undefined
                      ? `${log.forwardFoldCm > 0 ? `+${log.forwardFoldCm}` : log.forwardFoldCm} см`
                      : '—'}
                  </td>
                  <td className="py-3 font-mono text-indigo-300">
                    {log.singleLegClosedEyesSec !== undefined ? `${log.singleLegClosedEyesSec} с` : '—'}
                  </td>
                  <td className="py-3 font-bold text-amber-400">+{log.egoXpGained} XP</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Синхронизировано
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
