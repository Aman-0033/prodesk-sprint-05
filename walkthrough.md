# Prodesk IT — Sprint 5 Kanban Board | Comprehensive Walkthrough

This walkthrough provides a complete step-by-step demonstration and visual verification guide for the **Prodesk IT — Sprint 5 Kanban Task Board**. It is formatted for evaluators, QA engineers, and video presentations.

---

## 1. Initial State & 3-Column Layout (Phase 1 / P0)

When first launched at `http://localhost:5173/`, the application immediately loads 5 realistic software engineering tasks distributed across the three standard sprint columns: **`To Do`**, **`In Progress`**, and **`Done`**.

![Initial Board View](./kanban-initial-view.png)

### Verified Key Elements:
- **Header:** Prodesk IT branding, "Sprint 5" badge, "Production Ready" indicator, and quick-action toolbars.
- **Columns:**
  - **To Do:** Displays backlog tasks with live count badge (`2`).
  - **In Progress:** Displays active implementation tasks with live count badge (`2`).
  - **Done:** Displays completed tasks with live count badge (`1`).
- **Tactile Drag Handles & Quick Move Buttons:** Every card displays a dedicated grip handle and directional navigation buttons (`Progress →`, `← To Do`, `Done →`, `← Progress`).

---

## 2. Priority System & Conditional CSS Borders (Phase 2 / P1 — Critical QA Check)

Each task card renders distinct visual styling strictly tied to its `priority` attribute:

| Priority | Left Border Class | Full Subtle Border | Badge Style |
|---|---|---|---|
| 🔴 **High** | `border-l-4 border-red-500` | `border-red-500/60` | Red background pill + Flame icon + Dot |
| 🟡 **Medium** | `border-l-4 border-yellow-400` | `border-yellow-400/60` | Yellow background pill + Shield icon + Dot |
| 🟢 **Low** | `border-l-4 border-emerald-500` | `border-emerald-500/60` | Emerald background pill + Minus icon + Dot |

### Priority Filter Pills Demo:
Clicking the **"High"** priority pill dynamically isolates only High-priority tasks across all columns in real time:

![High Priority Filtered View](./kanban-high-priority-filter.png)

Columns with no matching tasks gracefully display a helpful empty-state message (`No tasks in Done`).

---

## 3. Real-Time Global Search (Phase 3 / P2)

Typing into the search bar instantly filters rendered tasks by matching their title, description, or category tag in real time:

![Search Filter View for 'OAuth'](./kanban-search-filter.png)

