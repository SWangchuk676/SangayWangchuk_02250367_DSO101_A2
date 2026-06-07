// __tests__/app.test.js
const { addTodo, getTodos, completeTodo, deleteTodo, clearTodos } = require('../app');

beforeEach(() => {
  clearTodos();
});

test('should add a new todo', () => {
  const todo = addTodo('Buy groceries');
  expect(todo.task).toBe('Buy groceries');
  expect(todo.done).toBe(false);
});

test('should get all todos', () => {
  addTodo('Task 1');
  addTodo('Task 2');
  expect(getTodos().length).toBe(2);
});

test('should complete a todo', () => {
  const todo = addTodo('Do laundry');
  const updated = completeTodo(todo.id);
  expect(updated.done).toBe(true);
});

test('should delete a todo', () => {
  const todo = addTodo('Clean room');
  deleteTodo(todo.id);
  expect(getTodos().length).toBe(0);
});

test('should throw error for empty task', () => {
  expect(() => addTodo('')).toThrow('Task cannot be empty');
});