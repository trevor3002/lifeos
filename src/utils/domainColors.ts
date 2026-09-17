import { LifeDomain, Priority, JournalMood } from '../types';

export const DOMAIN_META: Record<
  LifeDomain,
  { label: string; badgeClass: string; borderClass: string; dotClass: string }
> = {
  work: {
    label: 'Work',
    badgeClass: 'bg-zinc-800/80 text-zinc-200 border-zinc-700/70',
    borderClass: 'border-zinc-700',
    dotClass: 'bg-zinc-300',
  },
  personal: {
    label: 'Personal',
    badgeClass: 'bg-orange-950/40 text-orange-300 border-orange-500/30',
    borderClass: 'border-orange-500/40',
    dotClass: 'bg-orange-400',
  },
  health: {
    label: 'Health',
    badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
    borderClass: 'border-emerald-500/40',
    dotClass: 'bg-emerald-400',
  },
  learning: {
    label: 'Learning',
    badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
    borderClass: 'border-amber-500/40',
    dotClass: 'bg-amber-400',
  },
  finance: {
    label: 'Finance',
    badgeClass: 'bg-teal-950/40 text-teal-300 border-teal-500/30',
    borderClass: 'border-teal-500/40',
    dotClass: 'bg-teal-400',
  },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; badgeClass: string }
> = {
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-rose-950/50 text-rose-300 border border-rose-500/40',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-amber-950/50 text-amber-300 border border-amber-500/40',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-zinc-800/80 text-zinc-300 border border-zinc-700',
  },
  low: {
    label: 'Low',
    badgeClass: 'bg-zinc-900 text-zinc-400 border border-zinc-800',
  },
};

export const MOOD_META: Record<
  JournalMood,
  { label: string; icon: string; colorClass: string }
> = {
  energized: {
    label: 'Energized',
    icon: '⚡',
    colorClass: 'text-amber-300 bg-amber-950/30 border-amber-500/30',
  },
  calm: {
    label: 'Calm',
    icon: '🌿',
    colorClass: 'text-emerald-300 bg-emerald-950/30 border-emerald-500/30',
  },
  focused: {
    label: 'Focused',
    icon: '🎯',
    colorClass: 'text-zinc-200 bg-zinc-800/50 border-zinc-700',
  },
  reflective: {
    label: 'Reflective',
    icon: '🌙',
    colorClass: 'text-teal-300 bg-teal-950/30 border-teal-500/30',
  },
  tired: {
    label: 'Tired / Low',
    icon: '☕',
    colorClass: 'text-zinc-400 bg-zinc-900 border-zinc-800',
  },
};
