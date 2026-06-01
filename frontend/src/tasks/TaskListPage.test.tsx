import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, test, expect } from 'vitest';
import { TaskListPage } from './TaskListPage';

vi.mock('../api/taskApi', () => ({
  listTasks: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: 'Review release workflow',
      description: 'Check automation',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedUser: { id: 1, email: 'dev@example.com', displayName: 'Dev User' },
      createdAt: '2026-05-16T10:00:00Z',
      updatedAt: '2026-05-16T10:00:00Z',
    },
  ]),
  updateTaskStatus: vi.fn(),
  deleteTask: vi.fn(),
}));

test('renders loaded tasks', async () => {
  render(
    <MemoryRouter>
      <TaskListPage />
    </MemoryRouter>,
  );

  expect(await screen.findByText('Review release workflow')).toBeInTheDocument();
  expect(screen.getByText(/Dev User/)).toBeInTheDocument();

  const priorityBadge = screen.getByText('High', { selector: '.priority-badge' });
  expect(priorityBadge).toBeInTheDocument();
  expect(priorityBadge).toHaveClass('priority-badge', 'high');
});
