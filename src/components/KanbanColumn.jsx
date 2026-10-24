import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Inbox, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import TaskCard from './TaskCard';

/**
 * KanbanColumn Component (Phases 1, 2, 3)
 * Displays a single droppable column ('To Do', 'In Progress', 'Done')
 * with live badge count, empty state, and mapped Sortable TaskCards.
 */
export default function KanbanColumn({
  column,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onQuickAddTask,
  showQuickMove,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const getColumnIcon = (id) => {
    switch (id) {
      case 'todo':
        return <ListTodo className="w-4 h-4 text-indigo-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return null;
    }
  };

  const getHeaderAccent = (id) => {
    switch (id) {
      case 'todo':
        return {
          pill: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          topLine: 'bg-indigo-500',
        };
      case 'in-progress':
        return {
          pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          topLine: 'bg-amber-500',
        };
      case 'done':
        return {
          pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          topLine: 'bg-emerald-500',
        };
      default:
        return {
          pill: 'bg-slate-700 text-slate-300 border-slate-600',
          topLine: 'bg-slate-500',
        };
    }
  };

  const accent = getHeaderAccent(column.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-2xl border transition-all duration-200 ${
        isOver
          ? 'bg-slate-800/80 border-indigo-500/60 ring-2 ring-indigo-500/30'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
      } backdrop-blur-md shadow-lg overflow-hidden`}
    >
      {/* Decorative top accent indicator line */}
      <div className={`h-1 w-full ${accent.topLine}`} />

      {/* Column Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {getColumnIcon(column.id)}
          <h2 className="font-bold text-sm tracking-tight text-white">
            {column.title}
          </h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold border ${accent.pill}`}
          >
            {tasks.length}
          </span>
        </div>

        {/* Quick Add Task button for this specific column */}
        <button
          type="button"
          onClick={() => onQuickAddTask(column.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
          title={`Add task directly to ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task List / Sortable Container */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto min-h-[380px] max-h-[calc(100vh-230px)]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              showQuickMove={showQuickMove}
            />
          ))}
        </SortableContext>

        {/* Empty State Display */}
        {tasks.length === 0 && (
          <div className="h-48 border-2 border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-500 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-400">
              No tasks in {column.title}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Drag cards here or click + to add
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
