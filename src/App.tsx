/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLifeOS } from './hooks/useLifeOS';
import { ActiveTab, LifeDomain } from './types';
import { Navbar } from './components/Navbar';
import { DailyOverviewBanner } from './components/DailyOverviewBanner';
import { TaskSection } from './components/TaskSection';
import { HabitSection } from './components/HabitSection';
import { JournalSection } from './components/JournalSection';
import { DailyReviewModal } from './components/DailyReviewModal';
import { QuickAddModal } from './components/QuickAddModal';
import { DataManagementModal } from './components/DataManagementModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const {
    tasks,
    todayTasks,
    todayCompletedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleSubtask,
    habits,
    todayHabitsCount,
    todayHabitsDoneCount,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitDate,
    journals,
    todayJournal,
    addJournal,
    updateJournal,
    deleteJournal,
    dailyScore,
    today,
    exportDataJSON,
    importDataJSON,
    resetToDefaultData,
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedDomain, setSelectedDomain] = useState<LifeDomain | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsQuickAddOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsDailyReviewOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const todayPendingTasks = todayTasks.filter((t) => t.status !== 'completed');
  const todayCompletedHabitsList = habits.filter((h) => h.completions[today]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenDailyReview={() => setIsDailyReviewOpen(true)}
        dailyScore={dailyScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Always display the Daily Overview Banner */}
        <DailyOverviewBanner
          dailyScore={dailyScore}
          tasksCompleted={todayCompletedTasks.length}
          tasksTotal={todayTasks.length}
          habitsCompleted={todayHabitsDoneCount}
          habitsTotal={todayHabitsCount}
          todayJournal={todayJournal}
          onOpenDailyReview={() => setIsDailyReviewOpen(true)}
          onQuickLogJournal={() => {
            setActiveTab('journal');
          }}
        />

        {/* Tab 1: Unified Integrated Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left/Center Columns: Tasks and Habits */}
            <div className="lg:col-span-7 space-y-6">
              <TaskSection
                tasks={tasks}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onToggleStatus={toggleTaskStatus}
                onToggleSubtask={toggleSubtask}
                selectedDomain={selectedDomain}
                searchQuery={searchQuery}
              />

              <HabitSection
                habits={habits}
                onAddHabit={addHabit}
                onUpdateHabit={updateHabit}
                onDeleteHabit={deleteHabit}
                onToggleHabitDate={toggleHabitDate}
                selectedDomain={selectedDomain}
                searchQuery={searchQuery}
              />
            </div>

            {/* Right Column: Journal & Mindset */}
            <div className="lg:col-span-5 space-y-6">
              <JournalSection
                journals={journals}
                onAddJournal={addJournal}
                onUpdateJournal={updateJournal}
                onDeleteJournal={deleteJournal}
                todayTasksCompleted={todayCompletedTasks}
                todayHabitsCompleted={todayCompletedHabitsList}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Dedicated Tasks View */}
        {activeTab === 'tasks' && (
          <div className="max-w-4xl mx-auto">
            <TaskSection
              tasks={tasks}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onToggleStatus={toggleTaskStatus}
              onToggleSubtask={toggleSubtask}
              selectedDomain={selectedDomain}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Tab 3: Dedicated Habits View */}
        {activeTab === 'habits' && (
          <div className="max-w-4xl mx-auto">
            <HabitSection
              habits={habits}
              onAddHabit={addHabit}
              onUpdateHabit={updateHabit}
              onDeleteHabit={deleteHabit}
              onToggleHabitDate={toggleHabitDate}
              selectedDomain={selectedDomain}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Tab 4: Dedicated Journal View */}
        {activeTab === 'journal' && (
          <div className="max-w-4xl mx-auto">
            <JournalSection
              journals={journals}
              onAddJournal={addJournal}
              onUpdateJournal={updateJournal}
              onDeleteJournal={deleteJournal}
              todayTasksCompleted={todayCompletedTasks}
              todayHabitsCompleted={todayCompletedHabitsList}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </main>

      {/* Footer info & GitHub Pages / PWA status */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Life OS • Unified Tasks, Habits &amp; Daily Journal</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400/90 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PWA &amp; GitHub Pages Ready
            </span>
            <span>•</span>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="text-slate-400 hover:text-slate-200 transition underline"
            >
              Export Data Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Universal Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={addTask}
        onAddHabit={addHabit}
        onAddJournal={addJournal}
      />

      {/* Daily Review / Synthesis Modal */}
      <DailyReviewModal
        isOpen={isDailyReviewOpen}
        onClose={() => setIsDailyReviewOpen(false)}
        tasksCompleted={todayCompletedTasks}
        tasksPending={todayPendingTasks}
        habits={habits}
        todayJournal={todayJournal}
        dailyScore={dailyScore}
        onOpenQuickJournal={() => setActiveTab('journal')}
      />

      {/* Data Backup & Restore Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onExport={exportDataJSON}
        onImport={importDataJSON}
        onReset={resetToDefaultData}
      />

      {/* Offline Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
