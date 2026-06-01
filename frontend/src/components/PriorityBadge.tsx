import type { TaskPriority } from '../tasks/taskTypes';

const labels: Record<TaskPriority, string> = {
  TRIVIAL: 'Trivial',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`priority-badge ${priority.toLowerCase()}`}>{labels[priority]}</span>;
}
