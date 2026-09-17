import { LifeOSData } from '../types';
import { getTodayString } from '../utils/dateUtils';

const today = getTodayString();
const d = new Date();
const getPastDateStr = (daysAgo: number) => {
  const past = new Date(d);
  past.setDate(d.getDate() - daysAgo);
  const y = past.getFullYear();
  const m = String(past.getMonth() + 1).padStart(2, '0');
  const day = String(past.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const defaultLifeOSData: LifeOSData = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  tasks: [
    {
      id: 'task-1',
      title: 'Review Q3 strategic goals and milestones',
      description: 'Align high-priority projects with personal growth benchmarks and team quarterly goals.',
      domain: 'work',
      priority: 'urgent',
      status: 'in_progress',
      dueDate: today,
      dueTime: '14:00',
      estimatedMinutes: 45,
      subtasks: [
        { id: 'sub-1', title: 'Audit completed milestones', completed: true },
        { id: 'sub-2', title: 'Highlight top 3 blockers', completed: false },
        { id: 'sub-3', title: 'Draft update memo for team', completed: false },
      ],
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Read Chapter 4 of Deep Work',
      description: 'Focus on rule #2: Embrace Boredom and calibrate attention residue.',
      domain: 'learning',
      priority: 'medium',
      status: 'todo',
      dueDate: today,
      estimatedMinutes: 30,
      subtasks: [
        { id: 'sub-4', title: 'Take 3 key reflection bullet notes', completed: false },
      ],
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'task-3',
      title: 'Complete 30-min Zone 2 Cardio & Mobility',
      description: 'Steady nasal breathing pace on bike or outdoor run, followed by hip openers.',
      domain: 'health',
      priority: 'high',
      status: 'completed',
      dueDate: today,
      estimatedMinutes: 40,
      completedAt: new Date().toISOString(),
      subtasks: [
        { id: 'sub-5', title: '5 min warm up', completed: true },
        { id: 'sub-6', title: '25 min steady aerobic pace', completed: true },
        { id: 'sub-7', title: 'Post-workout stretch & hydration', completed: true },
      ],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'task-4',
      title: 'Monthly budget audit & recurring subscription review',
      description: 'Cancel unused software subscriptions and allocate 20% to emergency savings.',
      domain: 'finance',
      priority: 'low',
      status: 'todo',
      dueDate: getPastDateStr(-2),
      estimatedMinutes: 25,
      subtasks: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-5',
      title: 'Call mom & send family photos',
      description: 'Catch up over weekend plans and check in.',
      domain: 'personal',
      priority: 'medium',
      status: 'todo',
      dueDate: today,
      estimatedMinutes: 20,
      subtasks: [],
      createdAt: new Date().toISOString(),
    },
  ],
  habits: [
    {
      id: 'habit-1',
      name: 'Morning Hydration & Sunlight',
      category: 'health',
      timeOfDay: 'morning',
      targetDaysPerWeek: 7,
      color: '#10b981', // emerald
      completions: {
        [getPastDateStr(6)]: true,
        [getPastDateStr(5)]: true,
        [getPastDateStr(4)]: true,
        [getPastDateStr(3)]: true,
        [getPastDateStr(2)]: true,
        [getPastDateStr(1)]: true,
        [today]: true,
      },
      currentStreak: 7,
      bestStreak: 21,
      createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    },
    {
      id: 'habit-2',
      name: '90-Minute Deep Work Block',
      category: 'work',
      timeOfDay: 'morning',
      targetDaysPerWeek: 5,
      color: '#d97706', // warm bronze
      completions: {
        [getPastDateStr(4)]: true,
        [getPastDateStr(3)]: true,
        [getPastDateStr(2)]: true,
        [getPastDateStr(1)]: true,
        [today]: true,
      },
      currentStreak: 5,
      bestStreak: 14,
      createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    },
    {
      id: 'habit-3',
      name: 'Daily 20m Focused Reading',
      category: 'learning',
      timeOfDay: 'afternoon',
      targetDaysPerWeek: 7,
      color: '#14b8a6', // teal
      completions: {
        [getPastDateStr(3)]: true,
        [getPastDateStr(2)]: true,
        [getPastDateStr(1)]: true,
        [today]: false,
      },
      currentStreak: 3,
      bestStreak: 18,
      createdAt: new Date(Date.now() - 3600000 * 24 * 25).toISOString(),
    },
    {
      id: 'habit-4',
      name: 'Evening Digital Sunset (Screens off 10 PM)',
      category: 'health',
      timeOfDay: 'evening',
      targetDaysPerWeek: 6,
      color: '#f59e0b', // amber
      completions: {
        [getPastDateStr(3)]: true,
        [getPastDateStr(2)]: true,
        [getPastDateStr(1)]: true,
        [today]: false,
      },
      currentStreak: 3,
      bestStreak: 9,
      createdAt: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
    },
    {
      id: 'habit-5',
      name: 'Mindful Journal & Gratitude Reflection',
      category: 'personal',
      timeOfDay: 'evening',
      targetDaysPerWeek: 7,
      color: '#ea580c', // terracotta orange
      completions: {
        [getPastDateStr(5)]: true,
        [getPastDateStr(4)]: true,
        [getPastDateStr(3)]: true,
        [getPastDateStr(2)]: true,
        [getPastDateStr(1)]: true,
        [today]: true,
      },
      currentStreak: 6,
      bestStreak: 28,
      createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    },
  ],
  journals: [
    {
      id: 'journal-1',
      date: today,
      timestamp: new Date().toISOString(),
      title: 'Clarity in Morning Priorities & Flow',
      content:
        'Started the day early with sunlight and completed the cardio session. Felt immediate mental clarity. Reframing challenges today as training grounds rather than stress vectors. The key leverage point for the afternoon is keeping deep focus intact without slack tab distractions.',
      mood: 'energized',
      energyLevel: 5,
      tags: ['reflection', 'win', 'gratitude'],
      gratitude: [
        'Crisp morning weather and outdoor run',
        'Uninterrupted 2-hour morning momentum',
        'Nutritious meal and calm headspace',
      ],
      includedTasks: ['Complete 30-min Zone 2 Cardio & Mobility'],
      includedHabitsCount: 3,
    },
    {
      id: 'journal-2',
      date: getPastDateStr(1),
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      title: 'Weekly Systems Check & Attention Hygiene',
      content:
        'Reviewed how I spend the first 30 minutes of each day. When I avoid checking messages right away, my entire day feels intentional rather than reactive. Small consistent choices produce massive dividends over 6 months.',
      mood: 'focused',
      energyLevel: 4,
      tags: ['reflection', 'learning'],
      gratitude: [
        'A good cup of black coffee',
        'Smooth collaboration on the project launch',
      ],
    },
  ],
};
