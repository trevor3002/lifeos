import React, { useState } from 'react';
import { LifeDomain, Priority, HabitTimeOfDay, JournalMood } from '../types';
import { getTodayString } from '../utils/dateUtils';
import {
  X,
  CheckSquare,
  Flame,
  BookOpen,
} from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    domain: LifeDomain;
    priority: Priority;
    dueDate?: string;
    subtasks: { id: string; title: string; completed: boolean }[];
    status: 'todo';
  }) => void;
  onAddHabit: (habit: {
    name: string;
    category: LifeDomain;
    timeOfDay: HabitTimeOfDay;
    targetDaysPerWeek: number;
    color: string;
  }) => void;
  onAddJournal: (journal: {
    date: string;
    title: string;
    content: string;
    mood: JournalMood;
    energyLevel: number;
    tags: ('reflection' | 'gratitude' | 'win' | 'learning' | 'idea' | 'challenge')[];
  }) => void;
}

type QuickType = 'task' | 'habit' | 'journal';

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddHabit,
  onAddJournal,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<QuickType>('task');
  const today = getTodayString();

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDomain, setTaskDomain] = useState<LifeDomain>('work');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');

  // Habit form
  const [habitName, setHabitName] = useState('');
  const [habitDomain, setHabitDomain] = useState<LifeDomain>('health');
  const [habitTime, setHabitTime] = useState<HabitTimeOfDay>('morning');

  // Journal form
  const [journalTitle, setJournalTitle] = useState('');
  const [journalContent, setJournalContent] = useState('');
  const [journalMood, setJournalMood] = useState<JournalMood>('focused');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'task') {
      if (!taskTitle.trim()) return;
      onAddTask({
        title: taskTitle.trim(),
        domain: taskDomain,
        priority: taskPriority,
        dueDate: today,
        status: 'todo',
        subtasks: [],
      });
      setTaskTitle('');
    } else if (type === 'habit') {
      if (!habitName.trim()) return;
      onAddHabit({
        name: habitName.trim(),
        category: habitDomain,
        timeOfDay: habitTime,
        targetDaysPerWeek: 7,
        color: '#10b981',
      });
      setHabitName('');
    } else if (type === 'journal') {
      if (!journalTitle.trim() && !journalContent.trim()) return;
      onAddJournal({
        date: today,
        title: journalTitle.trim() || `Quick Note — ${today}`,
        content: journalContent.trim(),
        mood: journalMood,
        energyLevel: 4,
        tags: ['idea'],
      });
      setJournalTitle('');
      setJournalContent('');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Capture</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="mt-3 flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setType('task')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              type === 'task' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setType('habit')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              type === 'habit' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Habit</span>
          </button>
          <button
            type="button"
            onClick={() => setType('journal')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              type === 'journal' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Journal</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {type === 'task' && (
            <>
              <div>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="Task title..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Domain</label>
                  <select
                    value={taskDomain}
                    onChange={(e) => setTaskDomain(e.target.value as LifeDomain)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'habit' && (
            <>
              <div>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="Habit name (e.g. 50 pushups, 20m reading)..."
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Domain</label>
                  <select
                    value={habitDomain}
                    onChange={(e) => setHabitDomain(e.target.value as LifeDomain)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="health">Health</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Time of Day</label>
                  <select
                    value={habitTime}
                    onChange={(e) => setHabitTime(e.target.value as HabitTimeOfDay)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'journal' && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Entry title / subject..."
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none font-medium"
                />
              </div>
              <div>
                <textarea
                  autoFocus
                  required
                  rows={3}
                  placeholder="Quick thought or reflection..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Mood</label>
                <select
                  value={journalMood}
                  onChange={(e) => setJournalMood(e.target.value as JournalMood)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="focused">🎯 Focused</option>
                  <option value="energized">⚡ Energized</option>
                  <option value="calm">🌿 Calm</option>
                  <option value="reflective">🌙 Reflective</option>
                  <option value="tired">☕ Tired</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 text-xs font-semibold shadow-sm transition"
            >
              Capture to Life OS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
