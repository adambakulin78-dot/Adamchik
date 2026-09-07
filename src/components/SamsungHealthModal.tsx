import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Heart,
  Moon,
  Footprints,
  Download,
  Upload,
  Activity,
  Bluetooth,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { SamsungHealthData } from '../types';
import { soundFx } from '../utils/audio';
import { connectBluetoothHeartRate, parseHealthExportFile } from '../utils/samsungHealth';

interface SamsungHealthModalProps {
  data: SamsungHealthData;
  onSync: (customData?: Partial<SamsungHealthData>) => Promise<void>;
  onClose: () => void;
}

export const SamsungHealthModal: React.FC<SamsungHealthModalProps> = ({
  data,
  onSync,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'bluetooth' | 'manual'>('metrics');
  const [isBluetoothConnecting, setIsBluetoothConnecting] = useState<boolean>(false);
  const [bluetoothDevice, setBluetoothDevice] = useState<string | null>(null);
  const [liveBpm, setLiveBpm] = useState<number | null>(null);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bleDisconnectRef = useRef<(() => void) | null>(null);

  // Manual editing state
  const [manualSteps, setManualSteps] = useState<number>(data.dailySteps);
  const [manualHr, setManualHr] = useState<number>(data.restingHeartRate);
  const [manualSleep, setManualSleep] = useState<number>(data.sleepHours);
  const [manualRecovery, setManualRecovery] = useState<number>(data.recoveryScore);

  useEffect(() => {
    return () => {
      if (bleDisconnectRef.current) {
        bleDisconnectRef.current();
      }
    };
  }, []);

  const handleConnectBluetooth = async () => {
    setIsBluetoothConnecting(true);
    setBluetoothError(null);
    try {
      const conn = await connectBluetoothHeartRate((bpm) => {
        setLiveBpm(bpm);
        onSync({
          restingHeartRate: bpm,
          lastSyncTime: new Date().toISOString(),
        });
      });
      bleDisconnectRef.current = conn.disconnect;
      setBluetoothDevice(conn.deviceName);
      soundFx.playCompletionFanfare();
    } catch (err: any) {
      if (err?.message === 'WEB_BLUETOOTH_UNSUPPORTED') {
        setBluetoothError('Web Bluetooth API не поддерживается текущим браузером. Используй Chrome на Android или ПК.');
      } else {
        setBluetoothError(err?.message || 'Не удалось подключиться к Bluetooth-датчику.');
      }
    } finally {
      setIsBluetoothConnecting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        const parsed = parseHealthExportFile(content);
        await onSync(parsed);
        setImportMessage(`Данные успешно импортированы из "${file.name}"!`);
        soundFx.playCompletionFanfare();
        setTimeout(() => setImportMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveManual = async () => {
    await onSync({
      dailySteps: manualSteps,
      restingHeartRate: manualHr,
      sleepHours: manualSleep,
      recoveryScore: manualRecovery,
      activeCalories: Math.floor(manualSteps * 0.045 + 100),
      lastSyncTime: new Date().toISOString(),
    });
    soundFx.playStartChime();
    setImportMessage('Биометрические параметры сохранены!');
    setTimeout(() => setImportMessage(null), 3000);
  };

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(
        {
          source: 'EgoFlex AI',
          platform: 'Samsung Health & Health Connect',
          data,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      )
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `egoflex_samsung_health_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportMessage('Файл синхронизации Samsung Health успешно экспортирован!');
    setTimeout(() => setExportMessage(null), 3500);
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

        {/* Modal Title & Integration Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Samsung Health & Биометрия</h2>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Real Link
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Galaxy Watch BLE • Прямой импорт/экспорт данных
            </p>
          </div>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'metrics'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Метрики
          </button>
          <button
            onClick={() => setActiveTab('bluetooth')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'bluetooth'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5" />
            Пульсометр (BLE)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'manual'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Калибровка
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {importMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs text-center font-medium">
              {importMessage}
            </div>
          )}

          {activeTab === 'metrics' && (
            <>
              {/* 4 Health Metrics Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-semibold">Шаги сегодня</span>
                    <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-black text-white font-mono">{data.dailySteps.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Активность</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-semibold">Пульс</span>
                    <Heart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  </div>
                  <div className="text-xl font-black text-white font-mono">
                    {liveBpm || data.restingHeartRate} <span className="text-xs font-sans text-slate-400">уд/мин</span>
                  </div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">
                    {liveBpm ? '⚡ Live BLE' : 'Покой'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-semibold">Сон</span>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-xl font-black text-white font-mono">{data.sleepHours} <span className="text-xs font-sans text-slate-400">ч</span></div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Фаза регенерации</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-semibold">Готовность связок</span>
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-black text-cyan-400 font-mono">{data.recoveryScore}%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">PNF-адаптация</div>
                </div>
              </div>

              {/* Import & Export File Options */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  Импорт файла из Samsung Health / Health Connect
                </div>
                <p className="text-[11px] text-slate-400">
                  Экспортируй данные из Samsung Health / Google Fit и загрузи сюда JSON или CSV:
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,.csv,.txt"
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" /> Загрузить файл
                  </button>
                  <button
                    onClick={handleExportData}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Экспорт (.json)
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bluetooth' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
                  <Bluetooth className={`w-7 h-7 ${isBluetoothConnecting ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {bluetoothDevice ? `Подключено: ${bluetoothDevice}` : 'Прямое подключение к часам/пульсометру'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Поддерживаются Samsung Galaxy Watch, Polar, Garmin, Xiaomi Band и нагрудные датчики пульса по BLE.
                  </p>
                </div>

                {liveBpm && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-400 text-lg font-black font-mono flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 fill-current animate-ping" />
                    {liveBpm} BPM (Прямой поток в реальном времени)
                  </div>
                )}

                <button
                  onClick={handleConnectBluetooth}
                  disabled={isBluetoothConnecting}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Bluetooth className="w-4 h-4" />
                  {isBluetoothConnecting ? 'Поиск Bluetooth-устройств...' : 'Поиск Galaxy Watch / Пульсометра'}
                </button>
              </div>

              {bluetoothError && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bluetoothError}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Шаги за день:</span>
                  <span className="font-bold font-mono text-cyan-400">{manualSteps.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={manualSteps}
                  onChange={(e) => setManualSteps(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Пульс в покое (BPM):</span>
                  <span className="font-bold font-mono text-rose-400">{manualHr}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={manualHr}
                  onChange={(e) => setManualHr(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Длительность сна (часы):</span>
                  <span className="font-bold font-mono text-indigo-400">{manualSleep} ч</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.5"
                  value={manualSleep}
                  onChange={(e) => setManualSleep(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Индекс готовности связок (%):</span>
                  <span className="font-bold font-mono text-emerald-400">{manualRecovery}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={manualRecovery}
                  onChange={(e) => setManualRecovery(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <button
                onClick={handleSaveManual}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider transition-all shadow-md shadow-cyan-500/20"
              >
                Сохранить калибровку
              </button>
            </div>
          )}
        </div>

        {exportMessage && (
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs text-center font-medium">
            {exportMessage}
          </div>
        )}
      </motion.div>
    </div>
  );
};
