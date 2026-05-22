import type { TaskStatus } from '../tasks/taskTypes';

const labels: Record<TaskStatus, string> = {
  TODO: 'Todo',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{labels[status]}</span>;
}
