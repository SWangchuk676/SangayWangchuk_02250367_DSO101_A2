// app.js
const todos = [];

function addTodo(task) {
  if (!task || task.trim() === '') {
    throw new Error('Task cannot be empty');
  }
  const todo = { id: todos.length + 1, task: task.trim(), done: false };
  todos.push(todo);
  return todo;
}

function getTodos() {
  return todos;
}

function completeTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) throw new Error('Todo not found');
  todo.done = true;
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Todo not found');
  return todos.splice(index, 1)[0];
}

// Clear all todos (useful for testing)
function clearTodos() {
  todos.length = 0;
}

module.exports = { addTodo, getTodos, completeTodo, deleteTodo, clearTodos };