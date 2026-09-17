import React from 'react';
import { ActiveTab, LifeDomain } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  BookOpen,
  CalendarCheck,
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
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <Flame className="w-4 h-4" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'review', label: 'Review', icon: <CalendarCheck className="w-4 h-4" /> },
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
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-[#24282f] bg-[#0c0d10]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-2.5">
            {/* Brand Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-zinc-900 border border-[#2e333b] shadow-inner">
                <span className="font-mono text-xs font-bold tracking-wider text-amber-400">OS</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-100">Life OS</span>
                  <span className="font-mono text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                    {dailyScore}%
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 hidden sm:block font-mono uppercase tracking-wider">
                  Personal Operating System
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 rounded-xl border border-[#24282f] bg-[#121316] p-1">
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
                        ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Top Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick Add Button (Desktop) */}
              <button
                id="quick-add-btn"
                onClick={onOpenQuickAdd}
                className="hidden sm:flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 text-xs shadow-sm transition active:scale-95 cursor-pointer"
                title="Quick capture (shortcut: C)"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Capture</span>
              </button>

              {/* PWA Install Button */}
              <PWAInstallButton />

              {/* Data Management Backup/Restore */}
              <button
                id="data-backup-btn"
                onClick={onOpenDataModal}
                className="flex items-center justify-center rounded-lg border border-[#24282f] bg-[#121316] p-2 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition active:scale-95 min-h-[36px] min-w-[36px]"
                title="Backup, Import & Export Data"
              >
                <Database className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader: Domain Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-2 border-t border-[#1e2227] text-xs">
            {/* Life Domain Filter Chips (Horizontal Touch Scroll on Mobile) */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5 -mx-1 px-1 touch-pan-x">
              {domains.map((domain) => {
                const isSelected = selectedDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    id={`domain-filter-${domain.id}`}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition whitespace-nowrap min-h-[32px] flex items-center shrink-0 active:scale-95 ${
                      isSelected
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-semibold'
                        : 'bg-[#14161a] text-zinc-400 hover:text-zinc-200 border border-[#24282f]'
                    }`}
                  >
                    {domain.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                id="global-search-input"
                type="text"
                placeholder="Filter tasks, habits, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-[#24282f] bg-[#121316] pl-8 pr-7 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition min-h-[34px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300 min-h-[24px] min-w-[24px] flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-First Bottom Navigation Dock (Optimized for Portrait Thumb-Reach) */}
      <nav
        id="mobile-bottom-dock"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-[#24282f] bg-[#0c0d10]/95 backdrop-blur-xl px-2 pt-1 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] shadow-2xl"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.slice(0, 2).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[10px] font-medium transition active:scale-95 ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="p-1">{tab.icon}</div>
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Center Elevated Quick Add Action FAB */}
          <div className="flex items-center justify-center -mt-5">
            <button
              onClick={onOpenQuickAdd}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 active:scale-90 transition-transform border-2 border-[#0c0d10] cursor-pointer"
              title="Quick Capture"
              aria-label="Quick Capture"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {tabs.slice(2).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'review') {
                    onOpenDailyReview();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 text-[10px] font-medium transition active:scale-95 ${
                  isActive ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="p-1">{tab.icon}</div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

