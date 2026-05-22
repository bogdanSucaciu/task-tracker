import { apiRequest } from './http';
import type { Task, TaskPayload, TaskStatus, UserSummary } from '../tasks/taskTypes';

export function listTasks(status?: TaskStatus) {
  const query = status ? `?status=${status}` : '';
  return apiRequest<Task[]>(`/api/tasks${query}`);
}

export function getTask(id: number) {
  return apiRequest<Task>(`/api/tasks/${id}`);
}

export function createTask(payload: TaskPayload) {
  return apiRequest<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTask(id: number, payload: TaskPayload) {
  return apiRequest<Task>(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function updateTaskStatus(id: number, status: TaskStatus) {
  return apiRequest<Task>(`/api/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteTask(id: number) {
  return apiRequest<void>(`/api/tasks/${id}`, { method: 'DELETE' });
}

export function listUsers() {
  return apiRequest<UserSummary[]>('/api/users');
}
