import React, { useState } from 'react';
import './Board.css';

const INITIAL_TASKS = [
  { id: 1, title: 'Design the homepage', description: 'Create wireframes and mockups', column: 'todo' },
  { id: 2, title: 'Set up database', description: 'Configure MongoDB connection', column: 'todo' },
  { id: 3, title: 'Build login page', description: 'Email and password authentication', column: 'inprogress' },
  { id: 4, title: 'Create REST API', description: 'Express routes for tasks', column: 'inprogress' },
  { id: 5, title: 'Deploy to server', description: 'Push to production', column: 'done' },
];

const COLUMNS = [
  { id: 'todo',       label: 'To Do',       color: '#6366f1' },
  { id: 'inprogress', label: 'In Progress',  color: '#f59e0b' },
  { id: 'done',       label: 'Done',         color: '#10b981' },
];

function Board() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', column: 'todo' });
  const [draggedTask, setDraggedTask] = useState(null);

  function getTasksByColumn(columnId) {
    return tasks.filter(task => task.column === columnId);
  }

  function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.title) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      column: newTask.column,
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', column: 'todo' });
    setShowForm(false);
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter(task => task.id !== taskId));
  }

  function handleDragStart(task) {
    setDraggedTask(task);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(columnId) {
    if (!draggedTask) return;
    setTasks(tasks.map(task =>
      task.id === draggedTask.id
        ? { ...task, column: columnId }
        : task
    ));
    setDraggedTask(null);
  }

  return (
    <div className="board-container">

      <header className="board-header">
        <div className="board-header-left">
          <h1 className="board-logo">TaskFlow</h1>
          <span className="board-subtitle">My Workspace</span>
        </div>
        <button
          className="add-task-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Task
        </button>
      </header>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">New Task</h2>
            <form onSubmit={handleAddTask} className="task-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Add more details..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Column</label>
                <select
                  value={newTask.column}
                  onChange={e => setNewTask({...newTask, column: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="board-columns">
        {COLUMNS.map(column => (
          <div
            key={column.id}
            className="column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="column-header">
              <div className="column-title-row">
                <span
                  className="column-dot"
                  style={{ background: column.color }}
                />
                <h2 className="column-title">{column.label}</h2>
              </div>
              <span className="column-count">
                {getTasksByColumn(column.id).length}
              </span>
            </div>

            <div className="column-tasks">
              {getTasksByColumn(column.id).map(task => (
                <div
                  key={task.id}
                  className="task-card"
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <div className="task-card-header">
                    <h3 className="task-title">{task.title}</h3>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      ×
                    </button>
                  </div>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}
                  <div
                    className="task-tag"
                    style={{ background: column.color + '22', color: column.color }}
                  >
                    {column.label}
                  </div>
                </div>
              ))}

              {getTasksByColumn(column.id).length === 0 && (
                <div className="empty-column">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Board;