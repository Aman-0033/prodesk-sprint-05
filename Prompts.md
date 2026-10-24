# Prodesk IT — Sprint 5 QA Engineering Protocol & Architectural Prompts

This document provides in-depth technical documentation covering the architectural paradigms, state transitions, design patterns, and QA compliance standards implemented in the **Prodesk IT — Sprint 5 Kanban Task Board**.

---

## 1. Declarative React State vs. Imperative DOM Manipulation

### 1.1 The Pitfalls of Imperative DOM Manipulation
In traditional vanilla JavaScript or legacy applications, UI state is mutated directly via imperative DOM queries and mutations:
```javascript
// ❌ ANTI-PATTERN: Imperative DOM Manipulation
const taskCard = document.getElementById(`task-${taskId}`);
const titleElement = taskCard.querySelector('.task-title');
titleElement.innerText = newTitle; // Direct mutation bypasses framework lifecycle
taskCard.classList.remove('border-yellow-400');
taskCard.classList.add('border-red-500'); // Fragile class-string coupling
```

#### Why Imperative DOM Manipulation Fails in Production:
1. **Source of Truth Fragmentation:** The DOM becomes a secondary, unsynchronized store of state. When another process, network call, or parent component reads or writes data, the UI and internal memory drift out of sync.
2. **Memory Leaks & Event Detachment:** Dynamically replacing DOM nodes often orphans attached event listeners or causes memory leaks in Single Page Applications.
3. **Loss of Framework Reconciliation:** React maintains a Virtual DOM (VDOM) tree. Manually altering real DOM nodes behind React's back confuses fiber reconciliation and triggers hydration or DOM mismatch errors.

### 1.2 The Declarative Paradigm in React
In **Prodesk IT — Sprint 5**, every component is **100% declarative**. The DOM is treated strictly as a pure mathematical projection of state:
$$\text{UI} = f(\text{State})$$

```jsx
// ✅ PRODUCTION STANDARD: Declarative State Projection
function TaskCard({ task, onUpdateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  // Border styles derived purely from state
  const priorityBorder = 
    task.priority === 'High' ? 'border-l-4 border-red-500 border-red-500/60' :
    task.priority === 'Medium' ? 'border-l-4 border-yellow-400 border-yellow-400/60' :
    'border-l-4 border-emerald-500 border-emerald-500/60';

  return (
    <div className={`rounded-xl bg-slate-800/90 ${priorityBorder}`}>
      {isEditing ? (
        <input 
          value={editTitle} 
          onChange={(e) => setEditTitle(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onUpdateTask(task.id, { title: editTitle.trim() });
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <h3 onClick={() => setIsEditing(true)}>{task.title}</h3>
      )}
    </div>
  );
}
```

---

## 2. Unidirectional Data Flow: Props & Lifting State Up

Per Sprint 5 FAQ #5, external state management libraries (Redux, Zustand) are avoided to demonstrate native React state mastery. We employ **Unidirectional Data Flow** with **Lifting State Up**.

### 2.1 Parent-to-Child (Props Drilling)
Data flows downward through immutable props. The parent container (`App.jsx`) owns the single source of truth (`tasks`, `searchQuery`, `priorityFilter`) and distributes read-only slices to child components:

```
App.jsx (Source of Truth: tasks, searchQuery, priorityFilter)
  │
  ├── Navbar.jsx (Receives: searchQuery, priorityFilter, counts)
  │
  └── KanbanBoard.jsx (Receives: filteredTasks)
        │
        └── KanbanColumn.jsx (Receives: columnDef, columnTasks)
              │
              └── TaskCard.jsx (Receives: task, showQuickMove)
```

### 2.2 Child-to-Parent (Lifting State Up)
When a child component (e.g., `TaskCard` or `TaskForm`) needs to alter data, it **never mutates props directly**. Instead, it triggers callback functions passed down from the root container (`App.jsx`).

#### Concrete Implementation Walkthrough:
```jsx
// 1. In App.jsx (Root State Container)
const [tasks, setTasks] = useState(INITIAL_TASKS);

// State mutators defined at the top:
const handleAddTask = (newTaskData) => {
  setTasks((prev) => [newTaskData, ...prev]); // Immutable array prepending
};

const handleUpdateTask = (id, updatedFields) => {
  setTasks((prev) =>
    prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
  ); // Immutable object mapping
};

const handleDeleteTask = (id) => {
  setTasks((prev) => prev.filter((task) => task.id !== id)); // Immutable filtering
};

const handleMoveTask = (id, nextStatus) => {
  setTasks((prev) =>
    prev.map((task) => (task.id === id ? { ...task, status: nextStatus } : task))
  );
};
```

These functions are passed through props:
- `App` passes `onUpdateTask={handleUpdateTask}` to `KanbanBoard`
- `KanbanBoard` passes `onUpdateTask` to `KanbanColumn`
- `KanbanColumn` passes `onUpdateTask` to `TaskCard`
- Inside `TaskCard`:
```jsx
// 2. In TaskCard.jsx
const handleSaveEdit = () => {
  onUpdateTask(task.id, {
    title: editTitle.trim(),
    description: editDescription.trim(),
    priority: editPriority,
  });
  setIsEditing(false);
};
```

