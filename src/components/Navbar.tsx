import React from 'react';
import {
  Flame,
  Award,
  Activity,
  Calendar,
  BarChart3,
  MessageSquare,
  Volume2,
  VolumeX,
  Zap,
  Smartphone,
  Cloud,
  Download,
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  currentTab: 'plan' | 'analytics' | 'coach' | 'assessment';
  setCurrentTab: (tab: 'plan' | 'analytics' | 'coach' | 'assessment') => void;
  profile: UserProfile;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenSamsungHealth: () => void;
  onOpenCloudSync: () => void;
  onOpenInstall: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  soundEnabled,
  setSoundEnabled,
  onOpenSamsungHealth,
  onOpenCloudSync,
  onOpenInstall,
  isOnline,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setSoundEnabled(next);
    soundFx.setVoiceEnabled(next);
    if (next) soundFx.playBeep(700, 0.1);
  };

  const xpInCurrentRank = profile.egoXp % 500;
  const xpPercent = Math.min(100, Math.floor((xpInCurrentRank / 500) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#040817]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Ego Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/25 border border-cyan-300/40">
            <Zap className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wider text-base md:text-lg text-white font-mono">
                EGO<span className="text-cyan-400">FLEX</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full shadow-sm">
                Blue Lock AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[160px] md:max-w-xs font-medium">
              {profile.egoTitle || `Ego Rank #${profile.egoRank}`}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
          <button
            id="nav-tab-plan"
            onClick={() => setCurrentTab('plan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'plan'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>План тренировок</span>
          </button>
          <button
            id="nav-tab-analytics"
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Прогресс & Метрики</span>
          </button>
          <button
            id="nav-tab-coach"
            onClick={() => setCurrentTab('coach')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'coach'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ИИ-Тренер Эго</span>
          </button>
          <button
            id="nav-tab-assessment"
            onClick={() => setCurrentTab('assessment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'assessment'
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Замеры & Тесты</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Cloud Sync Button */}
          <button
            id="btn-cloud-sync-nav"
            onClick={onOpenCloudSync}
            title="Синхронизация прогресса через Google / Облако"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-xs font-bold text-cyan-300 transition-all shadow-sm"
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Облако</span>
          </button>

          {/* Download Source Code ZIP */}
          <a
            id="btn-download-source-zip"
            href="/project-source.zip"
            download="egoflex-source-code.zip"
            title="Скачать полный исходный код приложения (.ZIP архивом)"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-850 text-xs font-bold text-slate-300 hover:text-cyan-300 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Код .ZIP</span>
          </a>

          {/* Download / Install App Button */}
          <button
            id="btn-install-app-nav"
            onClick={onOpenInstall}
            title="Установка на телефон (PWA)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 text-xs font-bold text-cyan-300 transition-all hover:bg-slate-850 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">На телефон</span>
          </button>

          {/* Samsung Health status indicator */}
          <button
            id="btn-samsung-health-nav"
            onClick={onOpenSamsungHealth}
            title="Samsung Health Синхронизация"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-850"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Samsung Health</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          {/* Ego Rank Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-2xl shadow-inner">
            <Award className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-amber-300 font-mono">
                  #{profile.egoRank}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{profile.egoXp} XP</span>
              </div>
              <div className="w-14 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sound Toggle Button */}
          <button
            id="btn-toggle-sound"
            onClick={toggleSound}
            title={soundEnabled ? 'Звук и голос включены' : 'Звук выключен'}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="grid grid-cols-4 gap-1 md:hidden mt-2.5 pt-2 border-t border-slate-800/60 text-center">
        <button
          onClick={() => setCurrentTab('plan')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1.5 rounded-xl transition-all ${
            currentTab === 'plan' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>План</span>
        </button>
        <button
          onClick={() => setCurrentTab('analytics')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1.5 rounded-xl transition-all ${
            currentTab === 'analytics' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Прогресс</span>
        </button>
        <button
          onClick={() => setCurrentTab('coach')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1.5 rounded-xl transition-all ${
            currentTab === 'coach' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>ИИ-Эго</span>
        </button>
        <button
          onClick={() => setCurrentTab('assessment')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1.5 rounded-xl transition-all ${
            currentTab === 'assessment' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Замеры</span>
        </button>
      </div>
    </header>
  );
};
