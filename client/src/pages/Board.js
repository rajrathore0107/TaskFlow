import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import './Board.css';

const COLUMNS = [
  { id: 'todo',       label: 'To Do',      color: '#6366f1' },
  { id: 'inprogress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done',       label: 'Done',        color: '#10b981' },
];

function Board() {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask]   = useState({ title: '', description: '', column: 'todo' });
  const [draggedTask, setDraggedTask] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
  fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  async function fetchTasks() {
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  function getTasksByColumn(columnId) {
    return tasks.filter(task => task.column === columnId);
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      const task = await createTask(
        newTask.title,
        newTask.description,
        newTask.column
      );
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', column: 'todo' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  function handleDragStart(task) {
    setDraggedTask(task);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  async function handleDrop(columnId) {
    if (!draggedTask) return;
    try {
      await updateTask(draggedTask._id, { column: columnId });
      setTasks(tasks.map(task =>
        task._id === draggedTask._id
          ? { ...task, column: columnId }
          : task
      ));
      setDraggedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0f172a',
        color: '#6366f1',
        fontSize: '18px'
      }}>
        Loading your tasks...
      </div>
    );
  }

  return (
    <div className="board-container">

      <header className="board-header">
        <div className="board-header-left">
          <h1 className="board-logo">TaskFlow</h1>
          <span className="board-subtitle">
            {user.name}'s Workspace
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="add-task-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Task
          </button>
          <button
            className="add-task-btn"
            onClick={handleLogout}
            style={{ background: '#334155' }}
          >
            Logout
          </button>
        </div>
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
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
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
                  key={task._id}
                  className="task-card"
                  draggable
                  onDragStart={() => handleDragStart(task)}
                >
                  <div className="task-card-header">
                    <h3 className="task-title">{task.title}</h3>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      ×
                    </button>
                  </div>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}
                  <div
                    className="task-tag"
                    style={{
                      background: column.color + '22',
                      color: column.color
                    }}
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