This guarantees that `App.jsx` remains the sole coordinator of truth while child components remain modular, reusable, and easily testable.

---

## 3. Persistent State: Lazy Initialization & `useEffect` Synchronization

### 3.1 Lazy `useState` Initialization (Performance Optimization)
Calling `localStorage.getItem()` synchronously on every re-render incurs unnecessary disk I/O and JSON parsing overhead. By passing an initializer function (`() => ...`) to `useState`, React executes the storage read **strictly once during initial mount**:

```javascript
const [tasks, setTasks] = useState(() => {
  try {
    const saved = localStorage.getItem('prodesk_kanban_tasks');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to parse localStorage tasks:', error);
  }
  // Fallback seed data (5 realistic software engineering tasks)
  return INITIAL_TASKS;
});
```

### 3.2 Automated Persistence via `useEffect`
Whenever any task is added, edited, deleted, moved, or reordered, the `tasks` state identity changes, triggering the synchronized `useEffect`:

```javascript
useEffect(() => {
  try {
    localStorage.setItem('prodesk_kanban_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to sync tasks to localStorage:', error);
  }
}, [tasks]); // Runs reactively on every state mutation
```

---

## 4. Drag-and-Drop Architecture with `@dnd-kit`

### 4.1 Why `@dnd-kit` over Legacy Libraries
1. **React 18 & 19 Concurrency Compatible:** Unlike HTML5 native drag-and-drop or older React-DnD wrappers, `@dnd-kit` does not break under StrictMode and handles virtualized lists cleanly.
2. **Declarative Collision Detection:** Provides algorithms like `closestCorners` which calculate distance vectors to droppable bounding boxes.
3. **Accessibility (a11y):** Supports keyboard-based column moves (`sortableKeyboardCoordinates`) and touch devices.

### 4.2 Sensor Configuration
To prevent clicks on buttons, inputs, or edit icons from unintentionally firing drag events, we enforce an activation constraint of `distance: 5`:

```javascript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // 5px movement required before drag begins
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

### 4.3 Multi-Column Reordering Algorithm
Handling drag events across columns requires immutable state reconstruction:

1. **`onDragStart`:** Identifies the active task and populates `activeTask` state to mount the floating `DragOverlay`.
2. **`onDragOver`:** If the dragged item hovers over another column or an item in a different column, the task's status is adjusted dynamically.
3. **`onDragEnd`:** Finalizes the drop. If reordering within the same column or dropping into another column, `arrayMove` computes the new index positions:

```javascript
const handleDragEnd = (event) => {
  const { active, over } = event;
  setActiveTask(null);

  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const activeIndex = tasks.findIndex((t) => t.id === activeId);
  if (activeIndex === -1) return;

  if (over.data.current?.type === 'Task') {
    const overIndex = tasks.findIndex((t) => t.id === overId);
    if (overIndex !== -1) {
      const updated = [...tasks];
      const targetStatus = tasks[overIndex].status;
      updated[activeIndex] = { ...updated[activeIndex], status: targetStatus };
      onTasksChange(arrayMove(updated, activeIndex, overIndex));
    }
  } else if (over.data.current?.type === 'Column') {
    const targetColumnId = overId;
    const updated = [...tasks];
    updated[activeIndex] = { ...updated[activeIndex], status: targetColumnId };
    onTasksChange(updated);
  }
};
```

---

## 5. QA Verification Checklist

| Rubric Spec | Feature | Verification Status | Implementation Location |
|---|---|---|---|
| **P0** | 3-Column Responsive Board (`To Do`, `In Progress`, `Done`) | ✅ Passed | `src/components/KanbanBoard.jsx` |
| **P0** | Add Task Form with Title & Priority | ✅ Passed | `src/components/TaskForm.jsx` |
| **P0** | Delete Task Universal Trash Action | ✅ Passed | `src/components/TaskCard.jsx` |
| **P0** | Directional Move Buttons (`←` / `→`) | ✅ Passed | `src/components/TaskCard.jsx` |
| **P1** | Inline Editing (Title, Description, Priority) | ✅ Passed | `src/components/TaskCard.jsx` |
| **P1** | Conditional Priority CSS Borders (High: Red, Med: Yellow, Low: Green) | ✅ Passed | `src/components/TaskCard.jsx` |
| **P1** | State Persistence via `localStorage` & Seed Data | ✅ Passed | `src/App.jsx` & `src/data/seedData.js` |
| **P2** | Modern Drag-and-Drop (`@dnd-kit`) + `DragOverlay` | ✅ Passed | `src/components/KanbanBoard.jsx` |
| **P2** | Real-Time Global Search & Priority Filter Pills | ✅ Passed | `src/components/Navbar.jsx` & `src/App.jsx` |
| **QA** | Zero Imperative DOM Queries | ✅ Passed | Entire `src/` codebase |
| **QA** | Clean Vercel Production Build (`npm run build`) | ✅ Passed | Root project configuration |
