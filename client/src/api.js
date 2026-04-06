const BASE_URL = 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
}

export async function getTasks() {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  return response.json();
}

export async function createTask(title, description, column) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ title, description, column }),
  });
  return response.json();
}

export async function updateTask(id, updates) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  return response.json();
}