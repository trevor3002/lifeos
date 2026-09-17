import React, { useState } from 'react';
import { Habit, LifeDomain, HabitTimeOfDay } from '../types';
import { DOMAIN_META } from '../utils/domainColors';
import { getRecentDays, getTodayString } from '../utils/dateUtils';
import confetti from 'canvas-confetti';
import {
  Flame,
  Plus,
  Trash2,
  Trophy,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Check,
} from 'lucide-react';

interface HabitSectionProps {
  habits: Habit[];
  onAddHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'createdAt' | 'completions'>) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
  onToggleHabitDate: (habitId: string, dateStr: string) => void;
  selectedDomain: LifeDomain | 'all';
  searchQuery: string;
}

const TIME_ICONS: Record<HabitTimeOfDay, React.ReactNode> = {
  morning: <Sun className="w-3 h-3 text-amber-400" />,
  afternoon: <Sunset className="w-3 h-3 text-orange-400" />,
  evening: <Moon className="w-3 h-3 text-teal-400" />,
  anytime: <Sparkles className="w-3 h-3 text-emerald-400" />,
};

// Pure architectural palette - zero purple
const COLOR_OPTIONS = [
  '#10b981', // forest emerald
  '#d97706', // warm bronze
  '#ea580c', // terracotta
  '#14b8a6', // nordic teal
  '#71717a', // slate graphite
  '#f59e0b', // amber ochre
];

