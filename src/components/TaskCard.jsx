import React, { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  MinusCircle, 
  Clock,
  Tag
} from 'lucide-react';

/**
 * TaskCard Component (Phases 1, 2, 3)
 * Fully compliant with:
 * - P0: Add/Delete/Move between columns (Arrow buttons)
 * - P1: Inline Editing (Title, Description, Priority) + Conditional Priority Borders
 * - P2: Drag-and-Drop integration via @dnd-kit/sortable
 */
export default function TaskCard({
  task,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  showQuickMove = true,
  isOverlay = false,
}) {
  // P1: Local state for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editTag, setEditTag] = useState(task.tag || 'General');

  const titleInputRef = useRef(null);

  // Synchronize local edit state if prop changes while not editing
  useEffect(() => {
    if (!isEditing) {
      setEditTitle(task.title);
      setEditDescription(task.description || '');
      setEditPriority(task.priority);
      setEditTag(task.tag || 'General');
    }
  }, [task, isEditing]);

  // Focus input automatically when entering edit mode
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing]);

  // P2: Sortable hook configuration
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isEditing || isOverlay,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // P1: Critical QA Check - Conditional CSS Borders & Badges based on Priority
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return {
          // Exact required classes: border-l-4 border-red-500 + full subtle border-red-500/60
          borderClasses: 'border-l-4 border-red-500 border-red-500/60',
          badgeClasses: 'bg-red-500/15 text-red-300 border border-red-500/30',
          dotClass: 'bg-red-500',
          icon: Flame,
          label: 'High',
        };
      case 'Medium':
        return {
          // Exact required classes: border-l-4 border-yellow-400 + full subtle border-yellow-400/60
          borderClasses: 'border-l-4 border-yellow-400 border-yellow-400/60',
          badgeClasses: 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/30',
          dotClass: 'bg-yellow-400',
          icon: ShieldAlert,
          label: 'Medium',
        };
      case 'Low':
      default:
        return {
          // Exact required classes: border-l-4 border-emerald-500 + full subtle border-emerald-500/60
          borderClasses: 'border-l-4 border-emerald-500 border-emerald-500/60',
          badgeClasses: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
          dotClass: 'bg-emerald-500',
          icon: MinusCircle,
          label: 'Low',
        };
    }
  };

  const priorityMeta = getPriorityStyle(isEditing ? editPriority : task.priority);
  const PriorityIcon = priorityMeta.icon;

  // Save inline edit
  const handleSaveEdit = (e) => {
    if (e) e.stopPropagation();
    const trimmed = editTitle.trim();
    if (!trimmed) return;

    onUpdateTask(task.id, {
      title: trimmed,
      description: editDescription.trim(),
      priority: editPriority,
      tag: editTag,
    });
    setIsEditing(false);
  };

  // Cancel inline edit
  const handleCancelEdit = (e) => {
    if (e) e.stopPropagation();
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditTag(task.tag || 'General');
    setIsEditing(false);
  };

  // Keyboard navigation inside edit mode
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // P0 Move helpers
  const handleMoveLeft = (e) => {
    e.stopPropagation();
    if (task.status === 'done') {
      onMoveTask(task.id, 'in-progress');
    } else if (task.status === 'in-progress') {
      onMoveTask(task.id, 'todo');
    }
  };

  const handleMoveRight = (e) => {
    e.stopPropagation();
    if (task.status === 'todo') {
      onMoveTask(task.id, 'in-progress');
    } else if (task.status === 'in-progress') {
      onMoveTask(task.id, 'done');
    }
  };

  const formattedDate = new Date(task.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isEditing && !isOverlay ? attributes : {})}
      {...(!isEditing && !isOverlay ? listeners : {})}
      className={`group relative rounded-xl bg-slate-800/90 text-slate-100 p-4 transition-all duration-150 backdrop-blur-sm shadow-md hover:shadow-xl ${
        priorityMeta.borderClasses
      } ${
        isDragging
          ? 'opacity-30 scale-[0.98] border-dashed border-slate-600'
          : isOverlay
          ? 'shadow-2xl shadow-indigo-500/20 scale-105 rotate-2 cursor-grabbing z-50 ring-2 ring-indigo-500/50'
          : 'hover:-translate-y-0.5'
      }`}
    >
      {/* CARD CONTENT: INLINE EDITING STATE (P1) */}
      {isEditing ? (
        <div 
          className="space-y-3 cursor-default" 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
              Editing Task
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                title="Save changes (Enter)"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1 rounded-md bg-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                title="Cancel (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title Editor */}
          <input
            ref={titleInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Task title..."
            className="w-full px-2.5 py-1.5 text-sm font-medium bg-slate-900/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />

          {/* Description Editor */}
          <textarea
            rows={2}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add description..."
            className="w-full px-2.5 py-1.5 text-xs bg-slate-900/90 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />

          {/* Priority & Tag Inline Chooser */}
          <div className="flex items-center gap-2 pt-1">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="px-2 py-1 text-xs rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>

            <input
              type="text"
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
              placeholder="Tag (e.g. UI/UX)"
              className="flex-1 px-2 py-1 text-xs rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <p className="text-[10px] text-slate-400">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-700 text-slate-300">Enter</kbd> to save, <kbd className="px-1 py-0.5 rounded bg-slate-700 text-slate-300">Esc</kbd> to cancel
          </p>
        </div>
      ) : (
        /* CARD CONTENT: STANDARD VIEW */
        <div className="flex flex-col space-y-2.5">
          {/* Top Bar: Tag, Priority Badge, Drag Handle, & Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Priority Badge with Icon */}
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${priorityMeta.badgeClasses}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dotClass}`}></span>
                <PriorityIcon className="w-3 h-3" />
                <span>{priorityMeta.label}</span>
              </span>

              {/* Tag pill */}
              {task.tag && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300 border border-slate-600/40 font-mono">
                  {task.tag}
                </span>
              )}
            </div>

            {/* Top Right Action Icons */}
            <div 
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* P1: Inline Edit Trigger */}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 transition-colors"
                title="Edit task (inline)"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>

              {/* P0: Delete Task Trigger */}
              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Tactile Drag Handle indicator */}
              <div 
                className="p-1 text-slate-500 group-hover:text-slate-300 cursor-grab active:cursor-grabbing transition-colors" 
                title="Drag to reorder or move column"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Title (Clicking directly triggers inline edit) */}
          <h3
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-slate-100 hover:text-indigo-300 cursor-pointer transition-colors leading-snug tracking-tight"
            title="Click to edit task title inline"
          >
            {task.title}
          </h3>

          {/* Optional Description */}
          {task.description && (
            <p 
              onClick={() => setIsEditing(true)}
              className="text-xs text-slate-400 line-clamp-3 leading-relaxed cursor-pointer hover:text-slate-300"
              title="Click to edit description inline"
            >
              {task.description}
            </p>
          )}

          {/* Bottom Card Footer: Date & P0 Quick Directional Move Controls */}
          <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </div>

            {/* P0: Directional Move Controls (← / →) */}
            {showQuickMove && (
              <div 
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {/* Move Left */}
                {task.status !== 'todo' && (
                  <button
                    type="button"
                    onClick={handleMoveLeft}
                    className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/50 transition-colors"
                    title={task.status === 'done' ? 'Move to In Progress' : 'Move to To Do'}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span className="hidden sm:inline">
                      {task.status === 'done' ? 'Progress' : 'To Do'}
                    </span>
                  </button>
                )}

                {/* Move Right */}
                {task.status !== 'done' && (
                  <button
                    type="button"
                    onClick={handleMoveRight}
                    className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30 transition-colors"
                    title={task.status === 'todo' ? 'Move to In Progress' : 'Move to Done'}
                  >
                    <span className="hidden sm:inline">
                      {task.status === 'todo' ? 'Progress' : 'Done'}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
