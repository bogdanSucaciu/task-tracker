import type { TaskPriority } from '../tasks/taskTypes';

const labels: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`priority-badge ${priority.toLowerCase()}`}>{labels[priority]}</span>;
}
