import { apiRequest } from './http';
import type { Comment, Task, TaskPayload, TaskPriority, TaskStatus, UserSummary } from '../tasks/taskTypes';

export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: 'priority';
};

export function listTasks(filters: TaskFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.sort) params.set('sort', filters.sort);
  const query = params.toString();
  return apiRequest<Task[]>(`/api/tasks${query ? `?${query}` : ''}`);
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

export function listComments(taskId: number) {
  return apiRequest<Comment[]>(`/api/tasks/${taskId}/comments`);
}

export function addComment(taskId: number, body: string) {
  return apiRequest<Comment>(`/api/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export function deleteComment(taskId: number, commentId: number) {
  return apiRequest<void>(`/api/tasks/${taskId}/comments/${commentId}`, { method: 'DELETE' });
}
