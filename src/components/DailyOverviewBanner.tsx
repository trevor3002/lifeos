import React from 'react';
import { formatDatePretty, getTodayString } from '../utils/dateUtils';
import { MOOD_META } from '../utils/domainColors';
import { JournalEntry } from '../types';
import { CheckCircle2, Flame, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

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

  // SVG circular progress calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dailyScore / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl mb-6">
      {/* Background ambient accents */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Date & Headline */}
        <div className="space-y-1.5 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
              Today's Life Pulse
            </span>
            <span className="text-xs text-slate-400">{dateFormatted}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Daily Execution &amp; Mindful Alignment
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {dailyScore === 100
              ? 'Outstanding alignment today! All tasks, daily habits, and reflections completed.'
              : dailyScore >= 70
              ? 'Great momentum! Sustain your deep focus blocks and log your evening gratitude.'
              : 'Small consistent actions compound. Pick the next priority task to build flow.'}
          </p>
        </div>

        {/* Middle/Right: Score Ring & 3 Metric Pillars */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 w-full lg:w-auto">
          {/* Circular Score Gauge */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 shadow-inner">
            <div className="relative flex items-center justify-center">
              <svg className="w-18 h-18 -rotate-90 transform">
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="text-slate-800"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="text-indigo-500 transition-all duration-700 ease-out"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-base font-bold text-white leading-none">{dailyScore}%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Score</span>
              </div>
            </div>
            <div className="pr-1 text-left">
              <div className="text-xs font-semibold text-slate-200">Life OS Index</div>
              <div className="text-[11px] text-slate-400">Holistic balance</div>
            </div>
          </div>

          {/* 3 Pillars Summary Grid */}
          <div className="grid grid-cols-3 gap-2.5 flex-1 sm:w-80">
            {/* 1. Tasks Pillar */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-medium uppercase tracking-wider">Tasks</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-white">{tasksCompleted}</span>
                <span className="text-[10px] text-slate-500">/ {tasksTotal}</span>
              </div>
              <div className="mt-1.5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 2. Habits Pillar */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-medium uppercase tracking-wider">Habits</span>
                <Flame className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-white">{habitsCompleted}</span>
                <span className="text-[10px] text-slate-500">/ {habitsTotal}</span>
              </div>
              <div className="mt-1.5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all duration-500"
                  style={{ width: `${habitsTotal > 0 ? (habitsCompleted / habitsTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* 3. Journal Pillar */}
            <div
              onClick={todayJournal ? onOpenDailyReview : onQuickLogJournal}
              className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 transition group"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-medium uppercase tracking-wider">Journal</span>
                <BookOpen className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition" />
              </div>
              <div>
                {todayJournal ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                      Logged {MOOD_META[todayJournal.mood]?.icon}
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] font-medium text-indigo-300 group-hover:underline flex items-center gap-0.5">
                    + Log today
                  </div>
                )}
              </div>
              <div className="mt-1.5 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${todayJournal ? 'bg-pink-500 w-full' : 'bg-slate-700 w-0'}`}
                />
              </div>
            </div>
          </div>

          {/* Quick Synthesis Button */}
          <button
            id="daily-synthesis-btn"
            onClick={onOpenDailyReview}
            className="flex sm:flex-col items-center justify-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 p-3 text-xs font-semibold transition shrink-0 group active:scale-95"
            title="Open unified daily synthesis review"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition" />
            <span className="text-[11px]">Synthesis</span>
            <ArrowRight className="w-3 h-3 text-indigo-400 hidden sm:block mt-0.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
