import { useId, useMemo, useState } from "react";

export default function App() {
  const addInputId = useId();

  const [text, setText] = useState("");
  const [todos, setTodos] = useState([
    { id: 1, title: "Learn React basics", done: false },
    { id: 2, title: "Build a portfolio project", done: true },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const remainingCount = useMemo(
    () => todos.filter((t) => !t.done).length,
    [todos]
  );

  const addTodo = (e) => {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;

    setTodos((prev) => [{ id: Date.now(), title, done: false }, ...prev]);
    setText("");
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = (id) => {
    const title = editText.trim();
    if (!title) return;

    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
    setEditingId(null);
    setEditText("");
  };

  return (
    <main className="page">
      <header className="header">
        <h1 className="title">Todo App</h1>
        <p className="subtitle">
          <strong>{remainingCount}</strong> remaining
        </p>
      </header>

      <section className="card" aria-label="Add a new todo">
        <form className="row" onSubmit={addTodo}>
          <div className="field">
            <label className="label" htmlFor={addInputId}>
              New task
            </label>
            <input
              id={addInputId}
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Practice CSS grid"
              autoComplete="off"
            />
          </div>
          <button className="btn primary" type="submit">
            Add
          </button>
        </form>
        <p className="hint">Tip: Use Tab to navigate. Press Enter to add.</p>
      </section>

      <section className="card" aria-label="Todo list">
        <ul className="list">
          {todos.map((t) => (
            <li key={t.id} className="item">
              {editingId === t.id ? (
                <div className="row wrap">
                  <div className="field grow">
                    <label className="label" htmlFor={`edit-${t.id}`}>
                      Edit task
                    </label>
                    <input
                      id={`edit-${t.id}`}
                      className="input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className="actions">
                    <button
                      className="btn primary"
                      type="button"
                      onClick={() => saveEdit(t.id)}
                    >
                      Save
                    </button>
                    <button className="btn" type="button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row wrap">
                  <label className="toggle grow">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTodo(t.id)}
                    />
                    <span className={t.done ? "done" : ""}>{t.title}</span>
                  </label>

                  <div className="actions">
                    <button className="btn" type="button" onClick={() => startEdit(t)}>
                      Edit
                    </button>
                    <button
                      className="btn danger"
                      type="button"
                      onClick={() => deleteTodo(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty" role="status">
            No todos yet. Add one above.
          </p>
        )}
      </section>
    </main>
  );
}