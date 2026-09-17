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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#24282f] bg-[#121316] p-5 shadow-2xl text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1 rounded-full bg-zinc-700 mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-[#1f2228]">
          <h3 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
            Quick Life OS Capture
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Switcher */}
        <div className="mt-3 flex rounded-xl bg-[#0c0d10] p-1 border border-[#24282f]">
          <button
            type="button"
            onClick={() => setType('task')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition min-h-[38px] ${
              type === 'task'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setType('habit')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition min-h-[38px] ${
              type === 'habit'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Habit</span>
          </button>
          <button
            type="button"
            onClick={() => setType('journal')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition min-h-[38px] ${
              type === 'journal'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
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
                  className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none min-h-[44px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Domain</label>
                  <select
                    value={taskDomain}
                    onChange={(e) => setTaskDomain(e.target.value as LifeDomain)}
                    className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2 py-1.5 text-xs text-zinc-200 focus:outline-none min-h-[38px]"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2 py-1.5 text-xs text-zinc-200 focus:outline-none min-h-[38px]"
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
                  placeholder="Habit protocol (e.g. 50 pushups, 20m reading)..."
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none min-h-[44px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Domain</label>
                  <select
                    value={habitDomain}
                    onChange={(e) => setHabitDomain(e.target.value as LifeDomain)}
                    className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2 py-1.5 text-xs text-zinc-200 focus:outline-none min-h-[38px]"
                  >
                    <option value="health">Health</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="learning">Learning</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Time</label>
                  <select
                    value={habitTime}
                    onChange={(e) => setHabitTime(e.target.value as HabitTimeOfDay)}
                    className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2 py-1.5 text-xs text-zinc-200 focus:outline-none min-h-[38px]"
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
                  className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-medium min-h-[40px]"
                />
              </div>
              <div>
                <textarea
                  autoFocus
                  required
                  rows={3}
                  placeholder="Capture quick reflection or thought..."
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">State</label>
                <select
                  value={journalMood}
                  onChange={(e) => setJournalMood(e.target.value as JournalMood)}
                  className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2 py-1.5 text-xs text-zinc-200 focus:outline-none min-h-[38px]"
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
              className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs shadow-sm transition min-h-[40px]"
            >
              Capture to Life OS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
