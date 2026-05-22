import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { login } from '../api/authApi';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      auth.setSession(response);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={submit}>
        <h1>Task Tracker</h1>
        <p>Sign in to your workspace.</p>
        {error && <div className="error">{error}</div>}
        <Input label="Email" value={email} onChange={setEmail} type="email" />
        <Input label="Password" value={password} onChange={setPassword} type="password" />
        <Button type="submit" disabled={loading} icon={<LogIn size={18} />}>
          {loading ? 'Signing in' : 'Sign in'}
        </Button>
        <Link to="/register">Create an account</Link>
      </form>
    </main>
  );
}
