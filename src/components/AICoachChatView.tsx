import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Flame,
  HelpCircle,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { soundFx } from '../utils/audio';
import { BLUE_LOCK_CHARACTERS } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';

interface AICoachChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  profile: UserProfile;
  isOnline: boolean;
}

export const AICoachChatView: React.FC<AICoachChatViewProps> = ({
  messages,
  onSendMessage,
  profile,
  isOnline,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    setInputText('');
    setIsLoading(true);
    soundFx.playStartChime();

    try {
      await onSendMessage(text);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Как быстрее сесть на продольный шпагат без травмы?',
    'Почему стопа дрожит при стойке с закрытыми глазами?',
    'Как интегрировать растяжку с моей футбольной тренировкой?',
    'У меня хрустит ТБС при раскрытии ног — что делать?',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      {/* Coach Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 mb-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <CharacterAvatar
            character={BLUE_LOCK_CHARACTERS.ego}
            size="md"
            className="shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                Джинпачи Эго (Jinpachi Ego AI)
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-md">
                Главный Тренер
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Бескомпромиссный анатомический разбор, техника, PNF протоколы и психология победы.
            </p>
          </div>
        </div>

        {!isOnline && (
          <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-lg">
            Офлайн Режим
          </span>
        )}
      </div>

      {/* Chat Messages Flow */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isCoach ? 'justify-start' : 'justify-end'}`}
            >
              {isCoach && (
                <CharacterAvatar
                  character={BLUE_LOCK_CHARACTERS.ego}
                  size="sm"
                  className="shrink-0 mt-1"
                />
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  isCoach
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                    : 'bg-cyan-500 text-slate-950 font-medium shadow-md shadow-cyan-500/20'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 text-right ${
                    isCoach ? 'text-slate-500' : 'text-slate-900/70 font-bold'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isCoach && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </motion.div>
          );
        })}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-cyan-400 font-semibold p-3 rounded-xl bg-slate-900/60 border border-slate-800 w-fit"
          >
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Тренер Эго анализирует твою кинетическую цепь...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="shrink-0 text-[11px] font-semibold text-slate-300 bg-slate-900 hover:bg-slate-850 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 px-3 py-1.5 rounded-full transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Message Input Form */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Спросить тренера о боли, технике шпагата или стабильности..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
        />
        <button
          id="btn-send-coach-message"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm disabled:opacity-40 shadow-lg shadow-cyan-500/25 transition-transform active:scale-95 flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Отправить</span>
        </button>
      </div>
    </div>
  );
};
