import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Sparkles, RefreshCw, Volume2, Bell, BellRing, Check, Clock } from 'lucide-react';
import { BLUE_LOCK_QUOTES } from '../data/quotes';
import { soundFx } from '../utils/audio';

export const QuotesNotificationBanner: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('egoflex_daily_reminder') === 'true';
  });

  const currentQuote = BLUE_LOCK_QUOTES[index];

  // Rotate quotes every 45 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BLUE_LOCK_QUOTES.length);
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const handleNextQuote = () => {
    setIndex((prev) => (prev + 1) % BLUE_LOCK_QUOTES.length);
    soundFx.playBeep(520, 0.08);
  };

  const handleSpeakQuote = () => {
    soundFx.speak(`Цитата от ${currentQuote.character}. ${currentQuote.quote}`);
  };

  const handleTriggerNotification = async () => {
    let perm = 'denied';
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        perm = 'granted';
      } else if (Notification.permission !== 'denied') {
        try {
          perm = await Notification.requestPermission();
        } catch (e) {
          perm = 'denied';
        }
      }
    }

    if (perm === 'granted') {
      try {
        new Notification(`Blue Lock • ${currentQuote.character}`, {
          body: currentQuote.quote,
          icon: '/icon.png',
          badge: '/icon.png',
        });
      } catch (e) {
        console.warn('Native notification failed, using in-app alert', e);
      }
    }

    setToastMessage(`Уведомление от ${currentQuote.character}: «${currentQuote.quote.slice(0, 70)}...»`);
    setShowToast(true);
    soundFx.playStartChime();
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleToggleDailyReminder = async () => {
    const next = !dailyReminderEnabled;
    setDailyReminderEnabled(next);
    localStorage.setItem('egoflex_daily_reminder', String(next));

    if (next) {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (e) {
          // ignore
        }
      }
      setToastMessage('Ежедневное напоминание о тренировке на 19:00 активировано!');
      soundFx.playCompletionFanfare();
    } else {
      setToastMessage('Ежедневное напоминание отключено.');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/40 border border-slate-800/90 p-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-black text-white">
                  {currentQuote.character}
                </span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  • {currentQuote.situation}
                </span>
              </div>
              <p className="text-xs text-slate-300 italic font-medium leading-relaxed max-w-3xl">
                «{currentQuote.quote}»
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            <button
              onClick={handleSpeakQuote}
              title="Озвучить цитату"
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleToggleDailyReminder}
              title={dailyReminderEnabled ? 'Напоминания в 19:00 включены' : 'Включить напоминание в 19:00'}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
                dailyReminderEnabled
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BellRing className="w-3 h-3" />
              <span>19:00 {dailyReminderEnabled ? 'ВКЛ' : 'ВЫКЛ'}</span>
            </button>

            <button
              onClick={handleTriggerNotification}
              title="Отправить пуш-уведомление"
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNextQuote}
              title="Следующая мотивационная цитата"
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Floating Notification Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mt-2.5 text-xs text-cyan-200 bg-cyan-950/90 border border-cyan-700/80 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-950/50"
            >
              <Check className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
