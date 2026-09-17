import React, { useState } from 'react';
import { Task, LifeDomain, Priority } from '../types';
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
  Check,
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
  onDeleteTask,
  onToggleStatus,
  onToggleSubtask,
  selectedDomain,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});

  // Form state
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
      const matchSub = (t.subtasks || []).some((st) => st.title.toLowerCase().includes(q));
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

    setNewTitle('');
    setNewDescription('');
    setNewSubtasks([]);
    setNewSubtaskInput('');
    setIsAdding(false);
  };

  return (
    <section className="rounded-2xl border border-[#24282f] bg-[#121316] p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#1f2228]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Action Items
            </h3>
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-300">
              {filteredTasks.length}
            </span>
          </div>
          <p className="text-xs text-zinc-400">High-leverage outputs organized by life domain</p>
        </div>

        {/* Filters & Add Action Button */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {/* Status filter pills */}
          <div className="flex items-center rounded-lg bg-[#0c0d10] p-1 border border-[#24282f] text-xs">
            {(['all', 'active', 'completed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition min-h-[28px] ${
                  statusFilter === s
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 text-xs font-bold shadow-sm transition active:scale-95 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Add Task Expandable Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="mt-4 rounded-xl border border-amber-500/30 bg-[#0c0d10] p-4 space-y-3.5 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              New Action Item
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
              placeholder="Task title (e.g. Complete quarterly architecture review)..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none min-h-[44px]"
            />
          </div>

          <div>
            <textarea
              placeholder="Additional context or execution details (optional)..."
              rows={2}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Domain */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Domain</label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value as LifeDomain)}
                className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none min-h-[38px]"
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
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none min-h-[38px]"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Due date */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none min-h-[38px]"
              />
            </div>

            {/* Estimate */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Est. Minutes</label>
              <input
                type="number"
                min={5}
                step={5}
                value={newEstMinutes}
                onChange={(e) => setNewEstMinutes(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-lg border border-[#2e333b] bg-[#14161a] px-2.5 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none min-h-[38px]"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2 pt-1 border-t border-[#1f2228]">
            <label className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-zinc-400" />
              Subtasks Checklist
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskInput}
                onChange={(e) => setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtaskDraft();
                  }
                }}
                className="flex-1 rounded-lg border border-[#2e333b] bg-[#14161a] px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none min-h-[38px]"
              />
              <button
                type="button"
                onClick={handleAddSubtaskDraft}
                className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 text-xs font-semibold"
              >
                Add
              </button>
            </div>

            {newSubtasks.length > 0 && (
              <ul className="space-y-1 pt-1">
                {newSubtasks.map((st, i) => (
                  <li key={i} className="flex items-center justify-between rounded-md bg-[#14161a] px-2.5 py-1 text-xs text-zinc-300">
                    <span>{st}</span>
                    <button
                      type="button"
                      onClick={() => setNewSubtasks(newSubtasks.filter((_, idx) => idx !== i))}
                      className="text-zinc-500 hover:text-rose-400"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
              className="rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-1.5 text-xs shadow-sm transition"
            >
              Save Action Item
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="mt-3.5 space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#24282f] p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-300">No action items found</p>
            <p className="text-xs text-zinc-500 mt-1">
              Add a new task above or adjust your active filters.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const domainMeta = DOMAIN_META[task.domain];
            const priorityMeta = PRIORITY_META[task.priority];
            const isExpanded = expandedTaskIds[task.id];
            const subtaskList = Array.isArray(task.subtasks) ? task.subtasks : [];
            const completedSubtasks = subtaskList.filter((st) => st.completed).length;

            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                className={`group rounded-xl border transition p-3 sm:p-3.5 ${
                  isCompleted
                    ? 'border-[#1e2227] bg-[#0d0e10]/60 opacity-65'
                    : 'border-[#24282f] bg-[#16181d] hover:border-[#2e333b]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Large Touch Target Checkbox */}
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="mt-0.5 flex h-7 w-7 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-lg border transition cursor-pointer min-h-[36px] min-w-[36px] -ml-1 -mt-1 sm:m-0"
                    style={{
                      borderColor: isCompleted ? '#10b981' : '#3f444e',
                      backgroundColor: isCompleted ? '#064e3b' : 'transparent',
                    }}
                    title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {/* Life Domain Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono border ${domainMeta.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${domainMeta.dotClass}`} />
                        {domainMeta.label}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${priorityMeta.badgeClass}`}
                      >
                        {priorityMeta.label}
                      </span>

                      {/* Due Date & Estimate */}
                      {task.dueDate && (
                        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          {task.dueDate === today ? (
                            <span className="text-amber-400 font-semibold">Today</span>
                          ) : (
                            formatDatePretty(task.dueDate)
                          )}
                        </span>
                      )}

                      {task.estimatedMinutes && (
                        <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes}m
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div
                      className={`text-sm font-semibold tracking-tight text-zinc-100 ${
                        isCompleted ? 'line-through text-zinc-500 font-normal' : ''
                      }`}
                    >
                      {task.title}
                    </div>

                    {/* Description if present */}
                    {task.description && (
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Subtasks summary bar */}
                    {subtaskList.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-3">
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition py-1"
                        >
                          <Layers className="w-3.5 h-3.5 text-zinc-500" />
                          <span>
                            {completedSubtasks}/{subtaskList.length} subtasks
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                        </button>

                        <div className="w-24 h-1 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{
                              width: `${(completedSubtasks / subtaskList.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expanded Subtasks List */}
                    {isExpanded && subtaskList.length > 0 && (
                      <div className="mt-2 space-y-1 rounded-lg bg-[#0c0d10] p-2.5 border border-[#24282f]">
                        {subtaskList.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => onToggleSubtask(task.id, st.id)}
                            className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer hover:text-zinc-100 py-1"
                          >
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                st.completed
                                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                                  : 'border-zinc-700 bg-zinc-900'
                              }`}
                            >
                              {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={st.completed ? 'line-through text-zinc-500' : ''}>
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions (Delete) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-80 sm:opacity-0 group-hover:opacity-100 rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                      title="Delete action item"
                    >
                      <Trash2 className="w-4 h-4" />
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
