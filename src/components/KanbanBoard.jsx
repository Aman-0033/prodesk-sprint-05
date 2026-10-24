import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { COLUMNS } from '../data/seedData';

/**
 * KanbanBoard Component (Phases 1, 2, 3)
 * Orchestrates the 3-column Kanban layout with full @dnd-kit integration:
 * - Pointer & Keyboard sensors with 5px distance constraint to allow smooth clicks
 * - Dynamic DragOverlay with 3D elevation and tilt
 * - Multi-column drag-over and sortable reordering
 */
export default function KanbanBoard({
  tasks,
  onTasksChange,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  onQuickAddTask,
  showQuickMove,
}) {
  const [activeTask, setActiveTask] = useState(null);

  // Configure sensors for desktop, laptop trackpads, and keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag begins, preventing accidental drag on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Case 1: Dragging a task over another task in a different column
    if (isOverTask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (activeIndex === -1 || overIndex === -1) return;

      if (tasks[activeIndex].status !== tasks[overIndex].status) {
        const updated = [...tasks];
        const newStatus = tasks[overIndex].status;
        updated[activeIndex] = { ...updated[activeIndex], status: newStatus };
        onTasksChange(arrayMove(updated, activeIndex, overIndex));
      }
    }

    // Case 2: Dragging a task directly over an empty or populated column
    if (isOverColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return;

      const columnId = overId;
      if (tasks[activeIndex].status !== columnId) {
        const updated = [...tasks];
        updated[activeIndex] = { ...updated[activeIndex], status: columnId };
        onTasksChange(updated);
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;

    // If dropped over another task
    if (over.data.current?.type === 'Task') {
      const overIndex = tasks.findIndex((t) => t.id === overId);
      if (overIndex !== -1) {
        const updated = [...tasks];
        const targetStatus = tasks[overIndex].status;
        updated[activeIndex] = { ...updated[activeIndex], status: targetStatus };
        onTasksChange(arrayMove(updated, activeIndex, overIndex));
      }
    } else if (over.data.current?.type === 'Column') {
      // If dropped over a column
      const targetColumnId = overId;
      const updated = [...tasks];
      updated[activeIndex] = { ...updated[activeIndex], status: targetColumnId };
      onTasksChange(updated);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 3-Column Kanban Grid (Phase 1 / P0) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onMoveTask={onMoveTask}
                onQuickAddTask={onQuickAddTask}
                showQuickMove={showQuickMove}
              />
            );
          })}
        </div>
      </div>

      {/* Tactile Drag Overlay Clone (Phase 3 / P2) */}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask ? (
          <div className="w-80 cursor-grabbing">
            <TaskCard
              task={activeTask}
              isOverlay={true}
              onUpdateTask={() => {}}
              onDeleteTask={() => {}}
              onMoveTask={() => {}}
              showQuickMove={showQuickMove}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
