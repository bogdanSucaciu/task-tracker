import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { deleteTask, listTasks, updateTaskStatus } from '../api/taskApi';
import { Button } from '../components/Button';
import type { Task, TaskStatus } from './taskTypes';

const statuses: Array<{ label: string; value: TaskStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'Todo', value: 'TODO' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

export function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      setTasks(await listTasks(status || undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load tasks');
    }
  }

  useEffect(() => {
    void load();
  }, [status]);

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
        <Link className="link-button" to="/tasks/new">Create task</Link>
      </div>
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
      {error && <div className="error">{error}</div>}
      <section className="task-list">
        {tasks.map((task) => (
          <article key={task.id} className="task-row">
            <div>
              <Link to={`/tasks/${task.id}/edit`} className="task-title">{task.title}</Link>
              <p>{task.description || 'No description'}</p>
              <small>{task.assignedUser.displayName} · {task.status.replace('_', ' ')}</small>
            </div>
            <div className="row-actions">
              <Button variant="secondary" onClick={() => void markDone(task)}>
                {task.status === 'DONE' ? 'Reopen' : 'Done'}
              </Button>
              <Button variant="danger" onClick={() => void remove(task)} icon={<Trash2 size={16} />}>Delete</Button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
