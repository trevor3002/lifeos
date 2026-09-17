import React from 'react';
import { JournalEntry } from '../types';
import { formatDatePretty, getTodayString } from '../utils/dateUtils';
import {
  CheckCircle2,
  Flame,
  BookOpen,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface DailyOverviewBannerProps {
  dailyScore: number;
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  todayJournal?: JournalEntry;
  onOpenDailyReview: () => void;
  onQuickLogJournal: () => void;
}

export const DailyOverviewBanner: React.FC<DailyOverviewBannerProps> = ({
  dailyScore,
  tasksCompleted,
  tasksTotal,
  habitsCompleted,
  habitsTotal,
  todayJournal,
  onOpenDailyReview,
  onQuickLogJournal,
}) => {
  const todayStr = getTodayString();
  const dateFormatted = formatDatePretty(todayStr);

  // SVG Gauge calculations
  const radius = 34;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (dailyScore / 100) * circumference;

  return (
    <section className="mb-6 rounded-2xl border border-[#24282f] bg-[#121316] p-4 sm:p-6 transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Date, Pulse, and Metric Gauge */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Circular Architectural Gauge */}
          <div className="relative flex h-20 w-20 sm:h-22 sm:w-22 shrink-0 items-center justify-center">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="rotate-[-90deg] transform"
            >
              <circle
                stroke="#1f2228"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={dailyScore >= 75 ? '#10b981' : dailyScore >= 40 ? '#f59e0b' : '#71717a'}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-lg sm:text-xl font-bold tracking-tight text-zinc-100">
                {dailyScore}%
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">INDEX</span>
            </div>
          </div>

          {/* Heading & Subtext */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                {dateFormatted}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 border border-[#2e333b] px-2 py-0.5 text-[10px] text-zinc-400 font-mono">
                <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                <span>Life Flow</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-100">
              {dailyScore >= 80
                ? 'High Peak Alignment'
                : dailyScore >= 50
                ? 'Steady Momentum'
                : 'Initiate Daily Rituals'}
            </h2>
            <p className="text-xs text-zinc-400 max-w-md hidden sm:block">
              Synthesized tracking across actionable tasks, sustained habits, and mindful journaling.
            </p>
          </div>
        </div>

        {/* Right: The 3 Core Pillars & Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Pillar 1: Tasks */}
          <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-[#24282f] bg-[#16181d] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Tasks</div>
                <div className="text-xs font-semibold text-zinc-200">
                  {tasksCompleted} <span className="text-zinc-600">/</span> {tasksTotal}
                </div>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-zinc-400">
              {tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0}%
            </span>
          </div>

          {/* Pillar 2: Habits */}
          <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-[#24282f] bg-[#16181d] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-500/20">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Habits</div>
                <div className="text-xs font-semibold text-zinc-200">
                  {habitsCompleted} <span className="text-zinc-600">/</span> {habitsTotal}
                </div>
              </div>
            </div>
            <span className="font-mono text-[11px] font-semibold text-emerald-400">
              {habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0}%
            </span>
          </div>

          {/* Pillar 3: Journal */}
          <div
            onClick={todayJournal ? onOpenDailyReview : onQuickLogJournal}
            className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-[#24282f] bg-[#16181d] px-3.5 py-2.5 cursor-pointer hover:border-amber-500/40 transition group"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-950/50 text-amber-400 border border-amber-500/20">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Journal</div>
                <div className="text-xs font-semibold text-zinc-200">
                  {todayJournal ? 'Reflected' : 'Pending'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition" />
          </div>

          {/* Synthesis Action Button */}
          <button
            onClick={onOpenDailyReview}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 px-4 py-2.5 text-xs font-semibold shadow-sm transition active:scale-95 min-h-[44px]"
            title="Open Daily Life OS Synthesis (Shortcut: R)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Synthesis</span>
          </button>
        </div>
      </div>
    </section>
  );
};
