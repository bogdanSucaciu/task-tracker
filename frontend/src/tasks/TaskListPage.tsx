import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownWideNarrow, Check, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { deleteTask, listTasks, updateTaskStatus } from '../api/taskApi';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import type { Task, TaskPriority, TaskStatus } from './taskTypes';

const statuses: Array<{ label: string; value: TaskStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'Todo', value: 'TODO' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

const priorities: Array<{ label: string; value: TaskPriority | '' }> = [
  { label: 'Any priority', value: '' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
  { label: 'Trivial', value: 'TRIVIAL' },
];

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<TaskPriority | ''>('');
  const [sortByPriority, setSortByPriority] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      setTasks(await listTasks({
        status: status || undefined,
        priority: priority || undefined,
        sort: sortByPriority ? 'priority' : undefined,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load tasks');
    }
  }

  useEffect(() => {
    void load();
  }, [status, priority, sortByPriority]);

  async function markDone(task: Task) {
    await updateTaskStatus(task.id, task.status === 'DONE' ? 'IN_PROGRESS' : 'DONE');
    await load();
  }

  async function remove(task: Task) {
    await deleteTask(task.id);
    await load();
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>Tasks</h1>
          <p>Filter, update, and assign work.</p>
        </div>
        <Link className="link-button" to="/tasks/new"><Plus size={16} />Create task</Link>
      </div>
      <div className="filter-bar">
        <div className="filters">
          {statuses.map((option) => (
            <button
              className={status === option.value ? 'active' : ''}
              key={option.label}
              onClick={() => setStatus(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="filters">
          {priorities.map((option) => (
            <button
              className={priority === option.value ? 'active' : ''}
              key={option.label}
              onClick={() => setPriority(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <Button
          variant={sortByPriority ? 'primary' : 'secondary'}
          onClick={() => setSortByPriority((value) => !value)}
          icon={<ArrowDownWideNarrow size={15} />}
        >
          Sort by priority
        </Button>
      </div>
      {error && <div className="error">{error}</div>}
      <section className="task-list">
        {tasks.map((task) => (
          <article key={task.id} className="task-row">
            <div>
              <Link to={`/tasks/${task.id}/edit`} className="task-title">{task.title}</Link>
              <p>{task.description || 'No description'}</p>
              <small>
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {task.assignedUser.displayName}
              </small>
            </div>
            <div className="row-actions">
              <Button
                variant="secondary"
                onClick={() => void markDone(task)}
                icon={task.status === 'DONE' ? <RotateCcw size={15} /> : <Check size={15} />}
              >
                {task.status === 'DONE' ? 'Reopen' : 'Done'}
              </Button>
              <Button variant="danger" onClick={() => void remove(task)} icon={<Trash2 size={15} />}>
                Delete
              </Button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
