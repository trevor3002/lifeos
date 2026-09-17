import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { LifeOSData, Task, Habit, JournalEntry, TaskStatus } from '../types';
import { defaultLifeOSData } from '../data/initialData';
import { getTodayString, calculateStreak } from '../utils/dateUtils';

const STORAGE_KEY = 'LIFE_OS_DATA_V1';

export function useLifeOS() {
  const [data, setData] = useState<LifeOSData>(() => {
    if (typeof window === 'undefined') return defaultLifeOSData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.tasks && parsed.habits && parsed.journals) {
          return parsed;
        }
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
        const updatedSubtasks = t.subtasks.map((st) =>
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
        const nextState = !h.completions[dateStr];
        const updatedCompletions = {
          ...h.completions,
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
        const allDone = updatedHabits.every((h) => h.completions[today]);
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
            colors: ['#10b981', '#6366f1', '#06b6d4', '#fbbf24', '#ec4899'],
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
      if (
        parsed &&
        Array.isArray(parsed.tasks) &&
        Array.isArray(parsed.habits) &&
        Array.isArray(parsed.journals)
      ) {
        setData({
          tasks: parsed.tasks,
          habits: parsed.habits,
          journals: parsed.journals,
          version: parsed.version || 1,
          lastUpdated: new Date().toISOString(),
        });
        return { success: true, message: 'Life OS data imported successfully!' };
      }
      return { success: false, message: 'Invalid format: missing tasks, habits, or journals.' };
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
  const todayTasks = data.tasks.filter((t) => t.dueDate === today || (!t.dueDate && t.status !== 'completed'));
  const todayCompletedTasks = data.tasks.filter(
    (t) => (t.dueDate === today || !t.dueDate) && t.status === 'completed'
  );
  const todayHabitsCount = data.habits.length;
  const todayHabitsDoneCount = data.habits.filter((h) => h.completions[today]).length;
  const todayJournal = data.journals.find((j) => j.date === today);

  // Daily Score (0 to 100)
  const taskFactor = todayTasks.length > 0 ? todayCompletedTasks.length / todayTasks.length : 1;
  const habitFactor = todayHabitsCount > 0 ? todayHabitsDoneCount / todayHabitsCount : 1;
  const journalFactor = todayJournal ? 1 : 0;
  const dailyScore = Math.round(taskFactor * 40 + habitFactor * 40 + journalFactor * 20);

  return {
    data,
    today,
    // Tasks
    tasks: data.tasks,
    todayTasks,
    todayCompletedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleSubtask,
    // Habits
    habits: data.habits,
    todayHabitsCount,
    todayHabitsDoneCount,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDate,
    // Journals
    journals: data.journals,
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
