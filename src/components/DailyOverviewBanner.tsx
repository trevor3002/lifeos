import React from 'react';
import { JournalEntry } from '../types';
import { formatDatePretty, getTodayString } from '../utils/dateUtils';
import {
  CheckCircle2,
  Flame,
  BookOpen,
  CalendarCheck,
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
    <section className="mb-4 sm:mb-6 rounded-2xl border border-[#24282f] bg-[#121316] p-3.5 sm:p-5 transition">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-5">
        {/* Left: Date, Pulse, and Metric Gauge */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Circular Gauge */}
          <div className="relative flex h-18 w-18 sm:h-22 sm:w-22 shrink-0 items-center justify-center">
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
              <span className="font-mono text-base sm:text-xl font-bold tracking-tight text-zinc-100">
                {dailyScore}%
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-widest text-zinc-500">INDEX</span>
            </div>
          </div>

          {/* Heading & Subtext */}
          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                {dateFormatted}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 border border-[#2e333b] px-1.5 py-0.2 text-[9px] sm:text-[10px] text-zinc-400 font-mono">
                <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                <span>Active</span>
              </span>
            </div>
            <h2 className="text-base sm:text-2xl font-bold tracking-tight text-zinc-100 truncate">
              {dailyScore >= 80
                ? 'High Alignment'
                : dailyScore >= 50
                ? 'Steady Momentum'
                : 'Daily Rituals'}
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 max-w-md hidden sm:block">
              Daily metrics across tasks, sustained habits, and mindful reflection.
            </p>
          </div>
        </div>

        {/* Right: The 3 Core Pillars & Action (Mobile-First 3-Col Grid + Action) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2.5">
            {/* Pillar 1: Tasks */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-3 rounded-xl border border-[#24282f] bg-[#16181d] px-2 sm:px-3.5 py-2 text-center sm:text-left">
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Tasks</div>
                  <div className="text-xs font-semibold text-zinc-200">
                    {tasksCompleted} <span className="text-zinc-600">/</span> {tasksTotal}
                  </div>
                </div>
              </div>
              <div className="sm:hidden text-center">
                <div className="text-[9px] font-mono uppercase text-zinc-500">Tasks</div>
                <div className="text-[11px] font-mono font-bold text-zinc-200">
                  {tasksCompleted}/{tasksTotal}
                </div>
              </div>
              <span className="hidden sm:inline font-mono text-[11px] font-semibold text-zinc-400">
                {tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0}%
              </span>
            </div>

            {/* Pillar 2: Habits */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-3 rounded-xl border border-[#24282f] bg-[#16181d] px-2 sm:px-3.5 py-2 text-center sm:text-left">
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-500/20">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Habits</div>
                  <div className="text-xs font-semibold text-zinc-200">
                    {habitsCompleted} <span className="text-zinc-600">/</span> {habitsTotal}
                  </div>
                </div>
              </div>
              <div className="sm:hidden text-center">
                <div className="text-[9px] font-mono uppercase text-zinc-500">Habits</div>
                <div className="text-[11px] font-mono font-bold text-emerald-300">
                  {habitsCompleted}/{habitsTotal}
                </div>
              </div>
              <span className="hidden sm:inline font-mono text-[11px] font-semibold text-emerald-400">
                {habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0}%
              </span>
            </div>

            {/* Pillar 3: Journal */}
            <div
              onClick={todayJournal ? onOpenDailyReview : onQuickLogJournal}
              className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-3 rounded-xl border border-[#24282f] bg-[#16181d] px-2 sm:px-3.5 py-2 cursor-pointer hover:border-amber-500/40 transition group text-center sm:text-left active:scale-95"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-amber-950/50 text-amber-400 border border-amber-500/20">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] font-mono uppercase text-zinc-500">Journal</div>
                  <div className="text-xs font-semibold text-zinc-200">
                    {todayJournal ? 'Reflected' : 'Pending'}
                  </div>
                </div>
              </div>
              <div className="sm:hidden text-center">
                <div className="text-[9px] font-mono uppercase text-zinc-500">Journal</div>
                <div className="text-[11px] font-semibold text-amber-300">
                  {todayJournal ? '✓ Done' : '+ Log'}
                </div>
              </div>
              <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition" />
            </div>
          </div>

          {/* Daily Review Action Button */}
          <button
            onClick={onOpenDailyReview}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 px-3.5 py-2 sm:py-2.5 text-xs font-semibold shadow-sm transition active:scale-95 min-h-[40px] sm:min-h-[44px] cursor-pointer"
            title="Open Daily Review (Shortcut: R)"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Review</span>
          </button>
        </div>
      </div>
    </section>
  );
};
