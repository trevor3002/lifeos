import React, { useState } from 'react';
import { Habit, LifeDomain, HabitTimeOfDay } from '../types';
import { DOMAIN_META } from '../utils/domainColors';
import { getRecentDays, getTodayString } from '../utils/dateUtils';
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
  evening: <Moon className="w-3 h-3 text-indigo-400" />,
  anytime: <Sparkles className="w-3 h-3 text-teal-400" />,
};

const COLOR_OPTIONS = [
  '#10b981', // emerald
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
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

  const todayCompletedCount = habits.filter((h) => h.completions[todayStr]).length;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-teal-400" />
              Habits &amp; Daily Rituals
            </h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
              {todayCompletedCount}/{habits.length} today
            </span>
          </div>
          <p className="text-xs text-slate-400">Consistent micro-actions compounding daily</p>
        </div>

        {/* Time of day filters & Add button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            {(['all', 'morning', 'afternoon', 'evening'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition ${
                  timeFilter === t
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateHabit}
          className="mt-4 rounded-xl border border-teal-500/30 bg-slate-950/80 p-4 space-y-3.5 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Create Daily Habit</h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          <div>
            <input
              type="text"
              required
              placeholder="Habit name (e.g. 10m Morning Breathwork & Meditation)..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Domain */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Domain</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as LifeDomain)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-teal-500 focus:outline-none"
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
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Time of Day</label>
              <select
                value={newTimeOfDay}
                onChange={(e) => setNewTimeOfDay(e.target.value as HabitTimeOfDay)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>

            {/* Target Frequency */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Days / Week</label>
              <select
                value={newTargetDays}
                onChange={(e) => setNewTargetDays(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-teal-500 focus:outline-none"
              >
                <option value={7}>7 days (Every day)</option>
                <option value={5}>5 days (Weekdays)</option>
                <option value={4}>4 days</option>
                <option value={3}>3 days</option>
              </select>
            </div>

            {/* Color Accent */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Color Theme</label>
              <div className="flex items-center gap-1.5 pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`h-6 w-6 rounded-full border-2 transition ${
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
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 hover:bg-teal-500 text-white px-4 py-1.5 text-xs font-semibold shadow-sm"
            >
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Habits Grid */}
      <div className="mt-4 space-y-3">
        {/* Days Header */}
        <div className="flex items-center justify-between px-3 text-slate-400 text-xs font-semibold">
          <span>Habit Details</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {recentDays.map((day) => (
              <div
                key={day.dateStr}
                className={`w-7 sm:w-8 text-center text-[10px] sm:text-xs uppercase font-medium ${
                  day.isToday ? 'text-teal-400 font-bold' : 'text-slate-500'
                }`}
              >
                {day.dayLabel}
              </div>
            ))}
            <div className="w-16 text-right text-[10px] uppercase text-slate-500 hidden sm:block">
              Streak
            </div>
          </div>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <Flame className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No habits in this view</p>
            <p className="text-xs text-slate-500 mt-1">
              Build a new habit to start your daily consistency streak.
            </p>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const domainMeta = DOMAIN_META[habit.category] || DOMAIN_META.health;
            const isDoneToday = !!habit.completions[todayStr];

            return (
              <div
                key={habit.id}
                id={`habit-row-${habit.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-slate-700 transition"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-semibold text-white tracking-tight truncate">
                        {habit.name}
                      </h4>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 capitalize">
                        {TIME_ICONS[habit.timeOfDay]}
                        <span className="hidden xs:inline">{habit.timeOfDay}</span>
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border ${domainMeta.badgeClass}`}>
                        {domainMeta.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: 7-Day interactive dots & Streak */}
                <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {recentDays.map((day) => {
                      const completed = !!habit.completions[day.dateStr];
                      const isToday = day.isToday;

                      return (
                        <button
                          key={day.dateStr}
                          onClick={() => onToggleHabitDate(habit.id, day.dateStr)}
                          className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border transition-all active:scale-90 ${
                            completed
                              ? 'border-teal-500/50 bg-teal-500/20 text-teal-300 shadow-sm shadow-teal-500/20'
                              : isToday
                              ? 'border-slate-700 bg-slate-900 text-slate-600 hover:border-teal-500/40 hover:text-teal-400'
                              : 'border-slate-800/80 bg-slate-950 text-slate-700 hover:border-slate-700'
                          }`}
                          title={`${habit.name} on ${day.dateStr}: ${completed ? 'Completed' : 'Pending'}`}
                        >
                          {completed ? (
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                          ) : (
                            <span className="text-[9px] text-slate-600">•</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Streak and Record */}
                  <div className="flex items-center gap-2 pl-2">
                    <div className="w-16 text-right">
                      <div className="flex items-center justify-end gap-1 text-xs font-bold text-amber-400">
                        <Flame className={`w-3.5 h-3.5 ${isDoneToday ? 'fill-amber-400' : ''}`} />
                        <span>{habit.currentStreak}d</span>
                      </div>
                      <div className="flex items-center justify-end gap-0.5 text-[10px] text-slate-500">
                        <Trophy className="w-2.5 h-2.5" />
                        <span>{habit.bestStreak}d</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition"
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