### Search Highlights:
- Filters across all 3 columns simultaneously via memoized React state ([`useMemo`](file:///d:/My%20Company%20work/Sprint%205/src/App.jsx#L95)).
- Displays dynamic counter: `"Showing: 1 of 5 tasks"`.
- Provides a one-click clear button (`✕`) inside the search input.

---

## 4. Controlled Task Creation (Phase 1 / P0)

Clicking the **"+ Create Task"** button opens a modal dialog allowing users to enter task details with validation.

![Create Task Modal Dialog](./kanban-create-task-modal.png)

### Form Fields:
1. **Task Title (Required):** Live error validation if empty or whitespace.
2. **Description (Optional):** Multi-line textarea for acceptance criteria.
3. **Priority Level:** Dropdown selecting `High`, `Medium`, or `Low`.
4. **Initial Column:** Assigns task directly to `To Do`, `In Progress`, or `Done`.
5. **Category Tag:** Preset tag pills (`Frontend`, `Backend`, `Architecture`, `DevOps`, `Security`, `UI/UX`, `Testing`).

### Result After Creation:
The newly created task (`Deploy Production Build to Vercel CDN`) appears immediately at the top of the column with full priority border styling:

![Board After Creating Task](./kanban-after-task-created.png)

---

## 5. Column Move Controls (Phase 1 / P0)

Users can advance or return tasks across columns using the directional buttons on each card without dragging:

- Clicking **`Progress →`** on a `To Do` card moves it to `In Progress`.
- Clicking **`Done →`** moves it to `Done`.
- Clicking **`← To Do`** or **`← Progress`** returns it back.

![Task Moved to In Progress](./kanban-task-moved.png)

---

## 6. Inline Task Editing (Phase 2 / P1)

Clicking directly on any task's title or its pencil icon toggles `isEditing` local state, converting static text into focused `<input>` and `<textarea>` controls:

![Inline Editing State](./kanban-inline-editing.png)

### Inline Edit Capabilities:
- **Direct Title Editing:** Modify text directly inside the card container.
- **Description & Priority Selector:** Adjust priority level and tags on the fly.
- **Keyboard Shortcuts:**
  - `Enter`: Saves changes immediately ([`handleSaveEdit`](file:///d:/My%20Company%20work/Sprint%205/src/components/TaskCard.jsx#L123)).
  - `Escape`: Cancels editing and reverts to original values.
- **Button Controls:** Includes dedicated Checkmark (`✓`) and Cancel (`✕`) buttons.

### Result After Saving:
The title updates immutably in state and is automatically saved to `localStorage`:

![Inline Edit Saved](./kanban-inline-edit-saved.png)

---

## 7. Dual Interaction Mode Toggle (P0 / P2 QA Video Feature)

To allow QA evaluators to test both P0 directional buttons and P2 Drag-and-Drop independently, the header includes a **"Quick Move Controls"** toggle:

- **Active:** Shows directional arrow buttons on cards alongside drag handles.
- **Off:** Hides directional arrow buttons for a minimal, pure Drag-and-Drop experience.

![Quick Move Controls Off](./kanban-quick-move-off.png)

---

## 8. Drag-and-Drop Architecture (Phase 3 / P2)

Implemented using **`@dnd-kit/core`** and **`@dnd-kit/sortable`**:
1. **Pointer & Keyboard Sensors:** Configured with a `5px` activation constraint so clicking on buttons, inputs, or edit icons never accidentally initiates a drag.
2. **DragOverlay:** Renders an elevated 3D clone with slight rotation (`rotate-2 scale-105`) and drop shadow during drag gestures.
3. **Cross-Column Dropping & Reordering:** Supports dragging cards across columns and reordering cards vertically within the same column.

---

## 9. State Persistence & Demo Reset (Phase 2 / P1)

- **`localStorage` Synchronization:** Every state mutation (add, edit, delete, move, reorder) is synchronized automatically to key `prodesk_kanban_tasks` via `useEffect`.
- **Lazy Initializer:** Avoids duplicate disk I/O on re-renders by executing `localStorage.getItem` strictly once on mount.
- **Reset Demo Data Button:** One-click button in the header resets the board to the initial 5 software engineering seed tasks.

---

## 10. Verification Summary Checklist

| Phase | Feature Item | Status |
|---|---|---|
| **P0** | 3-Column Board (`To Do`, `In Progress`, `Done`) | ✅ Fully Functional |
| **P0** | Add Task via Controlled Form | ✅ Fully Functional |
| **P0** | Delete Task Action (Trash Icon) | ✅ Fully Functional |
| **P0** | Directional Move Buttons (`←` / `→`) | ✅ Fully Functional |
| **P1** | Inline Task Editing (Title, Desc, Priority) | ✅ Fully Functional |
| **P1** | Conditional Priority CSS Borders (Red, Yellow, Green) | ✅ Verified (Exact Tailwind Classes) |
| **P1** | `localStorage` Persistence & 5 Seed Tasks | ✅ Verified Across Hard Refreshes |
| **P1** | Reset Demo Data Action | ✅ Fully Functional |
| **P2** | Modern Drag-and-Drop (`@dnd-kit`) + `DragOverlay` | ✅ Fully Functional |
| **P2** | Real-Time Global Search Filter | ✅ Fully Functional |
| **P2** | Priority Filter Pills (`All`, `High`, `Medium`, `Low`) | ✅ Fully Functional |
| **QA** | Zero Imperative DOM (`document.getElementById`) | ✅ Verified (Pure Declarative React) |
| **QA** | Clean Vercel Production Build (`npm run build`) | ✅ Verified (Zero Errors / Warnings) |
