# Prompt Ladder Assignment — Frontend AI Engineering (React)

## Topic
Improving a frontend coding prompt through five iterations (one change at a time).  
**Project:** Todo App UI (React + Vite, frontend-only)

---

## Baseline (Run #1)
### Prompt
Build a todo app frontend.

### Representative Output (excerpt)
```jsx
import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), title: text, done: false }]);
    setText("");
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div>
      <h1>Todo App</h1>
      {/* simple input + list */}
    </div>
  );
}
```

### Notes
- **What changed in the prompt:** None (baseline).
- **What improved in the output:** N/A.
- **What still failed:** Prompt was too vague; no clear feature list (especially edit), no structure, no run steps, no testing guidance.
- **What I would try next:** Add a **clearer goal** (exact features).

---

## Version 1 (Run #2) — Layer: Clearer Goal
### Prompt
Build a Todo app frontend in React with these features: add a task, list tasks, toggle complete, edit a task title, and delete a task.

### Representative Output (excerpt)
```jsx
const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");

const startEdit = (todo) => {
  setEditingId(todo.id);
  setEditText(todo.title);
};

const saveEdit = (id) => {
  // update title in todos
};
```

### Notes
- **What changed in the prompt:** Added a clearer goal (explicit feature list).
- **What improved in the output:** Output included a proper **edit flow** (editing state + Save/Cancel) instead of only add/toggle/delete.
- **What still failed:** Still missing project context (Vite? beginner? no backend?) and no “how to run” instructions.
- **What I would try next:** Add **real context**.

---

## Version 2 (Run #3) — Layer: Real Context
### Prompt
Build a Todo app frontend in React with these features: add a task, list tasks, toggle complete, edit a task title, and delete a task. This is for a beginner portfolio project using Vite + React, with no backend (use local component state only).

### Representative Output (excerpt)
```jsx
// Portfolio-friendly: keep everything local (no backend)
const [todos, setTodos] = useState([
  { id: 1, title: "Learn React basics", done: false },
  { id: 2, title: "Build a portfolio project", done: true },
]);
```

### Notes
- **What changed in the prompt:** Added real context (beginner portfolio + Vite + no backend).
- **What improved in the output:** Output matched a **frontend-only** approach (local state) instead of assuming an API/backend.
- **What still failed:** Response still not well organized; harder to reuse fast.
- **What I would try next:** Specify an **output format**.

---

## Version 3 (Run #4) — Layer: Specified Output Format
### Prompt
Build a Todo app frontend in React with these features: add a task, list tasks, toggle complete, edit a task title, and delete a task. This is for a beginner portfolio project using Vite + React, with no backend (use local component state only).  
Organize your answer into exactly these sections:  
1) File/Component Structure  
2) Code  
3) How to Run  
4) Manual Test Steps

### Representative Output (excerpt)
- **File/Component Structure:** `src/App.jsx`, `src/main.jsx`, `src/index.css`  
- **Code:** `App.jsx` code in one place  
- **How to Run:** `npm install` + `npm run dev`  
- **Manual Test Steps:** add / toggle / edit / delete checks

### Notes
- **What changed in the prompt:** Added a specified output format (4 sections).
- **What improved in the output:** Output became **easy to scan** and easier to copy/paste into a project.
- **What still failed:** Code quality guidance missing (a11y/semantic/responsive).
- **What I would try next:** Add **quality criteria**.

---

## Version 4 (Run #5) — Layer: Quality Criteria
### Prompt
Build a Todo app frontend in React with these features: add a task, list tasks, toggle complete, edit a task title, and delete a task. This is for a beginner portfolio project using Vite + React, with no backend (use local component state only).  
Organize your answer into exactly these sections:  
1) File/Component Structure  
2) Code  
3) How to Run  
4) Manual Test Steps  
Quality criteria: use semantic HTML, accessible form labels, keyboard-friendly controls, and a mobile-first responsive layout.

### Representative Output (excerpt)
```jsx
<main className="page">
  <header className="header">
    <h1 className="title">Todo App</h1>
  </header>

  <label className="label" htmlFor={inputId}>New task</label>
  <input id={inputId} className="input" />

  <label className="toggle">
    <input type="checkbox" checked={t.done} onChange={...} />
    <span className={t.done ? "done" : ""}>{t.title}</span>
  </label>
</main>
```

### Notes
- **What changed in the prompt:** Added quality criteria (semantic HTML + a11y + keyboard + responsive).
- **What improved in the output:** Better semantics, proper labels, keyboard-friendly toggle (checkbox), and responsive layout ideas.
- **What still failed (honest):** This made the output **much longer** (more HTML/CSS). For a beginner it can feel heavy and slower to paste/understand.
- **What I would try next:** Add **verification requirements** so the output ends with assumptions + checklist.

---

## Version 5 (Run #6) — Layer: Verification Requirements
### Prompt
Build a Todo app frontend in React with these features: add a task, list tasks, toggle complete, edit a task title, and delete a task. This is for a beginner portfolio project using Vite + React, with no backend (use local component state only).  
Organize your answer into exactly these sections:  
File/Component Structure  
Code  
How to Run  
Manual Test Steps  
Quality criteria: use semantic HTML, accessible form labels, keyboard-friendly controls, and a mobile-first responsive layout.  
**At the very end add:**  
1) **Assumptions** (3 bullets)  
2) **Verification Checklist** (6 checkboxes)

### Representative Output (excerpt)
**Assumptions**
- Fresh Vite + React project; `main.jsx` imports `index.css`.
- Frontend-only; todos reset on refresh.
- `Date.now()` IDs are fine for a beginner demo.

**Verification Checklist**
- [ ] Add todo works (button + Enter).
- [ ] Toggle works with keyboard (Tab + Space).
- [ ] Edit + Save updates title.
- [ ] Cancel exits edit mode without saving.
- [ ] Delete removes todo safely.
- [ ] Mobile width layout still usable.

### Notes
- **What changed in the prompt:** Added verification requirements (assumptions + checklist).
- **What improved in the output:** Output ended with clear **self-check steps** and highlighted limitations (no persistence).
- **What still failed:** Output got longer and slightly repetitive.
- **What I would try next:** Make verification optional or add constraints (e.g., limit total lines).

---

# Final Reusable Prompt (for strangers)
Build a Todo app frontend in React for a beginner portfolio project using Vite + React. No backend—use local component state only.  
**Features:** add a task, list tasks, toggle complete, edit a task title, and delete a task.  
Organize your answer into exactly these sections:  
1) File/Component Structure  
2) Code  
3) How to Run  
4) Manual Test Steps  
**Quality criteria:** semantic HTML, accessible form labels, keyboard-friendly controls, mobile-first responsive layout.  
Finish with:  
(A) Assumptions (3 bullets)  
(B) Verification Checklist (6 checkboxes)