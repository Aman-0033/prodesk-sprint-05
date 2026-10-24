import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  Plus, 
  SlidersHorizontal, 
  Kanban, 
  MoveRight, 
  Sparkles,
  ShieldAlert,
  Flame,
  MinusCircle,
  CheckCircle2
} from 'lucide-react';

/**
 * Navbar Component (Phase 1, 2, 3)
 * Provides SaaS branding, global real-time search, priority filtering pills,
 * Quick Move / Drag-and-Drop interaction toggles, and demo reset actions.
 */
export default function Navbar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  showQuickMove,
  onToggleQuickMove,
  onResetDemoData,
  onOpenTaskModal,
  totalTasksCount,
  filteredTasksCount
}) {
  const priorityOptions = [
    { label: 'All', value: 'All', icon: Sparkles, color: 'indigo' },
    { label: 'High', value: 'High', icon: Flame, color: 'red' },
    { label: 'Medium', value: 'Medium', icon: ShieldAlert, color: 'yellow' },
    { label: 'Low', value: 'Low', icon: MinusCircle, color: 'emerald' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      {/* Top Banner / Branding Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3 border-b border-slate-800/60">
          {/* Logo & Sprint Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Kanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Prodesk<span className="text-indigo-400">IT</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Sprint 5
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enterprise Kanban Task Board • Continuous Workflow Engine
              </p>
            </div>
          </div>

          {/* Action Tools: Quick Move Toggle, Reset Demo Data, Add Task */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* P0 / P2 Quick Move Mode Toggle */}
            <button
              type="button"
              onClick={onToggleQuickMove}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 border ${
                showQuickMove
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Toggle P0 Arrow Move controls alongside P2 Drag & Drop"
            >
              <MoveRight className={`w-3.5 h-3.5 ${showQuickMove ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Quick Move Controls</span>
              <span
                className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  showQuickMove ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {showQuickMove ? 'Active' : 'Off'}
              </span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={onResetDemoData}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-800 hover:text-white transition-all duration-200"
              title="Restore initial 5 software engineering tasks"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset Demo Data</span>
              <span className="sm:hidden">Reset</span>
            </button>

            {/* Create Task Button */}
            <button
              type="button"
              onClick={onOpenTaskModal}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/10 hover:shadow-indigo-500/40 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Bottom Search & Filter Controls Bar */}
        <div className="py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Global Search Bar (Phase 3 / P2) */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks by title, description, or tag..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-800/70 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700/60 focus:border-indigo-500/70 rounded-xl text-slate-100 placeholder-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-md"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority Filter Pills (Phase 3 / P2) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-slate-400 mr-1.5 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Priority:</span>
            </div>
            {priorityOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = priorityFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onPriorityFilterChange(opt.value)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                    isSelected
                      ? opt.value === 'High'
                        ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20'
                        : opt.value === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-sm shadow-yellow-500/20'
                        : opt.value === 'Low'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                        : 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status summary info */}
          <div className="hidden lg:flex items-center text-xs text-slate-400 gap-1.5 font-mono">
            <span>Showing:</span>
            <span className="font-semibold text-slate-200">{filteredTasksCount}</span>
            <span>of</span>
            <span className="font-semibold text-slate-200">{totalTasksCount}</span>
            <span>tasks</span>
          </div>
        </div>
      </div>
    </header>
  );
}
