import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, Save, Trash2 } from 'lucide-react';
import { addComment, createTask, deleteComment, getTask, listComments, listUsers, updateTask } from '../api/taskApi';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import type { Comment, TaskPriority, TaskStatus, UserSummary } from './taskTypes';

export function TaskFormPage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const editing = Boolean(taskId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assignedUserId, setAssignedUserId] = useState<number | ''>('');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState('');

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
        setPriority(task.priority);
        setAssignedUserId(task.assignedUser.id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load task'));
    listComments(Number(taskId)).then(setComments).catch(() => {});
  }, [taskId]);

  async function submitComment(event: FormEvent) {
    event.preventDefault();
    if (!commentBody.trim()) return;
    const created = await addComment(Number(taskId), commentBody);
    setComments((prev) => [...prev, created]);
    setCommentBody('');
  }

  function removeComment(commentId: number) {
    deleteComment(Number(taskId), commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!assignedUserId) {
      setError('Assigned user is required');
      return;
    }
    const payload = { title, description, status, priority, assignedUserId };
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
          <span>Priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
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

      {editing && (
        <section className="task-form" style={{ marginTop: 24 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 19 }}>
            <MessageSquare size={18} />
            Comments
            <span style={{ fontWeight: 400, color: 'var(--text-tertiary)', fontSize: 14 }}>
              {comments.length}
            </span>
          </h2>

          {comments.length === 0 && (
            <p style={{ fontSize: 14 }}>No comments yet. Be the first to add one.</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-meta">
                <strong>{c.authorDisplayName}</strong>
                <time>{new Date(c.createdAt).toLocaleString()}</time>
              </div>
              <p className="comment-body">{c.body}</p>
              <button className="comment-delete" onClick={() => removeComment(c.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <form onSubmit={submitComment} style={{ display: 'grid', gap: 10 }}>
            <label className="field">
              <span>Add a comment</span>
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Write a comment…"
                style={{ minHeight: 80 }}
              />
            </label>
            <Button type="submit" variant="secondary" icon={<MessageSquare size={15} />}>
              Post comment
            </Button>
          </form>
        </section>
      )}
    </main>
  );
}
