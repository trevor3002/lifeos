import React, { useState } from 'react';
import { JournalEntry, JournalMood, JournalTag, Task, Habit } from '../types';
import { MOOD_META } from '../utils/domainColors';
import { formatDatePretty, getTodayString } from '../utils/dateUtils';
import {
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  Heart,
  Tag,
  Zap,
  CheckCircle2,
  Flame,
} from 'lucide-react';

interface JournalSectionProps {
  journals: JournalEntry[];
  onAddJournal: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  onUpdateJournal: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteJournal: (id: string) => void;
  todayTasksCompleted: Task[];
  todayHabitsCompleted: Habit[];
  searchQuery: string;
}

const ALL_TAGS: JournalTag[] = ['reflection', 'gratitude', 'win', 'learning', 'idea', 'challenge'];

export const JournalSection: React.FC<JournalSectionProps> = ({
  journals,
  onAddJournal,
  onDeleteJournal,
  todayTasksCompleted,
  todayHabitsCompleted,
  searchQuery,
}) => {
  const today = getTodayString();
  const [isWriting, setIsWriting] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<JournalTag | 'all'>('all');

  // New journal entry form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalMood>('focused');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [selectedTags, setSelectedTags] = useState<JournalTag[]>(['reflection']);
  const [gratitudeInputs, setGratitudeInputs] = useState<string[]>(['', '', '']);
  const [attachedTasks, setAttachedTasks] = useState<string[]>([]);
  const [attachedHabitsCount, setAttachedHabitsCount] = useState<number>(0);

  // Filter journals
  const filteredJournals = journals.filter((j) => {
    if (selectedTagFilter !== 'all' && !j.tags.includes(selectedTagFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchContent = j.content.toLowerCase().includes(q);
      const matchGratitude = j.gratitude?.some((g) => g.toLowerCase().includes(q)) || false;
      if (!matchTitle && !matchContent && !matchGratitude) return false;
    }
    return true;
  });

  const handlePullDailyWins = () => {
    const taskTitles = todayTasksCompleted.map((t) => t.title);
    setAttachedTasks(taskTitles);
    setAttachedHabitsCount(todayHabitsCompleted.length);

    // Also enrich content with a brief summary block if empty or append
    const winsSnippet = `\n\n### Today's Completed Actions:\n${
      taskTitles.length > 0
        ? taskTitles.map((t) => `- [x] ${t}`).join('\n')
        : '- (No tasks marked completed yet)'
    }\n- Sustained ${todayHabitsCompleted.length} habits today!`;

    setContent((prev) => (prev ? prev + winsSnippet : winsSnippet.trim()));
    if (!selectedTags.includes('win')) {
      setSelectedTags((prev) => [...prev, 'win']);
    }
  };

  const handleToggleTag = (tag: JournalTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const filteredGratitude = gratitudeInputs.map((g) => g.trim()).filter(Boolean);

    onAddJournal({
      date: today,
      title: title.trim() || `Daily Reflection — ${formatDatePretty(today)}`,
      content: content.trim(),
      mood,
      energyLevel,
      tags: selectedTags.length > 0 ? selectedTags : ['reflection'],
      gratitude: filteredGratitude.length > 0 ? filteredGratitude : undefined,
      includedTasks: attachedTasks.length > 0 ? attachedTasks : undefined,
      includedHabitsCount: attachedHabitsCount > 0 ? attachedHabitsCount : undefined,
    });

    // Reset
    setTitle('');
    setContent('');
    setGratitudeInputs(['', '', '']);
    setAttachedTasks([]);
    setAttachedHabitsCount(0);
    setIsWriting(false);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              Mindful Journal &amp; Logs
            </h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
              {filteredJournals.length} entries
            </span>
          </div>
          <p className="text-xs text-slate-400">Deep reflections, daily gratitude, and win synthesis</p>
        </div>

        {/* Tag Filters & New Entry Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs overflow-x-auto max-w-xs no-scrollbar">
            <button
              onClick={() => setSelectedTagFilter('all')}
              className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition whitespace-nowrap ${
                selectedTagFilter === 'all'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            {ALL_TAGS.slice(0, 4).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition whitespace-nowrap ${
                  selectedTagFilter === tag
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsWriting(!isWriting)}
            className="flex items-center gap-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Write Entry</span>
          </button>
        </div>
      </div>

      {/* Write Journal Form */}
      {isWriting && (
        <form
          onSubmit={handleCreateEntry}
          className="mt-4 rounded-xl border border-pink-500/30 bg-slate-950/90 p-4 sm:p-5 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">
              New Daily Reflection — {formatDatePretty(today)}
            </h4>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          {/* Quick Cross-Pillar Integration Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 p-2.5 text-xs">
            <div className="flex items-center gap-2 text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Today you completed <strong>{todayTasksCompleted.length} tasks</strong> and{' '}
                <strong>{todayHabitsCompleted.length} habits</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={handlePullDailyWins}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 text-[11px] font-medium transition active:scale-95"
            >
              Include Today's Achievements
            </button>
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              placeholder="Entry Title (e.g. Breakthrough on project architecture and calm evening)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none font-semibold"
            />
          </div>

          {/* Mood & Energy Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mood selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Current Mood State
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['energized', 'calm', 'focused', 'reflective', 'tired'] as JournalMood[]).map((m) => {
                  const isSelected = mood === m;
                  const meta = MOOD_META[m];
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition ${
                        isSelected
                          ? `${meta.colorClass} border-current font-bold scale-102`
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base">{meta.icon}</span>
                      <span className="text-[10px] mt-0.5 capitalize truncate w-full">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Energy Level 1-5 */}
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-400 mb-1.5">
                <span>Energy Vitality Level</span>
                <span className="text-pink-400 font-bold">{energyLevel} / 5</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergyLevel(level)}
                    className={`flex-1 h-8 rounded-lg border font-bold text-xs flex items-center justify-center gap-1 transition ${
                      energyLevel >= level
                        ? 'bg-pink-500/20 border-pink-500/50 text-pink-300'
                        : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TAGS.map((t) => {
                const active = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleToggleTag(t)}
                    className={`rounded-md px-2.5 py-1 text-xs capitalize transition ${
                      active
                        ? 'bg-pink-500 text-white font-medium shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Reflection &amp; Thoughts
            </label>
            <textarea
              required
              rows={5}
              placeholder="What went well today? What was a key insight or learning? What would you adjust tomorrow?..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-pink-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* 3 Gratitudes */}
          <div className="space-y-2 rounded-xl bg-slate-900/40 p-3 border border-slate-800/80">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              Three Daily Gratitudes (Optional)
            </label>
            {gratitudeInputs.map((val, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Gratitude #${idx + 1}...`}
                value={val}
                onChange={(e) => {
                  const updated = [...gratitudeInputs];
                  updated[idx] = e.target.value;
                  setGratitudeInputs(updated);
                }}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:border-pink-500 focus:outline-none"
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-pink-600 hover:bg-pink-500 text-white px-4 py-1.5 text-xs font-semibold shadow-sm"
            >
              Save Daily Reflection
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="mt-4 space-y-3.5">
        {filteredJournals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No journal reflections found</p>
            <p className="text-xs text-slate-500 mt-1">
              Capture your first daily reflection or gratitude log above.
            </p>
          </div>
        ) : (
          filteredJournals.map((entry) => {
            const moodMeta = MOOD_META[entry.mood] || MOOD_META.focused;

            return (
              <article
                key={entry.id}
                id={`journal-card-${entry.id}`}
                className="group rounded-xl border border-slate-800 bg-slate-950/80 p-4 hover:border-slate-700 transition space-y-3"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-slate-200">
                        {formatDatePretty(entry.date)}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${moodMeta.colorClass}`}
                      >
                        <span>{moodMeta.icon}</span>
                        <span>{moodMeta.label}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                        {entry.energyLevel}/5 Energy
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                      {entry.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => onDeleteJournal(entry.id)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {entry.content}
                </div>

                {/* Gratitude items if present */}
                {entry.gratitude && entry.gratitude.length > 0 && (
                  <div className="rounded-lg bg-pink-950/20 border border-pink-500/20 p-2.5 text-xs text-pink-200 space-y-1">
                    <div className="font-semibold text-[11px] text-pink-400 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Daily Gratitude:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      {entry.gratitude.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Integrated achievements banner */}
                {entry.includedTasks && entry.includedTasks.length > 0 && (
                  <div className="flex items-center gap-2 text-[11px] text-indigo-300 bg-indigo-950/30 rounded-lg px-2.5 py-1.5 border border-indigo-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Included {entry.includedTasks.length} completed tasks in reflection</span>
                    {entry.includedHabitsCount && (
                      <span className="flex items-center gap-1 text-teal-300 ml-2">
                        <Flame className="w-3 h-3 text-teal-400" />
                        {entry.includedHabitsCount} habits
                      </span>
                    )}
                  </div>
                )}

                {/* Tags Footer */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {entry.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium text-slate-400 bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
