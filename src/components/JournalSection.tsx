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

  // Form state
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
    if (selectedTagFilter !== 'all' && !(j.tags || []).includes(selectedTagFilter)) return false;
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

    const winsSnippet = `\n\n### Daily Wins Log:\n${
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

    setTitle('');
    setContent('');
    setGratitudeInputs(['', '', '']);
    setAttachedTasks([]);
    setAttachedHabitsCount(0);
    setIsWriting(false);
  };

  return (
    <section className="rounded-2xl border border-[#24282f] bg-[#121316] p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#1f2228]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Mindful Journal &amp; Logs
            </h3>
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
              {filteredJournals.length}
            </span>
          </div>
          <p className="text-xs text-zinc-400">Deep daily reflections, gratitude logs, and win synthesis</p>
        </div>

        {/* Filters & Write Action Button */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="flex items-center rounded-lg bg-[#0c0d10] p-1 border border-[#24282f] text-xs overflow-x-auto max-w-[200px] sm:max-w-xs no-scrollbar">
            <button
              onClick={() => setSelectedTagFilter('all')}
              className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition whitespace-nowrap min-h-[28px] ${
                selectedTagFilter === 'all'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            {ALL_TAGS.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition whitespace-nowrap min-h-[28px] ${
                  selectedTagFilter === tag
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsWriting(!isWriting)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 text-xs font-bold shadow-sm transition active:scale-95 whitespace-nowrap min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Write Entry</span>
          </button>
        </div>
      </div>

      {/* Form */}
      {isWriting && (
        <form
          onSubmit={handleCreateEntry}
          className="mt-4 rounded-xl border border-amber-500/30 bg-[#0c0d10] p-4 sm:p-5 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              New Reflection — {formatDatePretty(today)}
            </h4>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
          </div>

          {/* Quick Cross-Pillar Integration Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#16181d] border border-[#2e333b] p-2.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Today: <strong className="text-zinc-100">{todayTasksCompleted.length} tasks</strong> &amp;{' '}
                <strong className="text-zinc-100">{todayHabitsCompleted.length} habits</strong> completed.
              </span>
            </div>
            <button
              type="button"
              onClick={handlePullDailyWins}
              className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-2.5 py-1 text-[11px] font-medium transition active:scale-95"
            >
              Include Today's Achievements
            </button>
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Entry Title (e.g. Breakthrough on system architecture & mindful evening)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-semibold min-h-[44px]"
            />
          </div>

          {/* Mood & Energy Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                Mental State
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
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition min-h-[44px] ${
                        isSelected
                          ? `${meta.colorClass} border-current font-bold`
                          : 'border-[#24282f] bg-[#14161a] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-base">{meta.icon}</span>
                      <span className="text-[10px] mt-0.5 capitalize truncate w-full">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                <span>Vitality Rating</span>
                <span className="text-amber-400 font-bold">{energyLevel} / 5</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergyLevel(level)}
                    className={`flex-1 h-9 rounded-lg border font-mono font-bold text-xs flex items-center justify-center gap-1 transition ${
                      energyLevel >= level
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-[#14161a] border-[#24282f] text-zinc-600 hover:text-zinc-400'
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
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center gap-1">
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
                    className={`rounded-md px-2.5 py-1 text-xs capitalize transition min-h-[30px] ${
                      active
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'bg-[#14161a] border border-[#24282f] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
              Daily Reflection
            </label>
            <textarea
              required
              rows={5}
              placeholder="What went well today? What was a key insight or learning? What would you adjust tomorrow?..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* 3 Gratitudes */}
          <div className="space-y-2 rounded-xl bg-[#14161a] p-3 border border-[#24282f]">
            <label className="text-[10px] font-mono uppercase text-zinc-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Daily Gratitude Anchor
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
                className="w-full rounded-lg border border-[#24282f] bg-[#0c0d10] px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-amber-500 focus:outline-none min-h-[36px]"
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-1.5 text-xs shadow-sm"
            >
              Save Reflection
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="mt-3.5 space-y-3">
        {filteredJournals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#24282f] p-8 text-center">
            <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-300">No reflections found</p>
            <p className="text-xs text-zinc-500 mt-1">
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
                className="group rounded-xl border border-[#24282f] bg-[#16181d] p-3.5 sm:p-4 hover:border-[#2e333b] transition space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1 font-mono">
                      <span className="text-xs font-bold text-zinc-300">
                        {formatDatePretty(entry.date)}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${moodMeta.colorClass}`}
                      >
                        <span>{moodMeta.icon}</span>
                        <span>{moodMeta.label}</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-0.5 bg-[#121316] px-1.5 py-0.5 rounded border border-[#24282f]">
                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                        {entry.energyLevel}/5 Energy
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight">
                      {entry.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => onDeleteJournal(entry.id)}
                    className="opacity-80 sm:opacity-0 group-hover:opacity-100 rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                  {entry.content}
                </div>

                {/* Gratitude items */}
                {entry.gratitude && entry.gratitude.length > 0 && (
                  <div className="rounded-lg bg-[#14161a] border border-[#24282f] p-2.5 text-xs text-zinc-300 space-y-1">
                    <div className="font-mono text-[10px] uppercase text-rose-400 flex items-center gap-1 font-semibold">
                      <Heart className="w-3 h-3" />
                      Daily Gratitude:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-zinc-300 text-[11px]">
                      {entry.gratitude.map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Integrated achievements */}
                {entry.includedTasks && entry.includedTasks.length > 0 && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-300 bg-[#121316] rounded-lg px-2.5 py-1.5 border border-[#24282f]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Included {entry.includedTasks.length} tasks in reflection</span>
                    {entry.includedHabitsCount && (
                      <span className="flex items-center gap-1 text-amber-400 ml-2">
                        <Flame className="w-3 h-3" />
                        {entry.includedHabitsCount} habits
                      </span>
                    )}
                  </div>
                )}

                {/* Tags Footer */}
                <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                  {(entry.tags || []).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono font-medium text-zinc-400 bg-[#0c0d10] border border-[#24282f] px-2 py-0.5 rounded"
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
