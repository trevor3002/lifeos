import React from 'react';
import { Task, Habit, JournalEntry } from '../types';
import { formatDatePretty, getTodayString } from '../utils/dateUtils';
import { MOOD_META } from '../utils/domainColors';
import {
  X,
  Sparkles,
  CheckCircle2,
  Flame,
  BookOpen,
  Trophy,
  Share2,
} from 'lucide-react';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasksCompleted: Task[];
  tasksPending: Task[];
  habits: Habit[];
  todayJournal?: JournalEntry;
  dailyScore: number;
  onOpenQuickJournal: () => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({
  isOpen,
  onClose,
  tasksCompleted,
  tasksPending,
  habits,
  todayJournal,
  dailyScore,
  onOpenQuickJournal,
}) => {
  if (!isOpen) return null;

  const todayStr = getTodayString();
  const completedHabits = habits.filter((h) => h.completions[todayStr]);
  const pendingHabits = habits.filter((h) => !h.completions[todayStr]);

  const handleShareSummary = () => {
    const summaryText = `Life OS Daily Review (${formatDatePretty(todayStr)})
Score: ${dailyScore}%
- Tasks Done: ${tasksCompleted.length}/${tasksCompleted.length + tasksPending.length}
- Habits Maintained: ${completedHabits.length}/${habits.length}
- Reflection: ${todayJournal ? `Logged (${todayJournal.title})` : 'Pending'}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      alert('Daily summary copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Daily Life OS Synthesis</h3>
              <p className="text-xs text-slate-400">{formatDatePretty(todayStr)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareSummary}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition"
              title="Copy text summary"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Daily Score & Grade Banner */}
        <div className="mt-4 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-emerald-950/40 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
              Today's Holistic Performance
            </span>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{dailyScore}% Alignment</span>
              {dailyScore >= 80 && <Trophy className="w-6 h-6 text-amber-400" />}
            </div>
            <p className="text-xs text-slate-300">
              {dailyScore >= 90
                ? 'Prime focus and complete daily routine harmony achieved!'
                : dailyScore >= 60
                ? 'Strong daily traction across your key domains.'
                : 'Focus on finishing 1 high-priority task and completing evening habits.'}
            </p>
          </div>
        </div>

        {/* 3 Pillars Deep Dive */}
        <div className="mt-5 space-y-4">
          {/* Pillar 1: Tasks */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Tasks Breakdown ({tasksCompleted.length} of {tasksCompleted.length + tasksPending.length} Completed)
              </h4>
            </div>
            {tasksCompleted.length > 0 && (
              <div className="space-y-1 mb-3">
                <div className="text-[11px] font-semibold text-emerald-400">Completed:</div>
                {tasksCompleted.map((t) => (
                  <div key={t.id} className="text-xs text-slate-300 flex items-center gap-1.5 pl-2">
                    <span className="text-emerald-400">✓</span> {t.title}
                  </div>
                ))}
              </div>
            )}
            {tasksPending.length > 0 && (
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-amber-400">Pending:</div>
                {tasksPending.map((t) => (
                  <div key={t.id} className="text-xs text-slate-400 flex items-center gap-1.5 pl-2">
                    <span className="text-slate-600">•</span> {t.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pillar 2: Habits */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                Habits Maintained ({completedHabits.length} of {habits.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {habits.map((h) => {
                const done = !!h.completions[todayStr];
                return (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between rounded-lg p-2 text-xs border ${
                      done
                        ? 'border-teal-500/30 bg-teal-950/20 text-teal-200'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <span>{h.name}</span>
                    <span className="font-bold">{done ? '✓ Done' : 'Pending'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pillar 3: Journal */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Daily Reflection &amp; Mindset
              </h4>
            </div>
            {todayJournal ? (
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{todayJournal.title}</span>
                  <span className="text-[11px] text-pink-400">
                    Mood: {MOOD_META[todayJournal.mood]?.icon} {MOOD_META[todayJournal.mood]?.label}
                  </span>
                </div>
                <p className="line-clamp-3 text-slate-400 italic">"{todayJournal.content}"</p>
                {todayJournal.gratitude && todayJournal.gratitude.length > 0 && (
                  <div className="text-[11px] text-pink-300">
                    <strong>Gratitudes:</strong> {todayJournal.gratitude.join(' • ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs text-slate-400">You haven't written today's reflection yet.</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuickJournal();
                  }}
                  className="rounded-lg bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 text-xs font-medium"
                >
                  Log Reflection Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 text-xs font-semibold transition"
          >
            Close Synthesis
          </button>
        </div>
      </div>
    </div>
  );
};
