import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { createTask, getTask, listUsers, updateTask } from '../api/taskApi';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import type { TaskStatus, UserSummary } from './taskTypes';

export function TaskFormPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const editing = Boolean(taskId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [assignedUserId, setAssignedUserId] = useState<number | ''>('');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listUsers()
      .then((loadedUsers) => {
        setUsers(loadedUsers);
        if (!assignedUserId && loadedUsers[0]) {
          setAssignedUserId(loadedUsers[0].id);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load users'));
  }, []);

  useEffect(() => {
    if (!taskId) {
      return;
    }
    getTask(Number(taskId))
      .then((task) => {
        setTitle(task.title);
        setDescription(task.description ?? '');
        setStatus(task.status);
        setAssignedUserId(task.assignedUser.id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load task'));
  }, [taskId]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!assignedUserId) {
      setError('Assigned user is required');
      return;
    }
    const payload = { title, description, status, assignedUserId };
    try {
      if (editing) {
        await updateTask(Number(taskId), payload);
      } else {
        await createTask(payload);
      }
      navigate('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save task');
    }
  }

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <h1>{editing ? 'Edit task' : 'Create task'}</h1>
          <p>Capture work clearly enough for handoff.</p>
        </div>
      </div>
      <form className="task-form" onSubmit={submit}>
        {error && <div className="error">{error}</div>}
        <Input label="Title" value={title} onChange={setTitle} required maxLength={200} />
        <label className="field">
          <span>Description</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
        </label>
        <label className="field">
          <span>Assigned user</span>
          <select value={assignedUserId} onChange={(event) => setAssignedUserId(Number(event.target.value))}>
            {users.map((user) => (
              <option value={user.id} key={user.id}>{user.displayName}</option>
            ))}
          </select>
        </label>
        <Button type="submit" icon={<Save size={18} />}>{editing ? 'Save changes' : 'Create task'}</Button>
      </form>
    </main>
  );
}
