import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  QrCode,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Info,
  Menu,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { UserProfile, WeeklyPlan } from '../types';

interface AppInstallModalProps {
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess: () => void;
  profile: UserProfile;
  weeklyPlan: WeeklyPlan;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({
  onClose,
  deferredPrompt,
  onInstallSuccess,
  profile,
  weeklyPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'apk' | 'android' | 'samsung' | 'ios' | 'qr' | 'backup'>('apk');
  const [isInstalling, setIsInstalling] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInsideIframe, setIsInsideIframe] = useState(false);
  const [swActive, setSwActive] = useState(false);

  // Stable canonical public URL for direct mobile installation
  const PUBLIC_APP_URL = 'https://ais-pre-6rsh4aaqlqh2ypgiy2oiiz-803278235848.europe-west2.run.app';

  useEffect(() => {
    // Check if running inside iframe
    try {
      setIsInsideIframe(window.self !== window.top);
    } catch (e) {
      setIsInsideIframe(true);
    }

    // Check if running as standalone PWA
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);

    // Check service worker state
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        setSwActive(regs.length > 0);
      });
    }
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          onInstallSuccess();
          onClose();
        }
      } catch (e) {
        console.error('Install prompt error:', e);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(PUBLIC_APP_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EgoFlex AI • Blue Lock Stretching & Balance',
          text: 'Элитные тренировки растяжки, баланса и мобильности с ИИ-тренером Эго',
          url: PUBLIC_APP_URL,
        });
      } catch (e) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleOpenDirect = () => {
    window.open(PUBLIC_APP_URL, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadBackup = () => {
    const backupData = {
      profile,
      weeklyPlan,
      exportedAt: new Date().toISOString(),
      appVersion: '2.0.0-EgoFlex',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EgoFlex_Training_Backup_${profile.name || 'Athlete'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // QR Code URL pointing directly to the stable production app URL
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    PUBLIC_APP_URL
  )}&bgcolor=07090e&color=06b6d4&margin=12`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-cyan-950/60 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-2 py-0.5 rounded-full">
                    PWA • Автономное Приложение
                  </span>
                  {isStandalone && (
                    <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Установлено
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide mt-0.5">
                  Установка EgoFlex на телефон
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Iframe Warning Notice (Browsers block PWA prompt inside iframes) */}
          {isInsideIframe && (
            <div className="p-3 bg-amber-950/70 border-b border-amber-800/80 flex items-center justify-between gap-3 px-4">
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Для установки откройте приложение по прямой ссылке в <strong>Chrome/Safari</strong>
                </span>
              </div>
              <button
                onClick={handleOpenDirect}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 shrink-0 transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Открыть</span>
              </button>
            </div>
          )}

          {/* Direct Install Button if prompt is ready */}
          {deferredPrompt && (
            <div className="p-3.5 bg-cyan-950/80 border-b border-cyan-700/80 flex items-center justify-between gap-3 px-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-200">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
                <span>Браузер готов к мгновенной установке!</span>
              </div>
              <button
                id="btn-install-prompt-direct"
                onClick={handleNativeInstall}
                disabled={isInstalling}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider transition-all shadow-md shadow-cyan-500/25 shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isInstalling ? 'Установка...' : 'Установить в 1 клик'}</span>
              </button>
            </div>
          )}

          {/* Nav Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 px-3 pt-2.5 gap-1.5 overflow-x-auto no-scrollbar">
            <button
              id="tab-install-apk"
              onClick={() => setActiveTab('apk')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'apk'
                  ? 'bg-slate-900 border-cyan-700 text-cyan-400 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Android APK</span>
            </button>

            <button
              id="tab-install-android"
              onClick={() => setActiveTab('android')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'android'
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android (Chrome)</span>
            </button>

            <button
              id="tab-install-samsung"
              onClick={() => setActiveTab('samsung')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'samsung'
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Samsung Internet</span>
            </button>

            <button
              id="tab-install-ios"
              onClick={() => setActiveTab('ios')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'ios'
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>iPhone (Safari)</span>
            </button>

            <button
              id="tab-install-qr"
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'qr'
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR-код</span>
            </button>

            <button
              id="tab-install-backup"
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-bold transition-all border-t border-x whitespace-nowrap ${
                activeTab === 'backup'
                  ? 'bg-slate-900 border-slate-700 text-cyan-400 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Бэкап</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm text-slate-300">
            {/* Quick URL and Share Bar */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex-1 truncate font-mono text-xs text-slate-400 select-all px-1">
                {PUBLIC_APP_URL}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Скопировать прямую ссылку"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Скопировано' : 'Копия'}</span>
                </button>

                <button
                  onClick={handleShareLink}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Поделиться ссылкой"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Отправить</span>
                </button>

                <button
                  onClick={handleOpenDirect}
                  className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-all"
                  title="Открыть в браузере"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Открыть</span>
                </button>
              </div>
            </div>

            {/* TAB: Android Google Chrome */}
            {activeTab === 'android' && (
              <div className="space-y-3.5">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                    <Zap className="w-4 h-4" /> Пошаговая установка в Google Chrome на Android:
                  </h3>

                  <ol className="space-y-3 text-xs">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                        1
                      </div>
                      <div>
                        <strong className="text-white">Открой сайт в Chrome</strong>
                        <p className="text-slate-400 mt-0.5">
                          Нажми на значок меню <strong className="text-cyan-300">⋮</strong> (три точки в правом верхнем углу экрана).
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                        2
                      </div>
                      <div>
                        <strong className="text-white">Выбери «Установить приложение»</strong>
                        <p className="text-slate-400 mt-0.5">
                          Если такой пункт не виден сразу, нажми <span className="text-white font-semibold">«Добавить на главный экран»</span>.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                        3
                      </div>
                      <div>
                        <strong className="text-white">Подтверди установку</strong>
                        <p className="text-slate-400 mt-0.5">
                          Ярлык EgoFlex с неоновой иконкой появится на рабочем столе и будет работать без рамок браузера.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB: Samsung Internet */}
            {activeTab === 'samsung' && (
              <div className="space-y-3.5">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                    <Smartphone className="w-4 h-4" /> Пошаговая установка в Samsung Internet:
                  </h3>

                  <ol className="space-y-3 text-xs">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                        1
                      </div>
                      <div>
                        <strong className="text-white">Открой сайт в Samsung Internet</strong>
                        <p className="text-slate-400 mt-0.5">
                          Нажми на значок меню <strong className="text-cyan-300">☰</strong> (три полоски в правом нижнем углу) или иконку загрузки <Download className="w-3.5 h-3.5 inline text-cyan-400" /> в адресной строке.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                        2
                      </div>
                      <div>
                        <strong className="text-white">Нажми «Добавить страницу в»</strong>
                        <p className="text-slate-400 mt-0.5">
                          В открывшемся списке выбери <span className="text-white font-semibold">«Главный экран» (Экран приложений)</span>.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                        3
                      </div>
                      <div>
                        <strong className="text-white">Нажми «Добавить»</strong>
                        <p className="text-slate-400 mt-0.5">
                          Готово! Приложение интегрировано с Galaxy One UI и датчиками Samsung Health.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB: iPhone & iPad Safari */}
            {activeTab === 'ios' && (
              <div className="space-y-3.5">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                    <Smartphone className="w-4 h-4" /> Установка на iPhone и iPad (Safari):
                  </h3>

                  <ol className="space-y-3 text-xs">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </div>
                      <div>
                        <strong className="text-white">Открой сайт в Safari</strong>
                        <p className="text-slate-400 mt-0.5">
                          (На iOS установка PWA поддерживается исключительно через стандартный браузер Safari).
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </div>
                      <div>
                        <strong className="text-white">Нажми кнопку «Поделиться»</strong>
                        <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                          Иконка квадрата со стрелкой вверх <Share2 className="w-3.5 h-3.5 text-cyan-400 inline" /> в нижней панели Safari.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </div>
                      <div>
                        <strong className="text-white">Выбери «На экран "Домой"»</strong>
                        <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                          Пункт со значком <PlusSquare className="w-3.5 h-3.5 text-cyan-400 inline" /> (Add to Home Screen).
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                        4
                      </div>
                      <div>
                        <strong className="text-white">Нажми «Добавить» в правом верхнем углу</strong>
                        <p className="text-slate-400 mt-0.5">
                          Иконка появится среди ваших приложений на iOS и сохранит все офлайн-тренировки.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB: Direct APK Download */}
            {activeTab === 'apk' && (
              <div className="space-y-4 text-center">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                  <div className="p-4 rounded-full bg-cyan-950 border-2 border-cyan-500/50 shadow-xl shadow-cyan-950/60 mb-3 text-cyan-400">
                    <Download className="w-10 h-10" />
                  </div>
                  <h3 className="font-extrabold text-white text-sm">
                    Скачать Android APK
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
                    Установите приложение напрямую из скомпилированного APK файла. Это самый быстрый способ получить приложение с уведомлениями на Android.
                  </p>
                  <a
                    href="/api/download-apk"
                    download="EgoScheduler.apk"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Скачать APK (9.2 MB)</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB: QR Code */}
            {activeTab === 'qr' && (
              <div className="space-y-4 text-center">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                  <div className="p-3 rounded-2xl bg-slate-900 border-2 border-cyan-500/50 shadow-xl shadow-cyan-950/60 mb-3">
                    <img
                      src={qrCodeImgUrl}
                      alt="QR Code для установки EgoFlex на телефон"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                    />
                  </div>

                  <h3 className="font-extrabold text-white text-sm">
                    Наведи камеру смартфона на QR-код
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Камера мгновенно распознает прямую ссылку и откроет приложение для установки.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: Offline Backup */}
            {activeTab === 'backup' && (
              <div className="space-y-3.5">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-cyan-400">
                    <ShieldCheck className="w-4 h-4" /> Автономный Резервный Файл (.JSON)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Вы можете скачать все ваши персональные замеры подвижности, углы шпагатов, баланс и текущий план тренировок в отдельный файл на устройство для сохранения прогресса.
                  </p>

                  <button
                    onClick={handleDownloadBackup}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Скачать профиль и план (.json)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Diagnostics Footer */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Manifest: OK
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PWA Иконки: OK
                </span>
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Офлайн Кэш: Готов
                </span>
              </div>
              <div className="text-slate-500">
                v2.1 • PWA Engine
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
