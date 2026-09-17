import { LifeDomain, Priority, JournalMood } from '../types';

export const DOMAIN_META: Record<
  LifeDomain,
  { label: string; badgeClass: string; borderClass: string; bgClass: string; dotClass: string }
> = {
  work: {
    label: 'Work',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    borderClass: 'border-indigo-500/40',
    bgClass: 'bg-indigo-500',
    dotClass: 'bg-indigo-400',
  },
  personal: {
    label: 'Personal',
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    borderClass: 'border-pink-500/40',
    bgClass: 'bg-pink-500',
    dotClass: 'bg-pink-400',
  },
  health: {
    label: 'Health',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500/40',
    bgClass: 'bg-emerald-500',
    dotClass: 'bg-emerald-400',
  },
  learning: {
    label: 'Learning',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderClass: 'border-cyan-500/40',
    bgClass: 'bg-cyan-500',
    dotClass: 'bg-cyan-400',
  },
  finance: {
    label: 'Finance',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    bgClass: 'bg-amber-500',
    dotClass: 'bg-amber-400',
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; badgeClass: string }
> = {
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
  },
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-500/15 text-slate-400 border border-slate-700',
  },
};

export const MOOD_META: Record<
  JournalMood,
  { label: string; icon: string; colorClass: string }
> = {
  energized: {
    label: 'Energized',
    icon: '⚡',
    colorClass: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  },
  calm: {
    label: 'Calm',
    icon: '🌿',
    colorClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  },
  focused: {
    label: 'Focused',
    icon: '🎯',
    colorClass: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
  },
  reflective: {
    label: 'Reflective',
    icon: '🌙',
    colorClass: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  },
  tired: {
    label: 'Tired / Low',
    icon: '☕',
    colorClass: 'text-slate-400 bg-slate-400/10 border-slate-500/30',
  },
};
