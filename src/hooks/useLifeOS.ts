import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { LifeOSData, Task, Habit, JournalEntry, TaskStatus, LifeDomain, Priority, HabitTimeOfDay, JournalMood, JournalTag } from '../types';
import { defaultLifeOSData } from '../data/initialData';
import { getTodayString, calculateStreak } from '../utils/dateUtils';

const STORAGE_KEY = 'LIFE_OS_DATA_V1';

const VALID_DOMAINS: LifeDomain[] = ['work', 'personal', 'health', 'learning', 'finance'];
const VALID_PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low'];
const VALID_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'completed'];
const VALID_CATEGORIES: LifeDomain[] = ['health', 'work', 'personal', 'learning', 'finance'];
const VALID_TIMES: HabitTimeOfDay[] = ['morning', 'afternoon', 'evening', 'anytime'];
const VALID_MOODS: JournalMood[] = ['energized', 'calm', 'focused', 'reflective', 'tired'];

// Robust sanitization function that ensures data is never malformed
export function sanitizeLifeOSData(raw: unknown): LifeOSData {
  if (!raw || typeof raw !== 'object') {
    return defaultLifeOSData;
  }
  const obj = raw as Record<string, unknown>;

  const rawTasks = Array.isArray(obj.tasks) ? obj.tasks : defaultLifeOSData.tasks;
  const rawHabits = Array.isArray(obj.habits) ? obj.habits : defaultLifeOSData.habits;
  const rawJournals = Array.isArray(obj.journals) ? obj.journals : defaultLifeOSData.journals;

  const tasks: Task[] = rawTasks.map((t: any, idx: number) => {
    const rawSubtasks = Array.isArray(t?.subtasks) ? t.subtasks : [];
    return {
      id: typeof t?.id === 'string' && t.id ? t.id : `task-${idx}-${Date.now()}`,
      title: typeof t?.title === 'string' ? t.title : 'Untitled Task',
      description: typeof t?.description === 'string' ? t.description : '',
      domain: VALID_DOMAINS.includes(t?.domain) ? t.domain : 'personal',
      priority: VALID_PRIORITIES.includes(t?.priority) ? t.priority : 'medium',
      status: VALID_STATUSES.includes(t?.status) ? t.status : 'todo',
      dueDate: typeof t?.dueDate === 'string' ? t.dueDate : undefined,
      dueTime: typeof t?.dueTime === 'string' ? t.dueTime : undefined,
      estimatedMinutes: typeof t?.estimatedMinutes === 'number' ? t.estimatedMinutes : undefined,
      completedAt: typeof t?.completedAt === 'string' ? t.completedAt : undefined,
      subtasks: rawSubtasks.map((st: any, sIdx: number) => ({
        id: typeof st?.id === 'string' && st.id ? st.id : `sub-${sIdx}-${Date.now()}`,
        title: typeof st?.title === 'string' ? st.title : 'Subtask',
        completed: Boolean(st?.completed),
      })),
      createdAt: typeof t?.createdAt === 'string' ? t.createdAt : new Date().toISOString(),
    };
  });

  const habits: Habit[] = rawHabits.map((h: any, idx: number) => {
    const rawCompletions = h?.completions && typeof h.completions === 'object' ? h.completions : {};
    const completions: Record<string, boolean> = {};
    for (const [key, val] of Object.entries(rawCompletions)) {
      if (typeof key === 'string') {
        completions[key] = Boolean(val);
      }
    }
    const { currentStreak, bestStreak } = calculateStreak(completions);

    return {
      id: typeof h?.id === 'string' && h.id ? h.id : `habit-${idx}-${Date.now()}`,
      name: typeof h?.name === 'string' ? h.name : 'Daily Habit',
      description: typeof h?.description === 'string' ? h.description : '',
      category: VALID_CATEGORIES.includes(h?.category) ? h.category : 'health',
      timeOfDay: VALID_TIMES.includes(h?.timeOfDay) ? h.timeOfDay : 'anytime',
      targetDaysPerWeek: typeof h?.targetDaysPerWeek === 'number' ? Math.max(1, Math.min(7, h.targetDaysPerWeek)) : 7,
      color: typeof h?.color === 'string' ? h.color : '#10b981',
      completions,
      currentStreak: typeof h?.currentStreak === 'number' ? h.currentStreak : currentStreak,
      bestStreak: typeof h?.bestStreak === 'number' ? Math.max(h.bestStreak, currentStreak) : bestStreak,
      createdAt: typeof h?.createdAt === 'string' ? h.createdAt : new Date().toISOString(),
    };
  });

  const journals: JournalEntry[] = rawJournals.map((j: any, idx: number) => {
    return {
      id: typeof j?.id === 'string' && j.id ? j.id : `journal-${idx}-${Date.now()}`,
      date: typeof j?.date === 'string' ? j.date : getTodayString(),
      title: typeof j?.title === 'string' ? j.title : 'Daily Reflection',
      content: typeof j?.content === 'string' ? j.content : '',
      mood: VALID_MOODS.includes(j?.mood) ? j.mood : 'focused',
      energyLevel: typeof j?.energyLevel === 'number' ? Math.max(1, Math.min(5, j.energyLevel)) : 3,
      tags: Array.isArray(j?.tags) ? (j.tags.filter((t: any) => typeof t === 'string') as JournalTag[]) : ['reflection'],
      gratitude: Array.isArray(j?.gratitude) ? j.gratitude.filter((g: any) => typeof g === 'string') : [],
      includedTasks: Array.isArray(j?.includedTasks) ? j.includedTasks.filter((t: any) => typeof t === 'string') : [],
      includedHabitsCount: typeof j?.includedHabitsCount === 'number' ? j.includedHabitsCount : undefined,
      timestamp: typeof j?.timestamp === 'string' ? j.timestamp : new Date().toISOString(),
    };
  });

  return {
    version: 1,
    lastUpdated: typeof obj?.lastUpdated === 'string' ? obj.lastUpdated : new Date().toISOString(),
    tasks,
    habits,
    journals,
  };
}

