export type LifeDomain = 'work' | 'personal' | 'health' | 'learning' | 'finance';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  domain: LifeDomain;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  estimatedMinutes?: number;
  linkedHabitId?: string;
  subtasks: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends';
export type HabitTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Habit {
  id: string;
  name: string;
  category: LifeDomain;
  timeOfDay: HabitTimeOfDay;
  targetDaysPerWeek: number;
  color: string; // Tailwind color class or hex
  completions: Record<string, boolean>; // YYYY-MM-DD -> boolean
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
}

export type JournalMood = 'energized' | 'calm' | 'focused' | 'reflective' | 'tired';
export type JournalTag = 'reflection' | 'gratitude' | 'win' | 'learning' | 'idea' | 'challenge';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  title: string;
  content: string;
  mood: JournalMood;
  energyLevel: number; // 1 to 5
  tags: JournalTag[];
  gratitude?: string[];
  includedTasks?: string[];
  includedHabitsCount?: number;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'habits' | 'journal' | 'review';

export interface LifeOSData {
  tasks: Task[];
  habits: Habit[];
  journals: JournalEntry[];
  lastUpdated: string;
  version: number;
}
