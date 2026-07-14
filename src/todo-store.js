import { readFileSync, writeFileSync, existsSync } from "fs";

const DB_PATH = "./todos.json";

function load() {
  if (!existsSync(DB_PATH)) return [];
  return JSON.parse(readFileSync(DB_PATH, "utf8"));
}

function save(todos) {
  writeFileSync(DB_PATH, JSON.stringify(todos, null, 2));
}

export function listTodos() {
  return load();
}

export function addTodo({ title, url = null, notes = null }) {
  const todos = load();
  const todo = {
    id: Date.now(),
    title,
    url,
    notes,
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  save(todos);
  return todo;
}

export function completeTodo(id) {
  const todos = load();
  const todo = todos.find((t) => t.id === Number(id));
  if (!todo) throw new Error(`Todo ${id} not found`);
  todo.done = true;
  todo.completedAt = new Date().toISOString();
  save(todos);
  return todo;
}

export function deleteTodo(id) {
  const todos = load();
  const idx = todos.findIndex((t) => t.id === Number(id));
  if (idx === -1) throw new Error(`Todo ${id} not found`);
  const [removed] = todos.splice(idx, 1);
  save(todos);
  return removed;
}

export function updateTodo(id, fields) {
  const todos = load();
  const todo = todos.find((t) => t.id === Number(id));
  if (!todo) throw new Error(`Todo ${id} not found`);
  Object.assign(todo, fields, { updatedAt: new Date().toISOString() });
  save(todos);
  return todo;
}