export function useLifeOS() {
  const [data, setData] = useState<LifeOSData>(() => {
    if (typeof window === 'undefined') return defaultLifeOSData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeLifeOSData(parsed);
      }
    } catch (e) {
      console.error('Error loading Life OS data from localStorage:', e);
    }
    return defaultLifeOSData;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving Life OS data to localStorage:', e);
    }
  }, [data]);

  const today = getTodayString();

  // Tasks actions
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : [],
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      lastUpdated: new Date().toISOString(),
    }));
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setData((prev) => {
      return {
        ...prev,
        tasks: prev.tasks.map((t) => {
          if (t.id !== id) return t;
          const nextStatus: TaskStatus = t.status === 'completed' ? 'todo' : 'completed';
          const completedAt = nextStatus === 'completed' ? new Date().toISOString() : undefined;
          return {
            ...t,
            status: nextStatus,
            completedAt,
          };
        }),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = Array.isArray(t.subtasks) ? t.subtasks : [];
        const updatedSubtasks = subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      }),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Habits actions
  const addHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'currentStreak' | 'bestStreak' | 'createdAt' | 'completions'>) => {
      const newHabit: Habit = {
        ...habitData,
        id: 'habit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        completions: {},
        currentStreak: 0,
        bestStreak: 0,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({
        ...prev,
        habits: [...prev.habits, newHabit],
        lastUpdated: new Date().toISOString(),
      }));
      return newHabit;
    },
    []
  );

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const toggleHabitDate = useCallback((habitId: string, dateStr: string) => {
    setData((prev) => {
      let justCompletedAllToday = false;
      const updatedHabits = prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const completions = h.completions && typeof h.completions === 'object' ? h.completions : {};
        const nextState = !completions[dateStr];
        const updatedCompletions = {
          ...completions,
          [dateStr]: nextState,
        };
        const { currentStreak, bestStreak } = calculateStreak(updatedCompletions);
        return {
          ...h,
          completions: updatedCompletions,
          currentStreak,
          bestStreak,
        };
      });

      // Check if all today's habits are now completed
      if (dateStr === today && updatedHabits.length > 0) {
        const allDone = updatedHabits.every((h) => h.completions && h.completions[today]);
        if (allDone) {
          justCompletedAllToday = true;
        }
      }

      if (justCompletedAllToday) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#f59e0b', '#06b6d4', '#ea580c', '#38bdf8'],
          });
        } catch {
          // ignore if canvas blocked
        }
      }

      return {
        ...prev,
        habits: updatedHabits,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, [today]);

  // Journals actions
  const addJournal = useCallback((entryData: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      tags: Array.isArray(entryData.tags) ? entryData.tags : ['reflection'],
      gratitude: Array.isArray(entryData.gratitude) ? entryData.gratitude : [],
      includedTasks: Array.isArray(entryData.includedTasks) ? entryData.includedTasks : [],
      id: 'journal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      journals: [newEntry, ...prev.journals],
      lastUpdated: new Date().toISOString(),
    }));
    return newEntry;
  }, []);

  const updateJournal = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setData((prev) => ({
      ...prev,
      journals: prev.journals.map((j) => (j.id === id ? { ...j, ...updates } : j)),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const deleteJournal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      journals: prev.journals.filter((j) => j.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Export Data JSON
  const exportDataJSON = useCallback(() => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-os-backup-${getTodayString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  // Import Data JSON
  const importDataJSON = useCallback((jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const sanitized = sanitizeLifeOSData(parsed);
        setData(sanitized);
        return { success: true, message: 'Life OS data imported and sanitized successfully!' };
      }
      return { success: false, message: 'Invalid format: please provide a valid Life OS backup file.' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown parsing error';
      return { success: false, message: `Could not parse JSON: ${message}` };
    }
  }, []);

  // Reset Data
  const resetToDefaultData = useCallback(() => {
    setData(defaultLifeOSData);
  }, []);

  // Computations for Today's Dashboard
  const safeTasks = Array.isArray(data.tasks) ? data.tasks : [];
  const safeHabits = Array.isArray(data.habits) ? data.habits : [];
  const safeJournals = Array.isArray(data.journals) ? data.journals : [];

  const todayTasks = safeTasks.filter((t) => t.dueDate === today || (!t.dueDate && t.status !== 'completed'));
  const todayCompletedTasks = safeTasks.filter(
    (t) => (t.dueDate === today || !t.dueDate) && t.status === 'completed'
  );
  const todayHabitsCount = safeHabits.length;
  const todayHabitsDoneCount = safeHabits.filter((h) => h?.completions && h.completions[today]).length;
  const todayJournal = safeJournals.find((j) => j.date === today);

  // Daily Score (0 to 100)
  const taskFactor = todayTasks.length > 0 ? todayCompletedTasks.length / todayTasks.length : 1;
  const habitFactor = todayHabitsCount > 0 ? todayHabitsDoneCount / todayHabitsCount : 1;
  const journalFactor = todayJournal ? 1 : 0;
  const rawScore = Math.round(taskFactor * 40 + habitFactor * 40 + journalFactor * 20);
  const dailyScore = isNaN(rawScore) ? 0 : Math.max(0, Math.min(100, rawScore));

  return {
    data,
    today,
    // Tasks
    tasks: safeTasks,
    todayTasks,
    todayCompletedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleSubtask,
    // Habits
    habits: safeHabits,
    todayHabitsCount,
    todayHabitsDoneCount,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDate,
    // Journals
    journals: safeJournals,
    todayJournal,
    addJournal,
    updateJournal,
    deleteJournal,
    // Dashboard & Metrics
    dailyScore,
    // Storage Utilities
    exportDataJSON,
    importDataJSON,
    resetToDefaultData,
  };
}
