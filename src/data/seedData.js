/**
 * Seed data and column constants for Prodesk IT - Sprint 5 Kanban Board
 */

export const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    description: 'Backlog items and upcoming tasks scheduled for this sprint',
    accentColor: 'indigo',
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-400',
    badgeBorder: 'border-indigo-500/30',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    description: 'Tasks actively being designed, implemented, or reviewed',
    accentColor: 'amber',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
  },
  {
    id: 'done',
    title: 'Done',
    description: 'Completed tasks verified against sprint acceptance criteria',
    accentColor: 'emerald',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
  },
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Implement OAuth2 & Refresh Token Rotation',
    description: 'Setup JWT authentication pipeline with automated token refresh on 401 interceptor.',
    priority: 'High',
    status: 'todo',
    tag: 'Security',
    createdAt: '2026-10-24T09:30:00Z',
  },
  {
    id: 'task-102',
    title: 'Optimize Vite Build Chunks & Dynamic Imports',
    description: 'Analyze rollup bundle visualizations and code-split secondary admin charts.',
    priority: 'Medium',
    status: 'todo',
    tag: 'Performance',
    createdAt: '2026-10-24T10:15:00Z',
  },
  {
    id: 'task-103',
    title: 'Refactor Kanban State to Pure Declarative Hooks',
    description: 'Eliminate all direct DOM selectors and establish clean unidirectional prop flow.',
    priority: 'High',
    status: 'in-progress',
    tag: 'Architecture',
    createdAt: '2026-10-24T11:00:00Z',
  },
  {
    id: 'task-104',
    title: 'Design Responsive Column Layout & Touch Controls',
    description: 'Ensure smooth horizontal scrolling on mobile viewports with tactile touch drag handles.',
    priority: 'Low',
    status: 'in-progress',
    tag: 'UI/UX',
    createdAt: '2026-10-24T13:45:00Z',
  },
  {
    id: 'task-105',
    title: 'Setup Vitest & Cypress Automated Regression Suite',
    description: 'Automate unit testing for task state reducers and E2E drag-and-drop verification.',
    priority: 'Medium',
    status: 'done',
    tag: 'DevOps',
    createdAt: '2026-10-24T14:20:00Z',
  },
];

export const LOCAL_STORAGE_KEY = 'prodesk_kanban_tasks';
