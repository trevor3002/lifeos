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

  const handleShareSummary = () => {
    const summaryText = `Life OS Daily Review (${formatDatePretty(todayStr)})
Score: ${dailyScore}%
- Tasks Done: ${tasksCompleted.length}/${tasksCompleted.length + tasksPending.length}
- Habits Maintained: ${completedHabits.length}/${habits.length}
- Reflection: ${todayJournal ? `Logged (${todayJournal.title})` : 'Pending'}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      alert('Daily Life OS summary copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#24282f] bg-[#121316] p-5 sm:p-6 shadow-2xl text-zinc-100">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1 rounded-full bg-zinc-700 mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1f2228]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-amber-400 border border-zinc-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100">Daily Life OS Synthesis</h3>
              <p className="text-xs text-zinc-400 font-mono">{formatDatePretty(todayStr)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareSummary}
              className="flex items-center gap-1 rounded-lg border border-[#24282f] bg-[#0c0d10] px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white transition min-h-[36px]"
              title="Copy text summary"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Daily Score & Grade Banner */}
        <div className="mt-4 rounded-xl border border-[#2e333b] bg-[#16181d] p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Holistic Daily Execution
            </span>
            <div className="text-2xl font-bold font-mono text-zinc-100 flex items-center gap-2">
              <span>{dailyScore}% Alignment</span>
              {dailyScore >= 80 && <Trophy className="w-5 h-5 text-amber-400" />}
            </div>
            <p className="text-xs text-zinc-300">
              {dailyScore >= 85
                ? 'Disciplined focus and deep routine harmony sustained today.'
                : dailyScore >= 60
                ? 'Strong daily momentum across your key priorities.'
                : 'Complete 1 remaining action item and evening wind-down.'}
            </p>
          </div>
        </div>

        {/* 3 Pillars Deep Dive */}
        <div className="mt-4 space-y-3.5">
          {/* Pillar 1: Tasks */}
          <div className="rounded-xl border border-[#24282f] bg-[#0c0d10] p-3.5">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Tasks Breakdown ({tasksCompleted.length} / {tasksCompleted.length + tasksPending.length} Complete)
            </h4>
            {tasksCompleted.length > 0 && (
              <div className="space-y-1 mb-2">
                <div className="text-[10px] font-mono uppercase text-emerald-400">Completed:</div>
                {tasksCompleted.map((t) => (
                  <div key={t.id} className="text-xs text-zinc-300 flex items-center gap-1.5 pl-2">
                    <span className="text-emerald-400">✓</span> {t.title}
                  </div>
                ))}
              </div>
            )}
            {tasksPending.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Pending:</div>
                {tasksPending.map((t) => (
                  <div key={t.id} className="text-xs text-zinc-400 flex items-center gap-1.5 pl-2">
                    <span className="text-zinc-600">•</span> {t.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pillar 2: Habits */}
          <div className="rounded-xl border border-[#24282f] bg-[#0c0d10] p-3.5">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Protocols Maintained ({completedHabits.length} / {habits.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {habits.map((h) => {
                const done = !!h.completions[todayStr];
                return (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between rounded-lg p-2 text-xs border ${
                      done
                        ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                        : 'border-[#24282f] bg-[#14161a] text-zinc-400'
                    }`}
                  >
                    <span>{h.name}</span>
                    <span className="font-mono font-semibold">{done ? '✓ Maintained' : 'Pending'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pillar 3: Journal */}
          <div className="rounded-xl border border-[#24282f] bg-[#0c0d10] p-3.5">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Mindful Reflection &amp; State
            </h4>
            {todayJournal ? (
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-100">{todayJournal.title}</span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    State: {MOOD_META[todayJournal.mood]?.icon} {MOOD_META[todayJournal.mood]?.label}
                  </span>
                </div>
                <p className="line-clamp-3 text-zinc-400 italic">"{todayJournal.content}"</p>
                {todayJournal.gratitude && todayJournal.gratitude.length > 0 && (
                  <div className="text-[11px] text-zinc-400">
                    <strong className="text-zinc-300">Gratitudes:</strong> {todayJournal.gratitude.join(' • ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs text-zinc-400">No journal reflection captured for today yet.</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuickJournal();
                  }}
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 text-xs font-bold min-h-[36px]"
                >
                  Log Reflection
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 text-xs font-semibold transition min-h-[40px]"
          >
            Close Synthesis
          </button>
        </div>
      </div>
    </div>
  );
};
