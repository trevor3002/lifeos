import React, { useState } from 'react';
import { Task, LifeDomain, Priority, TaskStatus } from '../types';
import { DOMAIN_META, PRIORITY_META } from '../utils/domainColors';
import { formatDatePretty, getTodayString } from '../utils/dateUtils';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Layers,
  Filter,
} from 'lucide-react';

interface TaskSectionProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  selectedDomain: LifeDomain | 'all';
  searchQuery: string;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleStatus,
  onToggleSubtask,
  selectedDomain,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});

  // New task form state
  const today = getTodayString();
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDomain, setNewDomain] = useState<LifeDomain>('work');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDueDate, setNewDueDate] = useState(today);
  const [newEstMinutes, setNewEstMinutes] = useState<number | ''>(25);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [newSubtasks, setNewSubtasks] = useState<string[]>([]);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedDomain !== 'all' && t.domain !== selectedDomain) return false;
    if (statusFilter === 'active' && t.status === 'completed') return false;
    if (statusFilter === 'completed' && t.status !== 'completed') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q) || false;
      const matchSub = t.subtasks.some((st) => st.title.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedTaskIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubtaskDraft = () => {
    if (!newSubtaskInput.trim()) return;
    setNewSubtasks((prev) => [...prev, newSubtaskInput.trim()]);
    setNewSubtaskInput('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      domain: newDomain,
      priority: newPriority,
      status: 'todo',
      dueDate: newDueDate || undefined,
      estimatedMinutes: typeof newEstMinutes === 'number' ? newEstMinutes : undefined,
      subtasks: newSubtasks.map((st, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title: st,
        completed: false,
      })),
    });

    // Reset
    setNewTitle('');
    setNewDescription('');
    setNewSubtasks([]);
    setNewSubtaskInput('');
    setIsAdding(false);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              Tasks &amp; Action Items
            </h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
              {filteredTasks.length}
            </span>
          </div>
          <p className="text-xs text-slate-400">High-leverage outputs organized by life domain</p>
        </div>

        {/* Filters & Add Button */}
        <div className="flex items-center gap-2">
          {/* Status filter pills */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            {(['all', 'active', 'completed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Expandable Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="mt-4 rounded-xl border border-indigo-500/30 bg-slate-950/80 p-4 space-y-3.5 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Create New Action Item</h4>
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
              placeholder="Task title (e.g. Prepare client deck for Q4 review)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <textarea
              placeholder="Additional context, notes, or execution details (optional)..."
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Domain */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Life Domain</label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value as LifeDomain)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="finance">Finance</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Estimated Minutes */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Est. Minutes</label>
              <input
                type="number"
                min={5}
                step={5}
                value={newEstMinutes}
                onChange={(e) => setNewEstMinutes(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="25"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="pt-1">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Subtasks Checklist</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add sub-step..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtaskDraft();
                  }
                }}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtaskDraft}
                className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-xs font-medium"
              >
                Add Subtask
              </button>
            </div>
            {newSubtasks.length > 0 && (
              <div className="mt-2 space-y-1">
                {newSubtasks.map((st, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300">
                    <span>• {st}</span>
                    <button
                      type="button"
                      onClick={() => setNewSubtasks((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 text-xs font-semibold shadow-sm"
            >
              Save Action Item
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="mt-4 space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No tasks in this view</p>
            <p className="text-xs text-slate-500 mt-1">
              Add a new task or adjust your domain and status filters.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const domainMeta = DOMAIN_META[task.domain] || DOMAIN_META.work;
            const priorityMeta = PRIORITY_META[task.priority] || PRIORITY_META.medium;
            const isExpanded = !!expandedTaskIds[task.id];
            const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`group relative rounded-xl border p-3.5 transition-all duration-200 ${
                  isCompleted
                    ? 'border-slate-800/60 bg-slate-950/30 opacity-70'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Toggle Checkbox */}
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className={`mt-0.5 rounded-lg p-0.5 transition active:scale-90 ${
                      isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-indigo-400'
                    }`}
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${domainMeta.badgeClass}`}
                      >
                        {domainMeta.label}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${priorityMeta.badgeClass}`}>
                        {priorityMeta.label}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {task.dueDate === today ? 'Today' : formatDatePretty(task.dueDate)}
                        </span>
                      )}
                      {task.estimatedMinutes && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {task.estimatedMinutes}m
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-semibold tracking-tight transition ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Subtasks Summary / Expander */}
                    {task.subtasks.length > 0 && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition"
                        >
                          <Layers className="w-3 h-3 text-indigo-400" />
                          <span>
                            {completedSubtasks}/{task.subtasks.length} subtasks
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-slate-800">
                            {task.subtasks.map((st) => (
                              <label
                                key={st.id}
                                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none py-0.5 hover:text-white"
                              >
                                <input
                                  type="checkbox"
                                  checked={st.completed}
                                  onChange={() => onToggleSubtask(task.id, st.id)}
                                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                />
                                <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                  {st.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions (Delete) */}
                  <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition"
                      title="Delete task"
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
