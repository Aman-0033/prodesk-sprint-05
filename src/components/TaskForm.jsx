import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, Sparkles, Tag, AlignLeft, Layers } from 'lucide-react';

/**
 * TaskForm Component (Phase 1 / P0)
 * Controlled form component to create new tasks with Title, optional Description,
 * Tag, and Priority Dropdown ('High', 'Medium', 'Low').
 * Strictly follows declarative React patterns with local state and lifted onAddTask.
 */
export default function TaskForm({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tag, setTag] = useState('Frontend');
  const [status, setStatus] = useState('todo');
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setTag('Frontend');
      setStatus('todo');
      setError('');
    }
  }, [isOpen]);

  // Handle escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required.');
      return;
    }

    onAddTask({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      tag,
      status,
    });

    onClose();
  };

  const tagPresets = ['Frontend', 'Backend', 'Architecture', 'DevOps', 'Security', 'UI/UX', 'Testing'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 id="task-form-title" className="text-base font-semibold text-white">
                Create New Task
              </h2>
              <p className="text-xs text-slate-400">
                Add an engineering item to the sprint backlog
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Implement OAuth2 Refresh Token Rotation"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="task-description" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key technical details, acceptance criteria, or context..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-800/70 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors resize-none"
            />
          </div>

          {/* Priority & Status Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Selector */}
            <div>
              <label htmlFor="task-priority" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Priority Level
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-800/70 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors cursor-pointer"
              >
                <option value="High" className="bg-slate-900 text-red-400">🔴 High Priority</option>
                <option value="Medium" className="bg-slate-900 text-yellow-400">🟡 Medium Priority</option>
                <option value="Low" className="bg-slate-900 text-emerald-400">🟢 Low Priority</option>
              </select>
            </div>

            {/* Initial Target Column */}
            <div>
              <label htmlFor="task-status" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Initial Column
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-800/70 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors cursor-pointer"
              >
                <option value="todo" className="bg-slate-900 text-indigo-300">To Do</option>
                <option value="in-progress" className="bg-slate-900 text-amber-300">In Progress</option>
                <option value="done" className="bg-slate-900 text-emerald-300">Done</option>
              </select>
            </div>
          </div>

          {/* Tag Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category Tag
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tagPresets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    tag === t
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
