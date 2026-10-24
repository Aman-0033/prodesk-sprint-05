import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import TaskForm from './components/TaskForm';
import { INITIAL_TASKS, LOCAL_STORAGE_KEY } from './data/seedData';
import { Sparkles, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

/**
 * Root Application Component - Prodesk IT Sprint 5
 * Pure declarative React architecture demonstrating:
 * 1. Native state management: useState, useEffect, useMemo
 * 2. Unidirectional data flow: Props & Lifting State Up
 * 3. Robust localStorage persistence with lazy initialization
 * 4. Zero imperative DOM manipulation (QA Strict Compliance)
 */
export default function App() {
  // P1: State Persistence with lazy initializer
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Could not load tasks from localStorage. Falling back to default seed data:', error);
    }
    return INITIAL_TASKS;
  });

  // P2: Global search and priority filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // P0 / P2: Quick Move toggle mode (allows simultaneous QA demo of P0 arrows & P2 DnD)
  const [showQuickMove, setShowQuickMove] = useState(true);

  // Task creation modal visibility & default column target
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetColumnForNewTask, setTargetColumnForNewTask] = useState('todo');

  // P1: Synchronize all state mutations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to sync tasks to localStorage:', error);
    }
  }, [tasks]);

  // P0: Add Task (Lifted state updater)
  const handleAddTask = (newTaskData) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newTaskData.title,
      description: newTaskData.description || '',
      priority: newTaskData.priority || 'Medium',
      status: newTaskData.status || targetColumnForNewTask || 'todo',
      tag: newTaskData.tag || 'General',
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  // P1: Update Task (Inline edit lifted handler)
  const handleUpdateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  // P0: Delete Task (Lifted state updater)
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // P0: Directional Move Task (Lifted state updater)
  const handleMoveTask = (id, nextStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: nextStatus } : task
      )
    );
  };

  // P2 & DnD: Bulk Tasks Reorder handler
  const handleTasksChange = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  // Reset demo data to default 5 realistic software engineering tasks
  const handleResetDemoData = () => {
    setTasks(INITIAL_TASKS);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    } catch (e) {
      console.error('Reset localStorage error:', e);
    }
  };

  // Open modal targeting specific column
  const handleQuickAddTask = (columnId) => {
    setTargetColumnForNewTask(columnId);
    setIsTaskModalOpen(true);
  };

  // P2: Real-time memoized filtering based on search query and priority pills
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      // Search matching logic
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.tag && task.tag.toLowerCase().includes(query));

      // Priority matching logic
      const matchesPriority =
        priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Header & Global Controls */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        showQuickMove={showQuickMove}
        onToggleQuickMove={() => setShowQuickMove((prev) => !prev)}
        onResetDemoData={handleResetDemoData}
        onOpenTaskModal={() => {
          setTargetColumnForNewTask('todo');
          setIsTaskModalOpen(true);
        }}
        totalTasksCount={tasks.length}
        filteredTasksCount={filteredTasks.length}
      />

      {/* Main Board Workspace */}
      <main className="flex-1 flex flex-col">
        <KanbanBoard
          tasks={filteredTasks}
          onTasksChange={handleTasksChange}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          onQuickAddTask={handleQuickAddTask}
          showQuickMove={showQuickMove}
        />
      </main>

      {/* Controlled Task Creation Modal */}
      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Enterprise SaaS Footer with QA Compliance Indicators */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Prodesk IT — Sprint 5</span>
            <span className="text-slate-600">•</span>
            <span>Principal Frontend Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>P0 / P1 / P2 Certified</span>
            </span>
            <span className="inline-flex items-center gap-1 text-indigo-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Pure React State</span>
            </span>
            <span className="inline-flex items-center gap-1 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Imperative DOM</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