export const HabitSection: React.FC<HabitSectionProps> = ({
  habits,
  onAddHabit,
  onDeleteHabit,
  onToggleHabitDate,
  selectedDomain,
  searchQuery,
}) => {
  const [timeFilter, setTimeFilter] = useState<HabitTimeOfDay | 'all'>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New habit state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<LifeDomain>('health');
  const [newTimeOfDay, setNewTimeOfDay] = useState<HabitTimeOfDay>('morning');
  const [newTargetDays, setNewTargetDays] = useState(7);
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);

  const recentDays = getRecentDays(7);
  const todayStr = getTodayString();

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    if (selectedDomain !== 'all' && h.category !== selectedDomain) return false;
    if (timeFilter !== 'all' && h.timeOfDay !== timeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!h.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddHabit({
      name: newName.trim(),
      category: newCategory,
      timeOfDay: newTimeOfDay,
      targetDaysPerWeek: newTargetDays,
      color: newColor,
    });

    setNewName('');
    setIsAdding(false);
  };

  const handleHabitToggle = (habitId: string, dateStr: string) => {
    onToggleHabitDate(habitId, dateStr);

    // Check if toggling today's date completes all habits
    if (dateStr === todayStr) {
      const remainingBefore = habits.filter(
        (h) => h.id !== habitId && !(h.completions && h.completions[todayStr])
      ).length;
      const willBeDone = !(habits.find((h) => h.id === habitId)?.completions?.[todayStr]);

      if (remainingBefore === 0 && willBeDone) {
        // Confetti celebration with warm amber & emerald particles
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#f59e0b', '#10b981', '#d97706', '#ffffff'],
          });
        } catch {
          // ignore if canvas unavailable
        }
      }
    }
  };

  const todayCompletedCount = habits.filter((h) => h?.completions && h.completions[todayStr]).length;

  return (
    <section className="rounded-2xl border border-[#24282f] bg-[#121316] p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#1f2228]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              Daily Habits &amp; Rituals
            </h3>
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
              {todayCompletedCount}/{habits.length} Today
            </span>
          </div>
          <p className="text-xs text-zinc-400">Consistent discipline tracked across rolling 7-day cycles</p>
        </div>

        {/* Time of Day Filter & Add Button */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="flex items-center rounded-lg bg-[#0c0d10] p-1 border border-[#24282f] text-xs">
            {(['all', 'morning', 'afternoon', 'evening'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition min-h-[28px] ${
                  timeFilter === t
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 text-xs font-bold shadow-sm transition active:scale-95 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Add Habit Expandable Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateHabit}
          className="mt-4 rounded-xl border border-amber-500/30 bg-[#0c0d10] p-4 space-y-3.5 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              New Habit Protocol
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
          </div>

          <div>
            <input
              type="text"
              required
              placeholder="Habit name (e.g. 15m Morning Sun & Breathwork)..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Domain */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Domain</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as LifeDomain)}
                className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none min-h-[38px]"
              >
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="learning">Learning</option>
                <option value="finance">Finance</option>
              </select>
            </div>

            {/* Time of Day */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Time</label>
              <select
                value={newTimeOfDay}
                onChange={(e) => setNewTimeOfDay(e.target.value as HabitTimeOfDay)}
                className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none min-h-[38px]"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            {/* Target Frequency */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Days / Week</label>
              <select
                value={newTargetDays}
                onChange={(e) => setNewTargetDays(Number(e.target.value))}
                className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none min-h-[38px]"
              >
                <option value={7}>7 days (Daily)</option>
                <option value={5}>5 days (Weekdays)</option>
                <option value={4}>4 days</option>
                <option value={3}>3 days</option>
              </select>
            </div>

            {/* Color Accent */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Accent</label>
              <div className="flex items-center gap-1.5 pt-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`h-5 w-5 rounded-full border-2 transition ${
                      newColor === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-1.5 text-xs shadow-sm"
            >
              Save Protocol
            </button>
          </div>
        </form>
      )}

      {/* Habits Grid */}
      <div className="mt-3.5 space-y-2">
        {/* Days Header */}
        <div className="flex items-center justify-between px-2 text-zinc-500 text-xs font-mono">
          <span className="text-[11px] uppercase tracking-wider">Protocol</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {recentDays.map((day) => (
              <div
                key={day.dateStr}
                className={`w-7 sm:w-8 text-center text-[10px] sm:text-xs uppercase font-medium ${
                  day.isToday ? 'text-amber-400 font-bold' : 'text-zinc-500'
                }`}
              >
                {day.dayLabel}
              </div>
            ))}
            <div className="w-14 text-right text-[10px] uppercase text-zinc-500 hidden sm:block">
              Streak
            </div>
          </div>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#24282f] p-8 text-center">
            <Flame className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-300">No habits found</p>
            <p className="text-xs text-zinc-500 mt-1">
              Add a new routine above to build your daily momentum.
            </p>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const domainMeta = DOMAIN_META[habit.category] || DOMAIN_META.health;
            const completions = habit.completions || {};
            const isDoneToday = !!completions[todayStr];

            return (
              <div
                key={habit.id}
                id={`habit-row-${habit.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#24282f] bg-[#16181d] p-3 hover:border-[#2e333b] transition"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-semibold text-zinc-100 tracking-tight truncate">
                        {habit.name}
                      </h4>
                      <span className="flex items-center gap-1 text-[10px] text-zinc-400 capitalize font-mono">
                        {TIME_ICONS[habit.timeOfDay]}
                        <span className="hidden xs:inline">{habit.timeOfDay}</span>
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${domainMeta.badgeClass}`}>
                        {domainMeta.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: 7-Day interactive touch targets & Streak */}
                <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2 pt-1 sm:pt-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {recentDays.map((day) => {
                      const completed = !!completions[day.dateStr];
                      const isToday = day.isToday;

                      return (
                        <button
                          key={day.dateStr}
                          onClick={() => handleHabitToggle(habit.id, day.dateStr)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all active:scale-90 min-h-[34px] min-w-[34px] cursor-pointer ${
                            completed
                              ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300'
                              : isToday
                              ? 'border-zinc-700 bg-[#0c0d10] text-zinc-600 hover:border-amber-500/40 hover:text-amber-400'
                              : 'border-[#24282f] bg-[#0c0d10]/50 text-zinc-700 hover:border-zinc-600'
                          }`}
                          title={`${habit.name} on ${day.dateStr}: ${completed ? 'Completed' : 'Pending'}`}
                        >
                          {completed ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="text-[10px] text-zinc-600">•</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Streak & Delete */}
                  <div className="flex items-center gap-1.5 pl-1.5">
                    <div className="w-14 text-right">
                      <div className="flex items-center justify-end gap-1 text-xs font-bold text-amber-400 font-mono">
                        <Flame className={`w-3.5 h-3.5 ${isDoneToday ? 'fill-amber-400' : ''}`} />
                        <span>{habit.currentStreak}d</span>
                      </div>
                      <div className="flex items-center justify-end gap-0.5 text-[10px] text-zinc-500 font-mono">
                        <Trophy className="w-2.5 h-2.5" />
                        <span>{habit.bestStreak}d</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="opacity-80 sm:opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400 transition min-h-[34px] min-w-[34px] flex items-center justify-center"
                      title="Delete habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
