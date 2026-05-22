import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTasks } from '../api/taskApi';
import type { Task } from './taskTypes';

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listTasks()
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load tasks'));
  }, []);

  const counts = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === 'TODO').length,
      progress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
      done: tasks.filter((task) => task.status === 'DONE').length,
    }),
    [tasks],
  );

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>{tasks.length} active records across the team.</p>
        </div>
        <Link className="link-button" to="/tasks/new">Create task</Link>
      </div>
      {error && <div className="error">{error}</div>}
      <section className="metrics">
        <div><strong>{counts.todo}</strong><span>Todo</span></div>
        <div><strong>{counts.progress}</strong><span>In progress</span></div>
        <div><strong>{counts.done}</strong><span>Done</span></div>
      </section>
      <section className="recent">
        <h2>Recent tasks</h2>
        {tasks.slice(0, 5).map((task) => (
          <Link to={`/tasks/${task.id}/edit`} key={task.id} className="recent-row">
            <span>{task.title}</span>
            <small>{task.status.replace('_', ' ')}</small>
          </Link>
        ))}
      </section>
    </main>
  );
}
