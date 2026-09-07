import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Cloud,
  CloudDownload,
  CloudUpload,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileJson,
  Download,
  Upload,
  UserCheck,
  Lock,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import {
  saveToCloudServer,
  loadFromCloudServer,
  exportFullAppSnapshot,
  restoreFullAppSnapshot,
  FullAppBackup,
} from '../utils/storage';

interface CloudSyncModalProps {
  onClose: () => void;
  onDataRestored: (backup: FullAppBackup) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  onClose,
  onDataRestored,
}) => {
  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem('egoflex_google_account') || 'athlete.egoflex@gmail.com';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveToCloud = async () => {
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Пожалуйста, введи корректный Google/Email адрес.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    soundFx.playStartChime();

    try {
      localStorage.setItem('egoflex_google_account', email);
      const res = await saveToCloudServer(email);
      if (res.success) {
        setStatusMessage({ type: 'success', text: `Резервная копия успешно синхронизирована с аккаунтом ${email}!` });
        soundFx.playCompletionFanfare();
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка синхронизации с облаком.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFromCloud = async () => {
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Пожалуйста, укажи свой Google Email для восстановления.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    soundFx.playStartChime();

    try {
      localStorage.setItem('egoflex_google_account', email);
      const res = await loadFromCloudServer(email);
      if (res.success && res.data) {
        onDataRestored(res.data);
        setStatusMessage({
          type: 'success',
          text: `Все тренировки, профиль и ранг #${res.data.profile.egoRank} успешно восстановлены из облака!`,
        });
        soundFx.playCompletionFanfare();
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка загрузки из облака.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJsonFile = () => {
    const data = exportFullAppSnapshot();
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const dl = document.createElement('a');
    dl.setAttribute('href', jsonStr);
    dl.setAttribute('download', `egoflex_progress_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    setStatusMessage({ type: 'success', text: 'Файл полной резервной копии успешно сохранен на устройство!' });
    soundFx.playCompletionFanfare();
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        const ok = restoreFullAppSnapshot(parsed);
        if (ok) {
          onDataRestored(parsed);
          setStatusMessage({ type: 'success', text: `Данные из файла "${file.name}" успешно загружены!` });
          soundFx.playCompletionFanfare();
        } else {
          setStatusMessage({ type: 'error', text: 'Неверный формат резервной копии.' });
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Не удалось прочитать JSON-файл.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Облачное сохранение & Google</h2>
              <span className="text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-md">
                Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Сохраняй прогресс и восстанавливай после переустановки
            </p>
          </div>
        </div>

        {/* Status Message */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-start gap-2 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-800 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Google Account Input Field */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Google Аккаунт / Email для облачной синхронизации
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Все недели тренировок, замеры гибкости, баланса, очки опыта и титул привязываются к этому идентификатору.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleSaveToCloud}
                disabled={isLoading}
                className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CloudUpload className="w-3.5 h-3.5" />
                )}
                <span>Сохранить в облако</span>
              </button>

              <button
                onClick={handleLoadFromCloud}
                disabled={isLoading}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-300 font-black text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CloudDownload className="w-3.5 h-3.5" />
                )}
                <span>Восстановить</span>
              </button>
            </div>
          </div>

          {/* Offline File Backup Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-cyan-400" />
              Локальный файл резервной копии (.json)
            </div>
            <p className="text-[11px] text-slate-400">
              Если ты переустанавливаешь PWA или меняешь браузер без интернета, скачай файл снимка данных:
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJsonFile}
              accept=".json"
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJsonFile}
                className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Скачать JSON
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition-all"
              >
                <Upload className="w-3.5 h-3.5" /> Загрузить JSON
              </button>
            </div>
          </div>

          {/* Full Source Code Download Card */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
            <div className="text-xs font-bold text-cyan-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Исходный код проекта (.ZIP)
              </span>
              <span className="text-[10px] font-mono bg-cyan-900/60 px-2 py-0.5 rounded text-cyan-300">
                227 KB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Полный архив проекта (React + TypeScript + Express + Tailwind) со всеми компонентами, иллюстрациями и планом тренировок.
            </p>
            <a
              href="/project-source.zip"
              download="egoflex-source-code.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Скачать полный архив проекта (.ZIP)</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Закрыть
          </button>
        </div>
      </motion.div>
    </div>
  );
};
