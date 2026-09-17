import React from 'react';
import { ActiveTab, LifeDomain } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  BookOpen,
  Sparkles,
  Plus,
  Database,
  Search,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedDomain: LifeDomain | 'all';
  setSelectedDomain: (domain: LifeDomain | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenQuickAdd: () => void;
  onOpenDataModal: () => void;
  onOpenDailyReview: () => void;
  dailyScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedDomain,
  setSelectedDomain,
  searchQuery,
  setSearchQuery,
  onOpenQuickAdd,
  onOpenDataModal,
  onOpenDailyReview,
  dailyScore,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <Flame className="w-4 h-4" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'review', label: 'Synthesis', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const domains: { id: LifeDomain | 'all'; label: string }[] = [
    { id: 'all', label: 'All Life' },
    { id: 'work', label: 'Work' },
    { id: 'personal', label: 'Personal' },
    { id: 'health', label: 'Health' },
    { id: 'learning', label: 'Learning' },
    { id: 'finance', label: 'Finance' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-emerald-400 p-[1.5px] shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <span className="text-sm font-black tracking-tight text-white">OS</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold tracking-tight text-white">Life OS</h1>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  {dailyScore}% Score
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Tasks • Habits • Journal</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => {
                    if (tab.id === 'review') {
                      onOpenDailyReview();
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Quick Add Button */}
            <button
              id="quick-add-btn"
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 text-xs font-semibold shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
              title="Quick capture (Task, Habit, or Journal)"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Capture</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Data Management Backup/Restore */}
            <button
              id="data-backup-btn"
              onClick={onOpenDataModal}
              className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition active:scale-95"
              title="Backup, Import & Export Data"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Sub-bar: Domain Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2.5 border-t border-slate-900 text-xs">
          {/* Mobile Navigation Tabs */}
          <div className="flex md:hidden items-center justify-between w-full overflow-x-auto pb-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'review') {
                    onOpenDailyReview();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 bg-slate-900 border border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Life Domain Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {domains.map((domain) => {
              const isSelected = selectedDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  id={`domain-filter-${domain.id}`}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-200 text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {domain.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search tasks, habits, reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-slate-300"
              >
                esc
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
